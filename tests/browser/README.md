# Browser checks

Headless Chromium checks that click through the app the way a person would. They run
against the docker compose stack and need nothing installed but Docker.

```bash
docker compose up --build -d     # from the repo root; wait for "Server is running"
tests/browser/run.sh             # every *.check.js
tests/browser/run.sh calendar.check.js
```

`run.sh` uses Playwright's Docker image (`mcr.microsoft.com/playwright:v1.48.2-jammy`),
so no browser has to be installed. Each check prints `PASS`/`FAIL` and the script exits
non-zero if any fail. Set `APP_URL` and `API_URL` to test somewhere other than
`localhost:8081` and `localhost:8080/api`.

| File | Covers |
| --- | --- |
| `login-and-members.check.js` | Login errors, expired logins, member popovers, search, CSV export |
| `calendar.check.js` | Creating, editing and deleting events, event details, RSVPs |
| `families-groups-members.check.js` | Adding families, the directory PDF, group cards, contacts, life events |
| `regular-user.check.js` | What a regular user can see and edit, hidden contact details, phone-width layouts |
| `group-pdf.check.js` | Print Groups PDF |
| `home-page.check.js` | Home page heading |

The checks log in as the demo user (`demo` / `demo1234`), so the stack needs
`SEED_DEMO_DATA=true`, as in `docker-compose.yml`. They expect the sample data and
remove what they create. `regular-user.check.js` signs up a test account; without the
admin Users API it can't delete that account and prints its name instead.
