from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
    UserResponse
)

from app.dependencies.auth import getCurrentUser
from app.models.user import User

from app.security import (
    hashPassword,
    verifyPassword,
    createAccessToken
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

def getDb():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def signup(
    request: SignupRequest,
    db: Session = Depends(getDb)
):

    existingUser = db.query(User).filter(
        User.email == request.email
    ).first()

    if existingUser:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    newUser = User(
        fullName=request.fullName,
        email=request.email,
        hashedPassword=hashPassword(request.password)
    )

    db.add(newUser)
    db.commit()
    db.refresh(newUser)

    return {
        "message": "User created successfully"
    }


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(getDb)
):

    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    validPassword = verifyPassword(
        request.password,
        user.hashedPassword
    )

    if not validPassword:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    accessToken = createAccessToken(
        data={
            "userId": user.id,
            "email": user.email
        }
    )

    return {
        "access_token": accessToken,
        "token_type": "bearer"
    }

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    currentUser: User = Depends(getCurrentUser)
):
    return currentUser