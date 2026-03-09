from fastapi import APIRouter, HTTPException, Depends, status
from models.user_model import UserRegister, UserLogin
from database import SessionLocal, User
from utils.security import get_password_hash, verify_password, create_access_token
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister, db: Session = Depends(get_db)):
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Prepare the user instance
    new_user = User(
        name=user.name,
        phone=user.phone,
        email=str(user.email) if user.email else None,
        password=hashed_password,
        role=user.role.value
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Automatically generate a token for immediate login after registration
        access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
        
        return {
            "user": {
                "id": str(new_user.id),
                "name": new_user.name,
                "role": new_user.role
            },
            "tokens": {
                "access": {
                    "token": access_token
                }
            }
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email OR Phone number is already registered"
        )
    except Exception as e:
        db.rollback()
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@router.post("/login", response_model=dict)
async def login_user(user: UserLogin, db: Session = Depends(get_db)):
    # Find user
    db_user = db.query(User).filter(User.phone == user.phone).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Verify password
    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Generate JWT
    access_token = create_access_token(data={"sub": str(db_user.id), "role": db_user.role})
    
    return {
        "user": {
            "id": str(db_user.id),
            "name": db_user.name,
            "role": db_user.role
        },
        "tokens": {
            "access": {
                "token": access_token
            }
        }
    }
