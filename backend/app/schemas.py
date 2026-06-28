import math
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TicketCreate(BaseModel):
    """Входная схема создания заявки. Отклоняет неизвестные поля (extra=forbid)."""
    model_config = ConfigDict(extra="forbid")

    title: str = Field(..., min_length=3, max_length=120)
    description: str | None = Field(None, max_length=1000)
    priority: str = Field(default="normal", pattern="^(low|normal|high)$")

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("title must not be blank")
        return stripped

    @field_validator("description")
    @classmethod
    def description_strip(cls, v: str | None) -> str | None:
        if v is not None:
            stripped = v.strip()
            return stripped if stripped else None
        return None


class TicketUpdateStatus(BaseModel):
    """Смена статуса заявки. Допустимы: new, in_progress, done."""
    model_config = ConfigDict(extra="forbid")

    status: str = Field(..., pattern="^(new|in_progress|done)$")


class TicketRead(BaseModel):
    """Выходная схема заявки. Строится из ORM-модели (from_attributes=True)."""
    id: int
    title: str
    description: str | None
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TicketStats(BaseModel):
    """Агрегаты для мини-дашборда: всего заявок, по статусам, по приоритетам."""
    total: int
    by_status: dict[str, int]
    by_priority: dict[str, int]


class TicketList(BaseModel):
    items: list[TicketRead]
    total: int
    page: int
    limit: int
    pages: int

    @classmethod
    def build(cls, items: list[TicketRead], total: int, page: int, limit: int) -> "TicketList":
        return cls(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=max(1, math.ceil(total / limit)) if total > 0 else 0,
        )
