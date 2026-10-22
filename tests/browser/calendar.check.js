const { chromium, APP, check, expect, report, api, signin, loggedInPage } = require('./lib');

(async () => {
  const browser = await chromium.launch();
  const admin = await signin('demo', 'demo1234');
  const page = await loggedInPage(browser, 'demo', 'demo1234');
  page.on('dialog', d => { page.lastDialog = d.message(); d.accept(); });
  const name = 'UI Check ' + Date.now();
  let evt;

  const findEvent = async () =>
    (await api('GET', '/events', null, admin.accessToken)).find(e => e.event_name === name);

  await check('Creating an event saves it without reloading the page', async () => {
    await page.goto(APP + '/calendar');
    await page.locator('button:has-text("New Event")').click();
    await page.evaluate(() => { window.__noReload = true; });
    await page.getByLabel('event name (required)').fill(name);
    await page.getByLabel('event location').fill('Room 1');
    const date = await page.getByLabel('start (required)').inputValue();
    await page.locator('button:has-text("Create Event")').click();
    await page.locator('.v-event', { hasText: name }).first().waitFor({ timeout: 10000 });
    const stillSame = await page.evaluate(() => window.__noReload === true);
    expect(stillSame, 'page reloaded');
    evt = await findEvent();
    expect(evt, 'event not in the database');
    const today = new Date().toISOString().slice(0, 10);
    return `shown on calendar, dated ${date} (today ${today})`;
  });

  await check('Create Event with no name is blocked', async () => {
    await page.locator('button:has-text("New Event")').click();
    await page.getByLabel('event name (required)').fill('');
    const before = (await api('GET', '/events', null, admin.accessToken)).length;
    await page.locator('button:has-text("Create Event")').click();
    await page.waitForTimeout(800);
    const after = (await api('GET', '/events', null, admin.accessToken)).length;
    const msg = await page.locator('.v-dialog.v-overlay--active .v-input--error').first().innerText().catch(() => '');
    expect(after === before, 'an event was created');
    await page.keyboard.press('Escape');
    return `shows "${msg.trim()}"`;
  });

  await check('Editing an event saves the change and keeps its colour', async () => {
    await page.goto(APP + '/calendar');
    await page.locator('.v-event', { hasText: name }).first().click();
    await page.locator('.v-menu.v-overlay--active .v-overlay__content button:has-text("Edit")').click();
    await page.locator('.v-menu.v-overlay--active .v-overlay__content textarea:not(.v-textarea__sizer)').fill('Edited in the browser');
    await page.locator('.v-menu.v-overlay--active .v-overlay__content button:has-text("Save")').click();
    await page.waitForTimeout(1000);
    const e = await findEvent();
    expect(e.event_desc === 'Edited in the browser', `description is "${e.event_desc}"`);
    expect(e.color === evt.color, `colour changed from ${evt.color} to ${e.color}`);
    expect(e.event_start === evt.event_start, `start time changed from ${evt.event_start} to ${e.event_start}`);
    return `desc saved, colour ${e.color}, start ${e.event_start}`;
  });

  await check('Event details page survives a refresh', async () => {
    await page.goto(APP + '/calendar');
    await page.locator('.v-event', { hasText: name }).first().click();
    await page.locator('.v-menu.v-overlay--active .v-overlay__content button:has-text("View More")').click();
    await page.waitForURL(/\/eventdetails\/\d+$/);
    await page.reload();
    await page.locator('h1:has-text("Event Details")').waitFor();
    const contributions = await page.locator('text=Contributions').count();
    expect(contributions === 0, 'empty Contributions card shown');
    return new URL(page.url()).pathname;
  });

  await check('RSVP records the user and updates attendance', async () => {
    await page.getByLabel('Add your contribution').fill('Cookies');
    await page.locator('button:has-text("RSVP for Event")').click();
    await page.waitForURL('**/calendar');
    const e = await findEvent();
    const attendees = await api('GET', '/attendee?events=' + e.evt_ID, null, admin.accessToken);
    expect(e.attendance === 1, `attendance is ${e.attendance}`);
    expect(attendees[0].username === 'demo', `RSVP name is ${attendees[0].username}`);
    return `attendance ${e.attendance}, by ${attendees[0].username}`;
  });

  await check('Deleting an event asks first, then removes it', async () => {
    await page.goto(APP + '/calendar');
    await page.locator('.v-event', { hasText: name }).first().click();
    await page.locator('.v-menu.v-overlay--active .v-overlay__content button:has(.mdi-delete)').click();
    await page.locator('.v-event', { hasText: name }).first().waitFor({ state: 'detached', timeout: 10000 });
    expect(page.lastDialog && page.lastDialog.includes(name), `confirm said: ${page.lastDialog}`);
    expect(!(await findEvent()), 'still in the database');
    return `confirm: "${page.lastDialog}"`;
  });

  await check('No page errors on the calendar', async () => {
    expect(page.errors.length === 0, page.errors.join('; '));
  });

  const leftover = await findEvent();
  if (leftover) await api('DELETE', '/events/' + leftover.evt_ID, null, admin.accessToken);
  await browser.close();
  report();
})();
