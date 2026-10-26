# Church Membership Management System

A web application made for a local church to store information about church members and keep track of church events.

| Folder | What it is |
| --- | --- |
| [`backend/`](backend/) | REST API: Node.js, Express, Sequelize, MySQL |
| [`frontend/`](frontend/) | Single-page app: Vue 3, Vuetify 3 |

## Running locally with Docker

Needs [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine with the Compose plugin). From the repo root:

```bash
docker compose up --build
```

When the logs show `Server is running on port 8080.`, open **http://localhost:8081** and log in with **`demo` / `demo1234`**. The demo account has every role, and the database starts with sample members, families, groups and events.

| Service | URL |
| --- | --- |
| App | http://localhost:8081 |
| API | http://localhost:8080/api/ |
| MySQL | `localhost:3307`, user `root`, password `cmms` |

To stop, press `Ctrl+C`. To wipe the database and uploaded photos and start fresh: `docker compose down -v`.

The containers run built copies of the code, so after editing, run `docker compose up --build` again. For hot reload, run the backend and frontend directly instead; see their READMEs.

To check the app in a headless browser, run `tests/browser/run.sh` while the stack is up; see [`tests/browser/`](tests/browser/).

## License

[MIT](LICENSE)
