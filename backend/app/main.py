from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.auth import router as authRouter
from app.database import Base, engine
from app.models.recruiter import Lead
from app.routes.recruiter import router as recruiter_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:4200",
    "https://crm-blush-eight-91.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(
    request: Request,
    exc: Exception
):
    print(f"Unhandled Error: {exc}")

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred"
        }
    )


app.include_router(recruiter_router)
app.include_router(authRouter)


@app.get("/")
def home():
    return {
        "message": "Recruiter CRM Backend Running Successfully"
    }