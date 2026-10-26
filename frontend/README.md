# Church Membership Management System: Frontend

The church membership management application is a web application made for a local church to help store information about the church members, and keep track of events that involved the church.

This folder is the Vue single-page app. The REST API is in [`../backend`](../backend).

**Stack:** Vue 3, Vuetify 3, Vue Router 4, Vuex 4, Axios

**Features:** member directory with CSV export, families and family photos, groups, an events calendar with attendance, life events, a printable PDF church directory, and role-based access (user / moderator / admin).

## Quick start with Docker (recommended)

Run `docker compose up --build` from the repo root, then open **http://localhost:8081** and log in with **`demo` / `demo1234`**. See the [root README](../README.md).

## Running without Docker

Needs Node.js 18 or newer (see `.nvmrc`).

1. Start the backend first. It must be running on `http://localhost:8080`; see the [backend README](../backend/README.md#running-without-docker).
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

## Home page photos

The home page header shows the church window photo (`src/assets/riversidewindow.jpg`)
under a blue wash, and each of the four areas below it has its own picture
(`members.jpg`, `big-family.jpg`, `group.jpg`, `calendarpicture.jpg` in `src/assets/`).
To change one, replace the file and keep its name, or point `src/views/HomePage.vue` at
a new file: the area pictures are `import`s at the top of the script, and the window
is the `url(...)` in `.home-welcome`'s style. Only use photos the church has the rights to.
