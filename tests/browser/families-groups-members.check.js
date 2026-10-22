const { chromium, APP, API, check, expect, report, api, signin, loggedInPage } = require('./lib');

// A valid 1x1 PNG
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

(async () => {
  const browser = await chromium.launch();
  const admin = await signin('demo', 'demo1234');
  const T = admin.accessToken;
  const page = await loggedInPage(browser, 'demo', 'demo1234');
  page.on('dialog', d => d.accept());
  const cleanup = [];

  // Pick a person in a Vuetify autocomplete inside the open dialog
  async function pickMember(label, name, role) {
    await page.locator('.v-dialog--active').getByLabel(label).click();
    await page.locator('.v-dialog--active').getByLabel(label).fill(name.split(' ')[0]);
    await page.locator('.menuable__content__active .v-list-item', { hasText: name }).first().click();
    if (role) {
      await page.locator('.v-dialog--active').getByLabel('Family Role').click({ force: true });
      await page.locator('.menuable__content__active .v-list-item', { hasText: role }).first().click();
    }
    await page.locator('.v-dialog--active button:has-text("Save")').click();
    await page.waitForTimeout(800);
  }

  await check('New family: removing one unsaved member keeps the others', async () => {
    await page.goto(APP + '/familyadd');
    for (const name of ['Linda Nguyen', 'Grace Okafor']) {
      await page.locator('button:has-text("Add Member")').click();
      await pickMember('Family Member', name, 'Child');
    }
    let rows = await page.locator('table tbody tr').count();
    expect(rows === 2, `${rows} rows after adding two`);
    await page.locator('table tbody tr', { hasText: 'Linda' }).locator('.mdi-delete').click();
    rows = await page.locator('table tbody tr').allInnerTexts();
    expect(rows.length === 1 && rows[0].includes('Grace'), `left: ${JSON.stringify(rows)}`);
    return 'Grace kept';
  });

  await check('New family saves without a photo', async () => {
    await page.getByLabel('Family Name').fill('UICheck');
    await page.getByLabel('Family Email').fill('uicheck@example.com');
    await page.getByLabel('Family Phone').fill('555-123-4567');
    await page.getByLabel('Family Address').fill('1 Test Way');
    await page.locator('button.float-right:has-text("Save")').click();
    await page.waitForURL('**/families');
    const fam = (await api('GET', '/families', null, T)).find(f => f.fam_name === 'UICheck');
    expect(fam, 'family not saved');
    cleanup.push(() => api('DELETE', '/families/' + fam.fam_ID, null, T));
    const members = await api('GET', '/familyperson?family=' + fam.fam_ID, null, T);
    expect(members.length === 1 && members[0].person.frst_name === 'Grace', `members: ${members.map(m => m.person.frst_name)}`);
    const card = page.locator('.v-card', { hasText: 'UICheck' }).first();
    await card.waitFor();
    const images = await card.locator('.v-image').count();
    expect(images === 0, 'card shows an image');
    return `fam_ID ${fam.fam_ID}, photo ${fam.fam_pic}, members Grace`;
  });

  await check('Directory PDF builds with and without photos', async () => {
    // A temporary family with a photo; deleting it later removes the photo too
    const photoFamily = await api('POST', '/families', { fam_name: 'UI Check Photo', fam_email: 'photo@example.com', fam_phone: '555-0100', fam_address: '1 Test St' }, T);
    cleanup.push(() => api('DELETE', '/families/' + photoFamily.fam_ID, null, T));
    const form = new FormData();
    form.append('fam_ID', String(photoFamily.fam_ID));
    form.append('file', new Blob([PNG], { type: 'image/png' }), 'photo.png');
    const up = await (await fetch(API + '/families/upload', { method: 'POST', headers: { 'x-access-token': T }, body: form })).json();
    expect(up.path, 'upload failed: ' + JSON.stringify(up));
    await page.goto(APP + '/families');
    await page.locator('button:has-text("Print")').waitFor();
    await page.waitForTimeout(1000); // let the member names load
    const before = page.errors.length;
    // Headless Chromium can't show PDFs, so the new tab turns into a download
    const popupPromise = page.waitForEvent('popup', { timeout: 15000 });
    await page.locator('button:has-text("Print")').click();
    const popup = await popupPromise;
    const download = await popup.waitForEvent('download', { timeout: 15000 });
    const pdf = require('fs').readFileSync(await download.path());
    expect(pdf.slice(0, 5).toString() === '%PDF-', 'not a PDF');
    const images = (pdf.toString('latin1').match(/\/Subtype\s*\/Image/g) || []).length;
    expect(images >= 1, 'the PDF has no images');
    expect(page.errors.length === before, page.errors.slice(before).join('; '));
    await popup.close().catch(() => {});
    return `${pdf.length} byte PDF with ${images} embedded image(s)`;
  });

  await check('Group cards leave out missing phones', async () => {
    await page.goto(APP + '/group');
    const youth = page.locator('.v-card', { hasText: 'Youth Group' }).first();
    await youth.locator('text=Ethan').waitFor();
    const text = await youth.innerText();
    expect(!text.includes('null'), `card text: ${text}`);
    return text.split('\n').filter(Boolean).slice(-1)[0].trim();
  });

  await check('Adding a member: a removed email is not saved', async () => {
    await page.goto(APP + '/personadd');
    await page.getByLabel('First Name').fill('Contact');
    await page.getByLabel('Last Name').fill('Check');
    for (const email of ['keep@example.com', 'drop@example.com']) {
      await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
      await page.locator('button:has-text("Add")').first().click();
    }
    await page.locator('tr', { hasText: 'drop@example.com' }).locator('.mdi-delete').click();
    await page.locator('button:has-text("Submit")').click();
    await page.waitForTimeout(1500);
    const person = (await api('GET', '/person', null, T)).find(p => p.frst_name === 'Contact' && p.last_name === 'Check');
    expect(person, 'person not saved');
    cleanup.push(() => api('DELETE', '/person/' + person.per_ID, null, T));
    const contacts = await api('GET', '/personcontact?person=' + person.per_ID, null, T);
    const saved = contacts.map(c => c.communication.address);
    expect(saved.length === 1 && saved[0] === 'keep@example.com', `saved: ${JSON.stringify(saved)}`);
    return 'saved only keep@example.com';
  });

  await check('Adding a member with no name is blocked', async () => {
    await page.goto(APP + '/personadd');
    const before = (await api('GET', '/person', null, T)).length;
    await page.locator('button:has-text("Submit")').click();
    await page.waitForTimeout(800);
    const after = (await api('GET', '/person', null, T)).length;
    expect(after === before, 'a person was created');
    return (await page.locator('.error--text .v-messages__message').allInnerTexts()).join(', ');
  });

  await check('Editing a member: deleted phone and address disappear', async () => {
    const p = await api('POST', '/person', { frst_name: 'Phone', last_name: 'Check' }, T);
    cleanup.push(() => api('DELETE', '/person/' + p.per_ID, null, T));
    for (const c of [{ vve_ID: 2, number: '555-000-1111', address: '' }, { vve_ID: 3, number: 0, address: '9 Delete St' }]) {
      const com = await api('POST', '/communications', { vvg_ID: 1, ...c }, T);
      await api('POST', '/personcontact', { com_ID: com.com_ID, per_ID: p.per_ID }, T);
    }
    await page.goto(APP + '/personedit/' + p.per_ID);
    await page.locator('tr', { hasText: '555-000-1111' }).locator('.mdi-delete').click();
    await page.locator('tr', { hasText: '555-000-1111' }).waitFor({ state: 'detached', timeout: 5000 });
    await page.locator('tr', { hasText: '9 Delete St' }).locator('.mdi-delete').click();
    await page.locator('tr', { hasText: '9 Delete St' }).waitFor({ state: 'detached', timeout: 5000 });
    const left = await api('GET', '/personcontact?person=' + p.per_ID, null, T);
    const coms = (await api('GET', '/communications', null, T)).filter(c => ['555-000-1111', '9 Delete St'].includes(c.number) || c.address === '9 Delete St');
    expect(left.length === 0, `${left.length} contacts left`);
    expect(coms.length === 0, `${coms.length} communications left`);
  });

  await check('Life events: add one for a person and see it listed', async () => {
    const p = await api('POST', '/person', { frst_name: 'Life', last_name: 'Check' }, T);
    cleanup.push(() => api('DELETE', '/person/' + p.per_ID, null, T));
    await page.goto(APP + '/lifeeventpersonadd/' + p.per_ID);
    await page.getByLabel('Life Event Date: YYYY-MM-DD').fill('2026-03-01');
    await page.getByLabel('Life Event Notes').fill('Baptised');
    await page.locator('button:has-text("Submit")').click();
    await page.waitForURL(new RegExp('/lifeeventperson/' + p.per_ID + '$'));
    await page.locator('text=Baptised').waitFor({ timeout: 5000 });
    const links = await api('GET', '/lifeventperson?person=' + p.per_ID, null, T);
    cleanup.push(() => api('DELETE', '/lifeevent/' + links[0].event_ID, null, T));
    await page.locator('button:has-text("Remove")').click();
    await page.locator('text=Baptised').waitFor({ state: 'detached', timeout: 5000 });
    const after = await api('GET', '/lifeventperson?person=' + p.per_ID, null, T);
    expect(after.length === 0, `${after.length} links left after Remove`);
    return 'added, listed, removed';
  });

  await check('No page errors in families, groups, members, life events', async () => {
    expect(page.errors.length === 0, page.errors.join('; '));
  });

  for (const fn of cleanup.reverse()) await fn();
  await browser.close();
  report();
})();
