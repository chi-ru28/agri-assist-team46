from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal, CropReport, User
from auth import get_current_user
import base64
from google import genai
import os
import json
from datetime import datetime

router = APIRouter()

# Initialize Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

ANALYSIS_PROMPT = """
You are an expert agricultural plant pathologist. Analyze the provided image of a crop or plant.

Identify any visible diseases, pests, nutrient deficiencies, or signs of poor health.
If the plant appears healthy, state that it is healthy.

Provide a structured response in exactly this JSON format. Do not include markdown formatting or extra text outside the JSON.

{
  "disease_name": "Name of the disease/issue (or 'Healthy' or 'Unidentified')",
  "confidence_score": 0.0 to 1.0,
  "analysis_result": "Detailed explanation of what you see and why you reached this conclusion.",
  "recommendation": {
    "chemical": "Specific chemical treatment, dosage, and brand if applicable (or 'None needed' if healthy)",
    "precautions": "Any safety measures to take"
  },
  "organic_alternative": "Natural/organic ways to treat or prevent this issue (e.g., Neem oil, compost teas)."
}
"""

@router.post("/analyze")
async def analyze_crop(
    image: UploadFile = File(...),
    crop_name: str = Form("Unknown"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Analyzes an uploaded crop image using Gemini Vision and returns a structured report.
    """
    user_id = current_user.get("id") or current_user.get("sub")
    
    # Verify user exists
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Validate image
    content_type = image.content_type or "image/jpeg"
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read and encode image to base64
        contents = await image.read()
        image_data = base64.b64encode(contents).decode("utf-8")
        
        # Determine target language for prompt based on user preference
        language_map = {"en": "English", "hi": "Hindi", "gu": "Gujarati"}
        user_lang = db_user.preferred_language if hasattr(db_user, 'preferred_language') else "en"
        target_language = language_map.get(user_lang, "English")
        
        localized_prompt = ANALYSIS_PROMPT + f"\n\nCRITICAL: You MUST return the JSON with all string values (except keys) translated into {target_language}."

        # Prepare Gemini Request
        gemini_contents = [
            {"role": "user", "parts": [
                {"text": localized_prompt},
                {"inline_data": {"mime_type": content_type, "data": image_data}}
            ]}
        ]

        # Call Gemini Pro Vision / Flash
        # Using gemini-2.0-flash as it supports multimodal and is fast/cost-effective
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=gemini_contents
        )
        
        response_text = response.text
        
        # Clean up potential markdown formatting around JSON
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "", 1).replace("```", "")
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "", 1).replace("```", "")
            
        response_text = response_text.strip()
        analysis_data = json.loads(response_text)
        
        # Persist to Database
        new_report = CropReport(
            user_id=db_user.id,
            crop_name=crop_name,
            analysis_result=analysis_data.get("analysis_result", "No details provided."),
            recommendation=analysis_data.get("recommendation", {}),
            image_url="Uploaded image (base64 omitted for db)", # In a real app, upload to S3/Cloud Storage and save URL
            created_at=datetime.utcnow()
        )
        
        # We might need to add organic_alternative to CropReport if it missing, or just stash it in recommendation
        if "organic_alternative" in analysis_data:
             if isinstance(new_report.recommendation, dict):
                 new_report.recommendation["organic_alternative"] = analysis_data["organic_alternative"]
                 
        # Also let's stash disease_name and score in recommendation if they don't have columns
        if isinstance(new_report.recommendation, dict):
             new_report.recommendation["disease_name"] = analysis_data.get("disease_name", "Unknown")
             new_report.recommendation["confidence"] = analysis_data.get("confidence_score", 0.0)

        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        return {
            "success": True,
            "report_id": str(new_report.id),
            "disease_name": analysis_data.get("disease_name", "Unknown"),
            "confidence_score": analysis_data.get("confidence_score", 0.0),
            "analysis_result": new_report.analysis_result,
            "recommendation": new_report.recommendation,
        }

    except json.JSONDecodeError:
         print(f"Failed to parse gemini response: {response.text}")
         raise HTTPException(status_code=500, detail="Failed to parse AI response.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Vision Analysis Error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing image analysis."
        )

@router.get("/history")
async def get_analysis_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Fetches the user's past crop analysis reports.
    """
    user_id = current_user.get("id") or current_user.get("sub")
    reports = db.query(CropReport).filter(CropReport.user_id == user_id).order_by(CropReport.created_at.desc()).all()
    
    return [
        {
            "id": str(r.id),
            "crop_name": r.crop_name,
            "analysis_result": r.analysis_result,
            "recommendation": r.recommendation,
            "created_at": r.created_at.isoformat()
        } for r in reports
    ]
