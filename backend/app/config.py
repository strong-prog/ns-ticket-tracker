from functools import cached_property

import bcrypt
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Настройки из переменных окружения с префиксом NS_TICKET_. Пароль хешируется bcrypt."""
    database_url: str = "postgresql://postgres:postgres@localhost:5432/ns_tickets"
    admin_username: str
    admin_password: str
    enforce_https: bool = False

    model_config = {
        "env_prefix": "NS_TICKET_",
        "env_file": ".env",
        "extra": "ignore",
    }

    @cached_property
    def password_hash(self) -> bytes:
        return bcrypt.hashpw(self.admin_password.encode(), bcrypt.gensalt())


settings = Settings()
