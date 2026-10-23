const { chromium, APP, check, expect, report, api, signin, loggedInPage } = require('./lib');

(async () => {
  const browser = await chromium.launch();
  const admin = await signin('demo', 'demo1234');
  const T = admin.accessToken;
  const U = 'uicheck' + Date.now() % 100000;
  await api('POST', '/auth/signup', { username: U, email: U + '@example.com', password: 'secret123' });
  // New accounts need approval before they can log in
  // (only when the Users API exists; without it sign-ups need no approval)
  const users = await api('GET', '/users', null, T);
  const created = Array.isArray(users) ? users.find(u => u.username === U) : null;
  if (created) await api('PUT', '/users/' + created.id, { approved: true }, T);
  await api('PUT', '/person/1', { user_name: U }, T); // James Carter
  const page = await loggedInPage(browser, U, 'secret123');

  await check('Regular user: no Admin or Moderator Board links', async () => {
    const links = await page.locator('nav a').allInnerTexts();
    expect(!links.some(l => /Board/.test(l)), `links: ${links.join(', ')}`);
  });

  // Contact details are only shown for the user's own family
  const popover = async name => {
    await page.goto(APP + '/person');
    await page.locator(`button:has-text("${name}")`).click();
    await page.waitForTimeout(500);
    return page.locator('.v-menu.v-overlay--active .v-overlay__content').innerText();
  };

  await check("Regular user: another family's contact details are hidden", async () => {
    const text = await popover('Linda Nguyen');
    expect(!/Contact Information|@|555-/.test(text), text);
    expect(/Linda Nguyen/.test(text), text);
  });

  await check("Regular user: own family's contact details are shown", async () => {
    const text = await popover('Mary Carter');
    expect(/mary\.carter@example\.com/.test(text) && /555-0102/.test(text), text);
  });

  await check('Regular user: other family cards have no contact details', async () => {
    await page.goto(APP + '/families');
    const card = title => page.locator('.v-card', { has: page.locator('.v-card-title', { hasText: title }) });
    await card('Nguyen').waitFor();
    await card('Carter').locator('text=555-0101').waitFor({ timeout: 5000 }).catch(() => {});
    const other = await card('Nguyen').innerText();
    const own = await card('Carter').innerText();
    expect(!/@|\d{3}-\d{4}|Maple/.test(other), 'Nguyen: ' + other);
    expect(/555-0101/.test(own), 'Carter: ' + own);
  });

  await check('Regular user: edit button only on their own family', async () => {
    await page.goto(APP + '/families');
    await page.locator('.v-card', { hasText: 'Nguyen' }).first().waitFor();
    await page.waitForTimeout(1000);
    const carter = await page.locator('.v-card', { hasText: 'Carter' }).first().locator('.mdi-pencil').count();
    const nguyen = await page.locator('.v-card', { hasText: 'Nguyen' }).first().locator('.mdi-pencil').count();
    const newFamily = await page.locator('a:has-text("New Family")').count();
    expect(carter === 1 && nguyen === 0 && newFamily === 0, `carter ${carter}, nguyen ${nguyen}, new family ${newFamily}`);
  });

  await check('Regular user: can edit own family, no Delete or New Member', async () => {
    await page.locator('.v-card', { hasText: 'Carter' }).first().locator('.mdi-pencil').click();
    await page.waitForURL(/\/familyedit\/\d+$/);
    await page.getByLabel('Family Name').waitFor();
    const del = await page.locator('button:has-text("Delete")').count();
    const newMember = await page.locator('button:has-text("New Member")').count();
    expect(del === 0 && newMember === 0, `delete ${del}, new member ${newMember}`);
    await page.getByLabel('Family Name').fill('Carter Family');
    await page.locator('button:has-text("Update")').click();
    await page.waitForURL('**/families');
    const fam = await api('GET', '/families/1', null, T);
    expect(fam.fam_name === 'Carter Family', `name is ${fam.fam_name}`);
    await api('PUT', '/families/1', { fam_name: 'Carter' }, T);
    return 'renamed and saved';
  });

  await check('Regular user: no New Event or Add Congregation', async () => {
    await page.goto(APP + '/calendar');
    await page.locator('button:has-text("Today")').waitFor();
    const newEvent = await page.locator('button:has-text("New Event")').count();
    await page.goto(APP + '/congregation');
    await page.locator('h1:has-text("Congregation Information")').waitFor();
    const addCong = await page.locator('a:has-text("Add Congregation")').count();
    expect(newEvent === 0 && addCong === 0, `new event ${newEvent}, add congregation ${addCong}`);
  });

  await check('Regular user: hovering a group card keeps the members visible', async () => {
    await page.goto(APP + '/group');
    const card = page.locator('.v-card', { hasText: 'Choir' }).first();
    await card.locator('text=Mary').waitFor();
    await card.hover();
    await page.waitForTimeout(500);
    const overlays = await card.locator('.v-overlay').count();
    expect(overlays === 0, `${overlays} overlay(s)`);
  });

  await check('No page errors for the regular user', async () => {
    expect(page.errors.length === 0, page.errors.join('; '));
  });

  // Phone-sized screens
  const phone = await loggedInPage(browser, 'demo', 'demo1234', { width: 390, height: 844 });
  for (const path of ['/homepage', '/families', '/person', '/group']) {
    await check(`Phone width: ${path} fits without sideways scrolling`, async () => {
      await phone.goto(APP + path);
      await phone.waitForTimeout(1500);
      const { scroll, width } = await phone.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: window.innerWidth }));
      expect(scroll <= width, `page is ${scroll}px wide on a ${width}px screen`);
      return `${scroll}px of ${width}px`;
    });
  }

  await api('PUT', '/person/1', { user_name: '' }, T);
  if (created) await api('DELETE', '/users/' + created.id, null, T);
  else console.log(`Delete the test account ${U} by hand (no Users API on this version)`);
  await browser.close();
  report();
})();
