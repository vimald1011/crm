from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as authRouter
from app.database import Base, engine
from app.models.recruiter import Lead
from app.routes.recruiter import router as recruiter_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recruiter_router)
app.include_router(authRouter)

@app.get("/")
def home():
    return {"message": "Recruiter CRM Backend Running Successfully"}