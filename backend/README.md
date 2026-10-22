# Church Membership Management System: Backend

The church membership management application is a web application made for a local church to help store information about the church members, and keep track of events that involved the church.

This folder is the REST API. The Vue frontend is in [`../frontend`](../frontend).

**Stack:** Node.js, Express, Sequelize, MySQL, JWT authentication

## Quick start with Docker (recommended)

Run `docker compose up --build` from the repo root; see the [root README](../README.md).

## Running without Docker

Requires Node 22+ and MySQL 8.

```sh
brew install mysql && brew services start mysql   # macOS; any MySQL 8 works
mysql -u root -e "CREATE DATABASE congregations;"
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:8080/api/` and restarts when you edit code. Tables and
user roles are created automatically on first start, and because `.env.example` sets
`SEED_DEMO_DATA=true`, so are the `demo` / `demo1234` login and sample data.

Then start the frontend by following the instructions in [`../frontend`](../frontend/README.md#running-without-docker).

New sign-ups get the `user` role; to make an account an admin:

```sh
mysql -u root congregations -e "INSERT INTO user_roles (userId, roleId) SELECT id, 3 FROM users WHERE username = 'you';"
```

## Accounts

New sign-ups can't log in until an admin approves them on the Users page (Admin Board),
where admins can also change roles and delete accounts. Accounts that existed before
approval was added are approved automatically on upgrade. Failed logins are limited to
10 per username and 20 per address every 15 minutes.

## Configuration

All settings are environment variables; see [`.env.example`](.env.example).

| Variable | Required | Description |
| --- | --- | --- |
| `JWT_SECRET` | Yes | Secret used to sign login tokens. Use a long random value, e.g. `openssl rand -hex 32`. With `NODE_ENV=production`, the server won't start if it's shorter than 32 characters. |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD` | Production | MySQL connection. Locally they default to `localhost`, `root` and an empty password. |
| `DB_PORT`, `DB_NAME` | No | Default to `3306` and `congregations`. |
| `DB_LOGGING` | No | `true` prints every SQL query. |
| `PORT` | No | API port. Defaults to `8080`. |
| `CORS_ORIGIN` | Production | Comma-separated frontend URLs allowed to call the API. Defaults to `http://localhost:8081`. |
| `TRUST_PROXY` | Behind a proxy | Number of reverse proxies (e.g. nginx) in front of the API, usually `1`. Without it, login rate limits treat every visitor as the proxy's address. |
| `SEED_DEMO_DATA` | No | `true` creates the demo user and sample data on an empty database. Never set it on a real server. |
| `DEMO_USERNAME`, `DEMO_PASSWORD` | No | Demo login. Default to `demo` and `demo1234`. |

On the server, put these in `/home/ubuntu/nodeapps/congregation-backend.env`, which
`congregation-backend.service` loads.

Deploys run from GitHub Actions only when started by hand: on GitHub, open **Actions →
Deploy backend to staging → Run workflow**. It deploys `main`. It needs two
repository secrets: `SERVER_HOST` (the server's hostname or IP) and `SERVER_SSH_KEY`
(a private key whose public key is in the server's `~/.ssh/authorized_keys`).

## Project layout

```
server.js        Express app setup, startup, database sync
seed.js          Roles, plus the optional demo user and sample data
config/          Database and auth settings (read from environment)
models/          Sequelize models and associations
controllers/     Route handlers
routes/          API route definitions
middleware/      JWT verification and sign-up checks
```

## API overview

| Resource | Base path |
| --- | --- |
| Auth (sign up / sign in) | `/api/auth` |
| People | `/api/person` |
| Families / family members | `/api/families`, `/api/familyperson` |
| Groups / group members | `/api/group`, `/api/groupmember` |
| Events / attendees | `/api/events`, `/api/attendee` |
| Life events | `/api/lifeevent`, `/api/lifeventperson` |
| Contacts | `/api/communications`, `/api/personcontact` |
| Congregations | `/api/congregation` |
