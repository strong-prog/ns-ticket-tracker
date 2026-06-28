from fastapi import HTTPException, status


class TicketNotFoundError(HTTPException):
    def __init__(self, ticket_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with id {ticket_id} not found",
        )


class TicketIsDoneError(HTTPException):
    def __init__(self, action: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot {action} a ticket with status 'done'",
        )


class InvalidStatusTransitionError(HTTPException):
    def __init__(self, current: str, target: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Cannot transition from '{current}' to '{target}'",
        )
