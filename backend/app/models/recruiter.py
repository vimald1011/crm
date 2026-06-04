from sqlalchemy import Column, Integer, String
from sqlalchemy import ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    recruiterName = Column(String, nullable=False)
    companyName = Column(String, nullable=False)
    contactNumber = Column(String, nullable=False)

    cctc = Column(String, nullable=True)
    ectc = Column(String, nullable=True)

    jobType = Column(String, nullable=False)

    status = Column(String, nullable=False)

    createdDate = Column(String, nullable=True)
    followUpDate = Column(String, nullable=True)

    notes = Column(String, nullable=True)

    userId = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="leads"
    )