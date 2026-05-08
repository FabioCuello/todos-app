# Todos App

A full-stack task management application built with React, Express, and PostgreSQL.

## Requirements

- [Docker](https://www.docker.com/products/docker-desktop/) (Docker Desktop or Docker Engine with Compose)

Or for local development without Docker:

- Node.js >= 22
- [pnpm](https://pnpm.io/) (do **not** use npm — peer dependency conflicts will prevent installation)
- PostgreSQL 16

## Getting Started

### Option 1: Docker (recommended)

```bash
git clone https://github.com/FabioCuello/todos-app.git
cd todos-app
docker compose up --build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 2: Local Development

**1. Set up PostgreSQL**

Create a database called `task_manager` and run the init script:

```bash
psql -U postgres -c "CREATE DATABASE task_manager;"
psql -U postgres -d task_manager -f docker_postgres_init.sql
```

**2. Backend**

```bash
cd task-manager-backend
cp .env.template .env    # Edit if your DB credentials differ
pnpm install
pnpm dev                 # Starts on http://localhost:3001
```

**3. Frontend**

```bash
cd task-manager-frontend
pnpm install
pnpm dev                 # Starts on http://localhost:5173, proxies /api to :3001
```

## What You Can Do

- Create tasks with a title and optional description
- Mark tasks as completed
- Undo completed tasks back to pending
- Delete tasks (soft delete)
- Filter by status (All / Pending / Completed)
- Search by title or description
- Pagination

## Running Tests

```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from test-runner
```

This spins up a dedicated test database with seed data and runs 13 E2E tests with Playwright.

## Tech Stack

**Backend:** Node.js, Express 5, PostgreSQL, Zod, TypeScript

**Frontend:** React 19, Vite, React Query, Tailwind CSS v4, Shadcn/ui, TypeScript

**Testing:** Playwright (E2E)

**Infrastructure:** Docker Compose (3 services: PostgreSQL, Backend, Frontend)

## Project Structure

```
├── docker-compose.yml              # Dev environment
├── docker-compose.test.yml         # Test environment
├── docker_postgres_init.sql        # DB schema + seed data
├── docker_postgres_init_test.sql   # Test DB schema + seed data
├── task-manager-backend/           # Express API
│   └── src/
│       ├── api/controllers/        # HTTP layer
│       ├── services/               # Business logic
│       └── repositories/           # Data access (SQL)
└── task-manager-frontend/          # React SPA
    └── src/
        ├── app/                    # App providers + pages
        ├── api/                    # HTTP client + API functions
        ├── components/
        │   ├── ui/                 # Atoms (Shadcn)
        │   ├── molecules/          # Small compositions
        │   └── organisms/          # Feature sections
        ├── hooks/                  # React Query hooks
        └── types/                  # Domain types
```
