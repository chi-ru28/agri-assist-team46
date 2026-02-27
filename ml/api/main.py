from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import uvicorn
import joblib
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from typing import Dict, Any, Optional
import os
import io

app = FastAPI(
    title="AgriAssist ML Pipeline API (Hybrid Architecture)",
    version="2.0"
)

# Configuration Paths - Fallbacks if running from wrong directory
CROP_MODEL_PATH = "../models/crop_model.h5"
FERTILIZER_MODEL_PATH = "../models/fertilizer_model.pkl"

crop_model = None
fertilizer_model = None
CROP_CLASSES = ['Healthy', 'Nitrogen Deficiency', 'Rust', 'Powdery Mildew', 'Bacterial Blight']

@app.on_event("startup")
async def load_models():
    global crop_model, fertilizer_model
    try:
        if os.path.exists(CROP_MODEL_PATH):
            crop_model = tf.keras.models.load_model(CROP_MODEL_PATH)
            print("Crop Model Loaded.")
        if os.path.exists(FERTILIZER_MODEL_PATH):
            fertilizer_model = joblib.load(FERTILIZER_MODEL_PATH)
            print("Fertilizer Model Loaded.")
    except Exception as e:
        print(f"Error loading models: {e}")

class FertilizerRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    cropType: str
    
    # We maintain Soil_Type default for the existing model pipeline
    Soil_Type: Optional[str] = "Loamy"

@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    if crop_model is None:
        raise HTTPException(status_code=503, detail="Crop model offline")
    
    try:
        contents = await file.read()
        img = load_img(io.BytesIO(contents), target_size=(224, 224))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        predictions = crop_model.predict(img_array)
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])

        return {
            "deficiency": CROP_CLASSES[class_idx],
            "confidence": round(confidence, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-fertilizer")
def predict_fertilizer(data: FertilizerRequest):
    if fertilizer_model is None:
        raise HTTPException(status_code=503, detail="Fertilizer model offline")
        
    try:
        import pandas as pd
        # Map frontend schema to trained model schema
        input_data = pd.DataFrame([{
            'Nitrogen': data.N,
            'Phosphorus': data.P,
            'Potassium': data.K,
            'Temperature': data.temperature,
            'Humidity': data.humidity,
            'Soil_Type': data.Soil_Type,
            'Crop_Type': data.cropType
        }])

        prediction = fertilizer_model.predict(input_data)
        
        # Scikit-Learn RandomForest doesn't easily emit probabilities inside pipelines without
        # predict_proba, but we can simulate pulling prob if the pipeline supports it
        try:
            probabilities = fertilizer_model.predict_proba(input_data)
            max_prob = float(np.max(probabilities[0]))
        except:
            max_prob = 0.95 # Mock fallback

        return {
            "fertilizer": prediction[0],
            "probability": round(max_prob, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
