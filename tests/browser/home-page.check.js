const { chromium, APP, check, expect, report, loggedInPage } = require('./lib');

(async () => {
  const browser = await chromium.launch();
  const page = await loggedInPage(browser, 'demo', 'demo1234');

  await check('Home page greets the user and shows the four areas', async () => {
    await page.goto(APP + '/homepage');
    await page.locator('h1:has-text("demo")').waitFor();
    const tiles = await page.locator('.area-link').evaluateAll(links => links.map(a => a.getAttribute('href')));
    expect(tiles.join() === '/person,/families,/group,/calendar', 'areas link to ' + tiles.join());
    // Counts load from the API
    await page.locator('.area-count', { hasText: 'people' }).waitFor();
    return tiles.join(' ');
  });

  await check('Home page areas keep readable text', async () => {
    const colors = await page.locator('.area-name').evaluateAll(els => els.map(e => getComputedStyle(e).color));
    // Every area name is ink text on white or the pale band
    expect(colors.length === 4 && colors.every(c => c === 'rgb(35, 37, 45)'), 'colours ' + colors.join(' / '));
    return colors.join(' / ');
  });

  await check('No page errors on the home page', async () => {
    expect(page.errors.length === 0, page.errors.join('; '));
  });

  await browser.close();
  report();
})();
