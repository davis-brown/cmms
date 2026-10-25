// Shared helpers for the browser checks
const { chromium } = require('playwright');
// The docker compose stack by default; override to test another copy
const APP = process.env.APP_URL || 'http://localhost:8081';
const API = process.env.API_URL || 'http://localhost:8080/api';

const results = [];
async function check(name, fn) {
  try {
    const detail = await fn();
    results.push(['PASS', name, detail || '']);
  } catch (e) {
    results.push(['FAIL', name, e.message.split('\n')[0]]);
  }
}
function expect(cond, msg) { if (!cond) throw new Error(msg); }
function report() {
  for (const [s, n, d] of results) console.log(`${s}  ${n}${d ? '  — ' + d : ''}`);
  const failed = results.filter(r => r[0] === 'FAIL').length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  if (failed) process.exitCode = 1;
}

async function api(method, path, body, token) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { 'x-access-token': token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}
async function signin(username, password) {
  return api('POST', '/auth/signin', { username, password });
}

// A browser page logged in as the given user
async function loggedInPage(browser, username, password, viewport) {
  const page = await browser.newPage(viewport ? { viewport } : {});
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  await page.goto(APP + '/login');
  await page.fill('input[name=username]', username);
  await page.fill('input[name=password]', password);
  await page.click('button:has-text("Log in")');
  await page.waitForURL('**/profile');
  return page;
}

module.exports = { chromium, APP, API, check, expect, report, api, signin, loggedInPage };
