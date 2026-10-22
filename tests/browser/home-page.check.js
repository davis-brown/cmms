const { chromium, APP, check, expect, report, loggedInPage } = require('./lib');

(async () => {
  const browser = await chromium.launch();
  const page = await loggedInPage(browser, 'demo', 'demo1234');

  await check('Home page heading is light text on the photo', async () => {
    await page.goto(APP + '/homepage');
    const title = page.locator('.heading-title').locator('visible=true').first();
    await title.waitFor();
    const color = await title.evaluate(el => getComputedStyle(el).color);
    expect(color === 'rgb(255, 255, 255)', 'heading colour is ' + color);
    return color;
  });

  await check('No page errors on the home page', async () => {
    expect(page.errors.length === 0, page.errors.join('; '));
  });

  await browser.close();
  report();
})();
