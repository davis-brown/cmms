const { chromium, APP, check, expect, report, api, signin, loggedInPage } = require('./lib');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const admin = await signin('demo', 'demo1234');

  await check('Login error shows a message, not JSON', async () => {
    const page = await browser.newPage();
    await page.goto(APP + '/login');
    await page.fill('input[name=username]', 'demo');
    await page.fill('input[name=password]', 'wrong');
    await page.click('button:has-text("Log in")');
    const text = (await page.locator('.alert-danger').innerText()).trim();
    expect(text === 'Invalid username or password.', `shows "${text}"`);
    await page.close();
    return text;
  });

  await check('Expired/invalid login goes to the login page', async () => {
    const page = await browser.newPage();
    await page.goto(APP + '/login');
    await page.evaluate(() => localStorage.setItem('user', JSON.stringify({
      username: 'demo', roles: ['ROLE_ADMIN'], accessToken: 'expired-token' })));
    await page.goto(APP + '/person');
    await page.waitForURL('**/login', { timeout: 10000 });
    const stored = await page.evaluate(() => localStorage.getItem('user'));
    expect(stored === null, 'saved login was not cleared');
    await page.close();
  });

  const page = await loggedInPage(browser, 'demo', 'demo1234');

  await check('Clicking a member opens only that member', async () => {
    await page.goto(APP + '/person');
    await page.locator('button:has-text("James Carter")').click();
    await page.waitForTimeout(500);
    const open = await page.locator('.v-menu.v-overlay--active .v-overlay__content').count();
    expect(open === 1, `${open} popovers open`);
    const title = await page.locator('.v-menu.v-overlay--active .v-overlay__content h2').innerText();
    expect(title.includes('James Carter'), `popover shows "${title}"`);
    await page.keyboard.press('Escape');
    return `1 open: ${title.trim()}`;
  });

  await check('Member search matches last names', async () => {
    await page.goto(APP + '/person');
    await page.locator('button:has-text("James Carter")').waitFor();
    await page.getByLabel('Search Members').fill('nguyen');
    await page.waitForTimeout(300);
    const names = await page.locator('button.member .member-name').allInnerTexts();
    const shown = names.map(n => n.trim()).filter(Boolean);
    expect(shown.length === 2 && shown.every(n => /nguyen/i.test(n)), `shows ${JSON.stringify(shown)}`);
    return shown.join(', ');
  });

  await check('Member search survives members with no name', async () => {
    const blank = await api('POST', '/person', { email: 'noname@example.com' }, admin.accessToken);
    try {
      await page.goto(APP + '/person');
      await page.locator('button:has-text("James Carter")').waitFor();
      const before = page.errors.length;
      await page.getByLabel('Search Members').fill('car');
      await page.waitForTimeout(300);
      expect(page.errors.length === before, page.errors.slice(before).join('; '));
    } finally {
      await api('DELETE', '/person/' + blank.per_ID, null, admin.accessToken);
    }
  });

  await check('CSV download is real CSV without notes', async () => {
    await page.goto(APP + '/person');
    await page.locator('button:has-text("James Carter")').waitFor();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('button:has-text("CSV Download")').click(),
    ]);
    const text = fs.readFileSync(await download.path(), 'utf8');
    const lines = text.split('\r\n');
    expect(lines[0].startsWith('"First Name","Middle Name","Last Name","Email"'), `header: ${lines[0]}`);
    expect(!/notes|password/i.test(lines[0]), 'has notes or password column');
    expect(lines.some(l => l.startsWith('"James","","Carter","james.carter@example.com"')), 'James Carter row missing');
    return `${lines.length - 1} rows, file ${download.suggestedFilename()}`;
  });

  await check('Member edit page survives a refresh', async () => {
    await page.goto(APP + '/person');
    await page.locator('button:has-text("James Carter")').click();
    await page.locator('.v-menu.v-overlay--active .v-overlay__content button:has-text("Edit")').click();
    await page.waitForURL(/\/personedit\/\d+$/);
    await page.reload();
    await page.getByLabel('First Name').waitFor();
    const first = await page.getByLabel('First Name').inputValue();
    expect(first === 'James', `first name field is "${first}"`);
    return new URL(page.url()).pathname;
  });

  await check('No page errors so far', async () => {
    expect(page.errors.length === 0, page.errors.join('; '));
  });

  await browser.close();
  report();
})();
