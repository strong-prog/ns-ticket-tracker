# ROADMAP — NS Ticket Tracker

## Этап 1 — Бэкенд (ядро)

- [ ] `requirements.txt` — fastapi, uvicorn, sqlalchemy, pydantic
- [ ] `models.py` — SQLAlchemy модель `Ticket` + `init_db()`
- [ ] `schemas.py` — Pydantic: `TicketCreate`, `TicketRead`, `TicketUpdateStatus`, `TicketList` (с пагинацией)
- [ ] `auth.py` — Basic Auth, проверка `admin:admin`, зависимость `get_admin`
- [ ] `main.py` — эндпоинты:
  - [ ] `POST /auth/login` — Basic-логин
  - [ ] `POST /tickets` — создать заявку
  - [ ] `GET /tickets` — список (status, priority, search, sort_by, order, page, limit)
  - [ ] `PATCH /tickets/{id}/status` — изменить статус (бизнес-правила)
  - [ ] `DELETE /tickets/{id}` — удалить (админ, не done)
  - [ ] `GET /health` — проверка

## Этап 2 — Фронтенд (React + TypeScript)

- [ ] `npm create vite` — React + TypeScript
- [ ] `api.ts` — HTTP-клиент к бэкенду (fetch, baseUrl, auth-хедер)
- [ ] `types.ts` — Ticket, TicketList, статусы, приоритеты
- [ ] Компоненты:
  - [ ] `App.tsx` — состояние: tickets, filters, admin, loading, error
  - [ ] `AdminLogin.tsx` — форма логина (admin:admin)
  - [ ] `TicketTable.tsx` — таблица заявок, колонки: title, status, priority, created_at, actions
  - [ ] `SearchBar.tsx` — инпут поиска по title/description
  - [ ] `FilterBar.tsx` — дропдауны status + priority
  - [ ] `SortControls.tsx` — сортировка по дате / приоритету
  - [ ] `TicketForm.tsx` — форма создания заявки (title, description, priority)
  - [ ] `StatusChanger.tsx` — кнопки/дропдаун смены статуса
  - [ ] `Pagination.tsx` — пагинация (page, limit, total)

## Этап 3 — Интеграция и проверка

- [ ] Vite proxy → FastAPI :8000
- [ ] Проверка всех состояний: загрузка, пустой список, ошибки API
- [ ] Проверка бизнес-правил через UI
- [ ] Инициализация git-репозитория
