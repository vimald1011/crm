from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.security import SECRET_KEY, ALGORITHM

security = HTTPBearer()

def getDb():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def getCurrentUser(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(getDb)
):

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        userId = payload.get("userId")

        if userId is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.id == userId
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user