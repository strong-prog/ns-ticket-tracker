# NS Ticket Tracker

Тестовое задание Fullstack-разработчик — ООО «Сетевые решения».

Приложение для учёта внутренних заявок: создание, фильтрация, поиск, сортировка,
изменение статуса, удаление админом.

## Стек

- **Backend**: Python 3.12 + FastAPI + SQLAlchemy + SQLite
- **Frontend**: React 18 + TypeScript + Vite
- **Аутентификация**: Basic Auth (admin:admin)

## Структура

```
ns-ticket-tracker/
├── backend/
│   ├── main.py          # FastAPI приложение + эндпоинты
│   ├── models.py        # SQLAlchemy модель Ticket
│   ├── schemas.py       # Pydantic схемы
│   ├── auth.py          # Basic Auth
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api.ts           # HTTP-клиент к бэкенду
│   │   ├── components/
│   │   │   ├── TicketTable.tsx
│   │   │   ├── TicketForm.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── SortControls.tsx
│   │   │   ├── StatusChanger.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── Pagination.tsx
│   │   └── types.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── ROADMAP.md
```

## Быстрый старт

### Бэкенд

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Swagger: http://localhost:8000/docs

### Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Фронтенд на http://localhost:5173, прокси к бэкенду через Vite.

## Бизнес-правила

- Админ: `admin:admin`, нужен только для удаления заявок
- Заявку в статусе `done` нельзя редактировать или удалять
- Нельзя перевести заявку из `done` обратно в другой статус
- Фильтрация, поиск, сортировка, пагинация — на бэкенде

## API

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/auth/login` | Все | Basic-вход админа |
| POST | `/tickets` | Все | Создать заявку |
| GET | `/tickets` | Все | Список (фильтр/поиск/сорт/пагинация) |
| PATCH | `/tickets/{id}/status` | Все | Изменить статус |
| DELETE | `/tickets/{id}` | Админ | Удалить заявку |
