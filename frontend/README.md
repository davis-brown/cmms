# Church Membership Management System: Frontend

The church membership management application is a web application made for a local church to help store information about the church members, and keep track of events that involved the church.

This repository is the Vue single-page app. The REST API lives in [cmms-backend](https://github.com/davis-brown/cmms-backend).

**Stack:** Vue 2, Vuetify, Vue Router, Vuex, Axios

**Features:** member directory with CSV export, families and family photos, groups, an events calendar with attendance, life events, a printable PDF church directory, and role-based access (user / moderator / admin).

## Quick start with Docker (recommended)

The backend repo has a `docker-compose.yml` that runs MySQL, the API and this frontend together. Clone both repositories into the same parent folder:

```bash
git clone https://github.com/davis-brown/cmms-backend.git
git clone https://github.com/davis-brown/cmms-frontend.git
cd cmms-backend
docker compose up --build
```

Then open **http://localhost:8081** and log in with **`demo` / `demo1234`**. The database starts with sample members, families, groups and events.

## Running without Docker

Needs Node.js 18 or newer (see `.nvmrc`).

1. Start the backend first. It must be running on `http://localhost:8080`; see the [backend README](https://github.com/davis-brown/cmms-backend#running-without-docker).
2. Install and start the dev server:
   ```bash
   npm install
   npm run serve -- --port 8081
   ```
3. Open **http://localhost:8081** and log in with `demo` / `demo1234`.

In development the app calls the API at `http://localhost:8080/api/`. A production build (`npm run build`) calls `/api/` on the same host, which the included `nginx.conf` proxies to the backend.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run serve` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | Lint the source |

## Project layout

```
src/views/        Pages (members, families, groups, calendar, login, ...)
src/components/   Reusable pieces (family/group cards, calendar, PDF directory)
src/services/     Axios wrappers for each API resource
src/store/        Vuex auth state
src/router.js     Routes
nginx.conf        Serves the production build and proxies /api to the backend
```
