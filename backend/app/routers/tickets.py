from fastapi import APIRouter, Depends, Query

from ..auth import require_admin
from ..crud import create_ticket, delete_ticket, get_ticket, get_tickets, ticket_to_read
from ..database import get_db
from ..schemas import TicketCreate, TicketList, TicketRead, TicketUpdateStatus

router = APIRouter()


@router.post("", response_model=TicketRead, status_code=201)
def create(data: TicketCreate, db=Depends(get_db)):
    ticket = create_ticket(db, data)
    return ticket_to_read(ticket)


@router.get("", response_model=TicketList)
def list_tickets(
    status: str | None = Query(None),
    priority: str | None = Query(None),
    search: str | None = Query(None),
    sort_by: str = Query("created_at"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db=Depends(get_db),
):
    items, total = get_tickets(
        db,
        status=status,
        priority=priority,
        search=search,
        sort_by=sort_by,
        order=order,
        page=page,
        limit=limit,
    )
    return TicketList.build(
        items=[ticket_to_read(t) for t in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.patch("/{ticket_id}/status", response_model=TicketRead)
def update_status(
    ticket_id: int,
    data: TicketUpdateStatus,
    db=Depends(get_db),
):
    from ..crud import update_ticket_status

    ticket = get_ticket(db, ticket_id)
    updated = update_ticket_status(db, ticket, data.status)
    return ticket_to_read(updated)


@router.delete("/{ticket_id}", status_code=204)
def delete(
    ticket_id: int,
    db=Depends(get_db),
    _admin: str = Depends(require_admin),
):
    ticket = get_ticket(db, ticket_id)
    delete_ticket(db, ticket)
