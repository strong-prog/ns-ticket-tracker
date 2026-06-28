import enum
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class TicketStatus(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TicketPriority(str, enum.Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    status: Mapped[TicketStatus] = mapped_column(
        SAEnum(TicketStatus), default=TicketStatus.NEW, nullable=False
    )
    priority: Mapped[TicketPriority] = mapped_column(
        SAEnum(TicketPriority), default=TicketPriority.NORMAL, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
