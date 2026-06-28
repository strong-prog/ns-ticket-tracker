# ROADMAP — NS Ticket Tracker

## Этап 1 — Бэкенд (ядро) ✅

- [x] `requirements.txt` — fastapi, uvicorn, sqlalchemy, pydantic, pydantic-settings, bcrypt, slowapi, psycopg2-binary
- [x] `app/config.py` — pydantic-settings, env-префикс `NS_TICKET_`, bcrypt password_hash
- [x] `app/database.py` — sync engine, `get_db` dependency
- [x] `app/models.py` — SQLAlchemy 2.0 style (`Mapped[]`, `mapped_column`), Python Enum
- [x] `app/schemas.py` — Pydantic v2: `TicketCreate`, `TicketRead`, `TicketUpdateStatus`, `TicketList`, `extra="forbid"`
- [x] `app/crud.py` — бизнес-логика: фильтрация, ILIKE-поиск, whitelist-сортировка, пагинация
- [x] `app/exceptions.py` — `TicketNotFoundError` (404), `TicketIsDoneError` (409), `InvalidStatusTransitionError` (422)
- [x] `app/auth.py` — Basic Auth, `secrets.compare_digest`, bcrypt.checkpw, `require_admin` зависимость
- [x] `app/limiter.py` — slowapi Limiter с `get_remote_address`
- [x] `app/routers/auth.py` — `POST /auth/login` (rate-limited: 5/minute)
- [x] `app/routers/tickets.py` — CRUD `/tickets` с DI-зависимостями
- [x] `app/main.py` — `create_app()` factory, CORS, глобальный exception handler, HTTPSRedirectMiddleware, `Base.metadata.create_all()`
- [x] Тесты — 28 тестов (pytest + TestClient + in-memory SQLite), все проходят

## Этап 2 — Фронтенд (React + TypeScript) ✅

- [x] Vite + React 18 + TypeScript
- [x] Tailwind CSS v3 (PostCSS)
- [x] `src/types/ticket.ts` — Ticket, TicketCreate, TicketList, TicketFilters
- [x] `src/api/client.ts` — Axios instance, auth interceptor
- [x] `src/api/tickets.ts` — fetchTickets, create, updateStatus, delete, loginAdmin
- [x] `src/hooks/useTickets.ts` — TanStack Query v5: useTickets, useCreateTicket, useUpdateTicketStatus, useDeleteTicket
- [x] `src/hooks/useAuth.tsx` — AuthContext + AuthProvider + useAuth
- [x] `src/components/` (15 компонентов): Layout, AdminLogin, TicketTable, TicketDetailModal, TicketForm, SearchBar, FilterBar, SortControls, StatusChanger, Pagination, LoadingSpinner, ErrorMessage, EmptyState
- [x] `App.tsx` — оркестратор: стейт фильтров, композиция компонентов
- [x] `main.tsx` — QueryClientProvider + AuthProvider

## Этап 3 — Интеграция и проверка ✅

- [x] Vite proxy `/api` → FastAPI `:8000`
- [x] TypeScript type-check: чисто
- [x] Vite build: успешна
- [x] Проверка бизнес-правил через curl
- [x] Все состояния: loading, empty, error
- [x] Git-репозиторий инициализирован
- [x] `.gitignore` — Python, Node, IDE, env, БД
- [x] Удалён лишний корневой `.venv`

---

## Этап 4 — Аудит безопасности ✅

- [x] Timing-атаки: `secrets.compare_digest` ✅
- [x] SQL-инъекции: параметризованные запросы ORM + whitelist-сортировка ✅
- [x] XSS: React-экранирование, нет `dangerouslySetInnerHTML` ✅
- [x] Авторизация: `require_admin` на каждом DELETE ✅
- [x] Бизнес-правила: done-тикеты не редактируются/не удаляются ✅
- [x] Валидация: Pydantic v2, все поля с ограничениями ✅
- [x] CORS: конкретный origin, не `*` ✅
- [x] Утечка данных в ошибках: не найдена ✅

## Этап 5 — Продакшен-харденинг ✅

### Критичные

- [x] **bcrypt-хеширование** — пароль хранится как bcrypt-хеш, проверка через `checkpw`
- [x] **Rate limiting** — `POST /auth/login` ограничен 5 запросами/минуту через slowapi
- [x] **Секреты в env** — `admin_username` и `admin_password` только из переменных окружения, без дефолтов
- [x] **HTTPS** — `HTTPSRedirectMiddleware` с `Strict-Transport-Security`, включается флагом `NS_TICKET_ENFORCE_HTTPS`

### Желательные

- [x] **`extra="forbid"`** — Pydantic-схемы отклоняют запросы с неизвестными полями (422)
- [x] **Глобальный exception handler** — `@app.exception_handler(Exception)` с логированием traceback и безопасным 500
- [x] **PostgreSQL** — дефолтный `database_url` на PostgreSQL, `.env.example` показывает оба варианта (PostgreSQL/SQLite)

### Информационно (текущий дизайн приемлем)

- CORS `allow_methods="*"` — допустимо при одном доверенном origin
- Одна роль (admin) — соответствует требованиям
- `GET /tickets/{id}` отсутствует — 405 вместо 404, не уязвимость

---

## Этап 6 — Комплексное тестирование и правки ✅

- [x] 28/28 автотестов пройдены
- [x] Ручное API-тестирование: 97 проверок (auth, CRUD, фильтры, поиск, сортировка, пагинация)
- [x] Аудит безопасности: bcrypt, timing-атаки, SQL-инъекции, XSS, CORS, rate limiting
- [x] Нагрузочное: 50 заявок за 733ms, поиск 13ms
- [x] `TEST_REPORT.md` — полный отчёт о тестировании
- [x] **DEFECT-01 (High) исправлен** — Vite proxy не обрезал префикс `/api`, фронтенд был неработоспособен. Добавлен `rewrite` в `vite.config.ts`
- [x] **DEFECT-02 (Low) исправлен** — неиспользуемый импорт в `FilterBar.tsx` блокировал `tsc -b`. Импорт удалён
- [x] TypeScript: 0 ошибок
- [x] Vite build: успешна (394KB JS + 12KB CSS)

---

## Этап 7 — i18n и UI-улучшения ✅

- [x] Установка `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- [x] `src/i18n/en.json` — 55 ключей, каноническая структура
- [x] `src/i18n/ru.json` — 55 ключей, русские переводы
- [x] `src/i18n/index.ts` — инициализация, fallback `ru`, localStorage-детекция
- [x] `src/i18n/react-i18next.d.ts` — типизированный `t()` через declaration merging
- [x] `main.tsx` — обёртка в `<I18nextProvider>`
- [x] Все 15 компонентов переведены, хардкод-строки удалены
- [x] `Layout.tsx` — language switcher (RU/EN), `i18n.changeLanguage()`
- [x] `TicketForm.tsx` — zod-схема в `useMemo([t])`, динамические сообщения валидации
- [x] `TicketTable.tsx` — заголовки, priority-бейджи, кнопка удаления
- [x] `TicketDetailModal.tsx` — попап с деталями заявки, удаление с подтверждением
- [x] Удаление админом — двухшаговое подтверждение (таблица + попап)
- [x] `id`/`name`/`autoComplete` на всех элементах форм
- [x] `favicon.svg` — устранён 404

### Аудит i18n

- [x] EN ↔ RU: 55/55 ключей идентичны
- [x] Компоненты → en.json: 55/55 ключей существуют
- [x] Неиспользуемых ключей: 0
- [x] TypeScript type-check: 0 ошибок
