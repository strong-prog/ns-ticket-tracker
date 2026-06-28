from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from .exceptions import TicketIsDoneError, TicketNotFoundError
from .models import Ticket, TicketStatus
from .schemas import TicketCreate, TicketRead


def create_ticket(db: Session, data: TicketCreate) -> Ticket:
    """Создать заявку со статусом new."""
    ticket = Ticket(
        title=data.title,
        description=data.description,
        priority=data.priority,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def get_tickets(
    db: Session,
    *,
    status: str | None = None,
    priority: str | None = None,
    search: str | None = None,
    sort_by: str = "created_at",
    order: str = "desc",
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Ticket], int]:
    """Список заявок с фильтрацией, ILIKE-поиском, whitelist-сортировкой и пагинацией."""
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)
    if priority:
        query = query.filter(Ticket.priority == priority)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(Ticket.title.ilike(pattern), Ticket.description.ilike(pattern))
        )

    allowed_sort_columns = {"created_at", "priority", "status", "title", "updated_at"}
    if sort_by in allowed_sort_columns:
        sort_column = getattr(Ticket, sort_by)
        if order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(Ticket.created_at.desc())

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    return items, total


def get_ticket(db: Session, ticket_id: int) -> Ticket:
    """Получить заявку по ID или выбросить TicketNotFoundError."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if ticket is None:
        raise TicketNotFoundError(ticket_id)
    return ticket


def update_ticket_status(db: Session, ticket: Ticket, new_status: str) -> Ticket:
    """Изменить статус заявки. Для done-заявок выбрасывает TicketIsDoneError."""
    if ticket.status == TicketStatus.DONE:
        raise TicketIsDoneError("change status of")

    ticket.status = new_status
    db.commit()
    db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket: Ticket) -> None:
    """Удалить заявку. Для done-заявок выбрасывает TicketIsDoneError."""
    if ticket.status == TicketStatus.DONE:
        raise TicketIsDoneError("delete")
    db.delete(ticket)
    db.commit()


def ticket_to_read(ticket: Ticket) -> TicketRead:
    """Преобразовать ORM-модель в Pydantic-схему для ответа API."""
    return TicketRead.model_validate(ticket)


def get_ticket_stats(db: Session) -> dict:
    """Агрегаты: сколько заявок по статусам и приоритетам."""
    status_rows = (
        db.query(Ticket.status, func.count(Ticket.id))
        .group_by(Ticket.status)
        .all()
    )
    by_status = {row[0]: row[1] for row in status_rows}

    priority_rows = (
        db.query(Ticket.priority, func.count(Ticket.id))
        .group_by(Ticket.priority)
        .all()
    )
    by_priority = {row[0]: row[1] for row in priority_rows}

    total = sum(by_status.values())

    return {"total": total, "by_status": by_status, "by_priority": by_priority}
