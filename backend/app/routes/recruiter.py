from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.recruiter import Lead
from app.models.user import User

from app.schemas.recruiter import (
    LeadCreate,
    LeadResponse
)

from app.dependencies.auth import getCurrentUser


router = APIRouter(
    prefix="/leads",
    tags=["Leads"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/", response_model=LeadResponse)
def create_lead(
    lead: LeadCreate,

    currentUser: User = Depends(getCurrentUser),

    db: Session = Depends(get_db)
):

    new_lead = Lead(
        recruiterName=lead.recruiterName,
        companyName=lead.companyName,
        contactNumber=lead.contactNumber,

        cctc=lead.cctc,
        ectc=lead.ectc,

        jobType=lead.jobType,

        status=lead.status,

        createdDate=lead.createdDate,
        followUpDate=lead.followUpDate,

        notes=lead.notes,

        userId=currentUser.id
    )

    db.add(new_lead)

    db.commit()

    db.refresh(new_lead)

    return new_lead


@router.get("/", response_model=list[LeadResponse])
def get_leads(
    search: str | None = Query(default=None),

    currentUser: User = Depends(getCurrentUser),

    db: Session = Depends(get_db)
):

    query = db.query(Lead).filter(
        Lead.userId == currentUser.id
    )

    if search:

        query = query.filter(
            (Lead.recruiterName.ilike(f"%{search}%")) |

            (Lead.companyName.ilike(f"%{search}%"))
        )

    leads = query.all()

    return leads


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: int,

    updated_lead: LeadCreate,

    currentUser: User = Depends(getCurrentUser),

    db: Session = Depends(get_db)
):

    lead = db.query(Lead).filter(
    Lead.id == lead_id,
    Lead.userId == currentUser.id
).first()

    if not lead:

        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    lead.recruiterName = updated_lead.recruiterName
    lead.companyName = updated_lead.companyName
    lead.contactNumber = updated_lead.contactNumber

    lead.cctc = updated_lead.cctc
    lead.ectc = updated_lead.ectc

    lead.jobType = updated_lead.jobType

    lead.status = updated_lead.status

    lead.createdDate = updated_lead.createdDate
    lead.followUpDate = updated_lead.followUpDate

    lead.notes = updated_lead.notes

    db.commit()

    db.refresh(lead)

    return lead


@router.delete("/{lead_id}")
def delete_lead(
    lead_id: int,

    currentUser: User = Depends(getCurrentUser),

    db: Session = Depends(get_db)
):

    lead = db.query(Lead).filter(
    Lead.id == lead_id,
    Lead.userId == currentUser.id
).first()

    if not lead:

        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    db.delete(lead)

    db.commit()

    return {
        "message": "Lead deleted successfully"
    }