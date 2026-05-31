# Moneytize

A personal finance app for tracking transactions, monitoring monthly spending, and managing accounts.

## Project structure

| Folder | Description |
|--------|-------------|
| `API/` | ASP.NET Core REST API (PostgreSQL, JWT auth, EF Core) |
| `UI/` | React frontend (Vite, TypeScript, Tailwind CSS) |
| `AI/` | AI services *(coming soon)* |

## Getting started

### API

1. Copy `API/.env.example` to `API/.env` and set your database connection string.
2. Run from the `API` folder:

```bash
dotnet watch
```

API runs at `http://localhost:5236`. Swagger is available at `/swagger` in development.

### UI

1. Copy `UI/.env.example` to `UI/.env` if needed.
2. Run from the `UI` folder:

```bash
npm install
npm run dev
```

UI runs at `http://localhost:5173`.

## AI features *(planned)*

The `AI/` module will add a **voice assistant** that lets users manage their finances through natural conversation.

Instead of navigating the UI manually, users will be able to speak requests such as:

- *"How much did I spend this month?"*
- *"Add a $45 grocery expense for today."*
- *"Show my transactions from last week."*

The assistant will interpret the request, call the appropriate Moneytize API endpoints, and respond with a spoken or text summary of the result.

> **Status:** Not yet implemented. The current app provides the API and UI foundation this layer will build on.

## Tech stack

- **Backend:** .NET 8, Entity Framework Core, PostgreSQL (Supabase), JWT
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **AI:** TBD
