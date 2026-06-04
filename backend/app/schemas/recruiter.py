from pydantic import BaseModel


class LeadCreate(BaseModel):
    recruiterName: str
    companyName: str
    contactNumber: str

    cctc: str | None = None
    ectc: str | None = None

    jobType: str

    status: str

    createdDate: str | None = None
    followUpDate: str | None = None

    notes: str | None = None


class LeadResponse(BaseModel):
    id: int

    recruiterName: str
    companyName: str
    contactNumber: str

    cctc: str | None = None
    ectc: str | None = None

    jobType: str

    status: str

    createdDate: str | None = None
    followUpDate: str | None = None

    notes: str | None = None

    class Config:
        from_attributes = True