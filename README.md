# NS Ticket Tracker

Приложение для учёта внутренних заявок: создание, фильтрация, поиск, сортировка,
изменение статуса, удаление админом.

## Стек

- **Backend**: Python 3.12 + FastAPI + SQLAlchemy + PostgreSQL (или SQLite для разработки)
- **Frontend**: React 18 + TypeScript + Vite + i18next (RU/EN)
- **Безопасность**: bcrypt-хеширование, rate limiting (slowapi), HTTPS-ready
- **Аутентификация**: Basic Auth (учётные данные через переменные окружения)

## Структура

```
ns-ticket-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI-приложение, CORS, exception handler
│   │   ├── config.py         # pydantic-settings (env-переменные, bcrypt-хеш)
│   │   ├── database.py       # SQLAlchemy engine, SessionLocal, get_db
│   │   ├── models.py         # ORM-модель Ticket (SQLAlchemy 2.0 style)
│   │   ├── schemas.py        # Pydantic v2 схемы с extra="forbid"
│   │   ├── crud.py           # Бизнес-логика (фильтрация, поиск, пагинация)
│   │   ├── auth.py           # Basic Auth (bcrypt.checkpw, secrets.compare_digest)
│   │   ├── exceptions.py     # Кастомные HTTPException (404, 409, 422)
│   │   ├── limiter.py        # slowapi Limiter instance
│   │   └── routers/
│   │       ├── auth.py       # POST /auth/login (rate-limited)
│   │       └── tickets.py    # CRUD /tickets
│   ├── tests/
│   │   ├── conftest.py       # Фикстуры (in-memory SQLite, TestClient, auth header)
│   │   ├── test_tickets.py   # Тесты CRUD + бизнес-правил
│   │   └── test_auth.py      # Тесты аутентификации + exception handler
│   ├── .env.example          # Шаблон переменных окружения
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── api/
│   │   │   ├── client.ts     # Axios + auth-интерсептор
│   │   │   └── tickets.ts   # API-функции
│   │   ├── hooks/
│   │   │   ├── useTickets.ts    # TanStack Query v5 + useStats + useOverdueCount
│   │   │   ├── useAuth.tsx      # AuthContext + useAuth
│   │   │   └── useSavedFilters.ts  # localStorage-пресеты фильтров
│   │   ├── i18n/
│   │   │   ├── index.ts      # i18next init (fallback ru, localStorage)
│   │   │   ├── en.json       # Английские переводы
│   │   │   ├── ru.json       # Русские переводы
│   │   │   └── react-i18next.d.ts  # Типизированный t()
│   │   ├── types/ticket.ts
│   │   └── components/
│   │       ├── Layout.tsx
│   │       ├── DashboardStats.tsx       # Мини-дашборд (4 карточки + приоритеты)
│   │       ├── OverdueBanner.tsx        # Баннер зависших заявок >3 дней
│   │       ├── SavedFiltersDropdown.tsx # Сохранённые виды фильтров
│   │       ├── TicketTable.tsx
│   │       ├── TicketDetailModal.tsx
│   │       ├── TicketForm.tsx
│   │       ├── SearchBar.tsx
│   │       ├── FilterBar.tsx
│   │       ├── SortControls.tsx
│   │       ├── StatusChanger.tsx
│   │       ├── AdminLogin.tsx
│   │       ├── Pagination.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── EmptyState.tsx
│   ├── test/
│   │   ├── setup.ts                     # Vitest setup (happy-dom, cleanup)
│   │   ├── utils.tsx                    # renderWithProviders (i18n wrapper)
│   │   ├── useSavedFilters.test.ts
│   │   ├── OverdueBanner.test.tsx
│   │   └── DashboardStats.test.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
├── README.md
├── ROADMAP.md
└── TEST_REPORT.md
```

## Быстрый старт

### Переменные окружения

Создайте `.env` из шаблона:

```bash
cp backend/.env.example backend/.env
```

Обязательные переменные: `NS_TICKET_ADMIN_USERNAME`, `NS_TICKET_ADMIN_PASSWORD`, `NS_TICKET_DATABASE_URL`.

### Бэкенд

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Swagger: http://localhost:8000/docs

### Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Фронтенд на http://localhost:5173, прокси к бэкенду через Vite.

### Тесты

**Бэкенд (32 теста):**
```bash
cd backend
.venv/bin/python -m pytest tests/ -v
```

**Фронтенд (13 тестов):**
```bash
cd frontend
npm test
```

## Бизнес-правила

- Админ: учётные данные из `NS_TICKET_ADMIN_USERNAME` / `NS_TICKET_ADMIN_PASSWORD`, только для удаления заявок
- Заявку в статусе `done` нельзя редактировать или удалять
- Нельзя перевести заявку из `done` обратно в другой статус
- Удаление админом — двухшаговое подтверждение (таблица + попап)
- Клик по заголовку заявки открывает карточку с полными данными
- Дашборд: 4 карточки (всего/новых/в работе/завершённых) + распределение по приоритетам
- Баннер зависших заявок: жёлтое предупреждение для заявок в работе дольше 3 дней, клик — фильтрация + автоскролл к таблице
- Сохранённые фильтры: пресеты в localStorage, переключение в один клик
- Интерфейс на русском и английском, переключение в шапке, сохранение в localStorage
- Фильтрация, поиск, сортировка, пагинация — на бэкенде
- `POST /auth/login` ограничен 5 запросами в минуту
- Запросы с неизвестными полями отклоняются (422)

## API

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/auth/login` | Все | Basic-вход админа (rate-limited) |
| POST | `/tickets` | Все | Создать заявку |
| GET | `/tickets` | Все | Список (фильтр/поиск/сорт/пагинация) |
| GET | `/tickets/stats` | Все | Агрегаты по статусам и приоритетам |
| PATCH | `/tickets/{id}/status` | Все | Изменить статус |
| DELETE | `/tickets/{id}` | Админ | Удалить заявку |

### Параметры GET /tickets

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `status` | string | — | Фильтр: `new`, `in_progress`, `done` |
| `priority` | string | — | Фильтр: `low`, `normal`, `high` |
| `search` | string | — | Поиск по title и description |
| `sort_by` | string | `created_at` | Сортировка: `title`, `status`, `priority`, `created_at`, `updated_at` |
| `order` | string | `desc` | Направление: `asc`, `desc` |
| `page` | int | `1` | Номер страницы |
| `limit` | int | `20` | Элементов на странице |
