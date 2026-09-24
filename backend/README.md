# Church Membership Management System
The church membership management application is a web application made for a local church to help store information about the church members, and keep track of events that involved the church.

This is the backend of the web application.

## Configuration
The server reads secrets from environment variables:

| Variable | Required | Description |
| --- | --- | --- |
| `JWT_SECRET` | Yes | Secret used to sign login tokens. Use a long random value, e.g. `openssl rand -hex 32`. |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD` | Production | MySQL connection details (see `config/prod.db.config.js`). |
| `DB_PORT`, `DB_NAME` | No | Default to `3306` and `congregations`. |
| `CORS_ORIGIN` | Production | Comma-separated frontend URLs allowed to call the API. Defaults to `http://localhost:8081`. |

Locally, run `JWT_SECRET=dev-secret npm start`. On the server, put these in
`/home/ubuntu/nodeapps/congregation-backend.env`, which `congregation-backend.service` loads.

Deploys run from GitHub Actions when a PR into `dev-branch` is merged. They need two
repository secrets: `SERVER_HOST` (the server's hostname or IP) and `SERVER_SSH_KEY`
(a private key whose public key is in the server's `~/.ssh/authorized_keys`).
