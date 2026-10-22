#!/bin/sh
# Runs the browser checks in Playwright's Docker image against the app started
# with `docker compose up` (http://localhost:8081). Pass file names to run only
# some of them, e.g. ./run.sh calendar.check.js
set -e
cd "$(dirname "$0")"

# Must match the playwright version in package.json
IMAGE=mcr.microsoft.com/playwright:v1.48.2-jammy

if [ "$#" -eq 0 ]; then
  set -- *.check.js
fi

docker run --rm --network host \
  -u "$(id -u):$(id -g)" -e HOME=/tmp \
  -e APP_URL -e API_URL \
  -v "$PWD":/work -w /work \
  "$IMAGE" sh -c '
    [ -d node_modules/playwright ] || npm ci --no-audit --no-fund --loglevel=error
    status=0
    for file in "$@"; do
      echo "== $file"
      node "$file" || status=1
    done
    exit $status
  ' sh "$@"
