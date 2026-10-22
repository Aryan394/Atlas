# Atlas

A personal workspace for tracking money, job applications, and tasks.

Sign in, then open a module from the home screen:

- **Expense Tracker** — income and expenses, categories, and monthly spending
- **Job Applications** — companies, links, interview rounds, and status (`Applied`, `In progress`, `Shortlisted`, `Rejected`)
- **To-Do List** — tasks with notes, due times, and completion

Signed-in users can also add another account from **Add user**.

## Project structure

| Folder | Description |
|--------|-------------|
| `API/` | ASP.NET Core REST API (PostgreSQL, JWT auth, EF Core, MongoDB logging) |
| `UI/` | React frontend (Vite, TypeScript, Tailwind CSS) |

## Getting started

### API

1. Copy `API/.env.example` to `API/.env`.
2. Set `ConnectionStrings__DefaultConnection` to your PostgreSQL connection string.
3. Optional: set `MongoLogging__ConnectionString` to write application logs to MongoDB. Leave it empty to skip Mongo logging.
4. Run from the `API` folder:

```bash
dotnet watch
```

API runs at `http://localhost:5236`. Swagger is available at `/swagger` in development.

### UI

1. Copy `UI/.env.example` to `UI/.env` if needed. `VITE_API_URL` defaults to `http://localhost:5236`.
2. Run from the `UI` folder:

```bash
npm install
npm run dev
```

UI runs at `http://localhost:5173`.

## API

All routes except register and login require a Bearer token.

| Area | Base path |
|------|-----------|
| Accounts | `api/Account` (`register`, `login`) |
| Transactions | `api/transactions` |
| Job applications | `api/job-applications` |
| Todos | `api/todos` |

## Tech stack

- **Backend:** .NET 10, Entity Framework Core, PostgreSQL, JWT, MongoDB.Driver
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router
