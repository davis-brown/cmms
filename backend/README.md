# Church Membership Management System
The church membership management application is a web application made for a local church to help store information about the church members, and keep track of events that involved the church.

This is the backend of the web application.

## Running locally
Requires Node 22+ and MySQL.

```sh
brew install mysql && brew services start mysql   # macOS; any MySQL 8 works
mysql -u root -e "CREATE DATABASE congregations;"
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:8080` and restarts when you edit code. Tables and
user roles are created automatically on first start. New sign-ups get the `user`
role; to make yourself an admin:

```sh
mysql -u root congregations -e "INSERT INTO user_roles (userId, roleId) SELECT id, 3 FROM users WHERE username = 'you';"
```

## Configuration
The server reads secrets from environment variables:

| Variable | Required | Description |
| --- | --- | --- |
| `JWT_SECRET` | Yes | Secret used to sign login tokens. Use a long random value, e.g. `openssl rand -hex 32`. |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD` | Production | MySQL connection details (see `config/prod.db.config.js`). |
| `DB_PORT`, `DB_NAME` | No | Default to `3306` and `congregations`. |
| `CORS_ORIGIN` | Production | Comma-separated frontend URLs allowed to call the API. Defaults to `http://localhost:8081`. |

Locally, these come from `.env` (see `.env.example`). On the server, put them in
`/home/ubuntu/nodeapps/congregation-backend.env`, which `congregation-backend.service` loads.

Deploys run from GitHub Actions when a PR into `dev-branch` is merged. They need two
repository secrets: `SERVER_HOST` (the server's hostname or IP) and `SERVER_SSH_KEY`
(a private key whose public key is in the server's `~/.ssh/authorized_keys`).
