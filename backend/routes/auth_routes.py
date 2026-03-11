from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, User
from models.user_model import UserRegister, UserLogin
from utils.security import create_access_token, get_password_hash, verify_password
from auth import decode_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- REGISTER USER ----------------
@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister, db: Session = Depends(get_db)):
    # Check if email is already registered
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    # Password complexity validation
    import re
    password = user.password
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    if not re.search("[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")
    if not re.search("[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
    if not re.search("[0-9]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")
    if not re.search("[@#$%^&+=!_]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one special character (@#$%^&+=!_)")

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Prepare the user instance
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
        preferred_language=user.language or 'en',
        is_active=True
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
        
        return {
            "user": {
                "id": str(new_user.id),
                "name": new_user.name,
                "role": new_user.role,
                "preferred_language": new_user.preferred_language
            },
            "tokens": {
                "access": {
                    "token": access_token
                }
            }
        }
    except Exception as e:
        db.rollback()
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

# ---------------- LOGIN USER ----------------
@router.post("/login", response_model=dict)
async def login_user(request: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    db_user = db.query(User).filter(User.email == request.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please register first.",
        )
        
    # Verify password
    if not verify_password(request.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    # Generate JWT
    access_token = create_access_token(data={"sub": str(db_user.id), "role": db_user.role})
    
    return {
        "user": {
            "id": str(db_user.id),
            "name": db_user.name,
            "role": db_user.role,
            "preferred_language": db_user.preferred_language
        },
        "tokens": {
            "access": {
                "token": access_token
            }
        }
    }


# ---------------- UPDATE LANGUAGE ----------------
@router.put("/language")
async def update_language(
    lang_data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(decode_token)
):

    user_id = current_user.get("id") or current_user.get("sub")

    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_lang = lang_data.get("language")

    if new_lang in ["en", "hi", "gu"]:
        db_user.preferred_language = new_lang
        db.commit()

        return {
            "message": "Language updated",
            "language": new_lang
        }

    raise HTTPException(status_code=400, detail="Invalid language code")