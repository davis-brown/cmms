const fs = require('fs');
const { chromium, APP, check, expect, report, loggedInPage } = require('./lib');
(async () => {
  const browser = await chromium.launch();
  const page = await loggedInPage(browser, 'demo', 'demo1234');
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await check('Print Groups downloads a PDF of the groups', async () => {
    await page.goto(APP + '/group');
    await page.locator('text=Choir').first().waitFor();
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30000 }),
      page.getByRole('button', { name: /Print\s*Groups/i }).click(),
    ]);
    const file = await download.path();
    const head = fs.readFileSync(file).subarray(0, 5).toString();
    const size = fs.statSync(file).size;
    expect(download.suggestedFilename() === 'groups.pdf', download.suggestedFilename());
    expect(head === '%PDF-' && size > 5000, `${head} ${size} bytes`);
    expect(errors.length === 0, errors.join('; '));
    return `${download.suggestedFilename()}, ${Math.round(size / 1024)} KB`;
  });
  await browser.close();
  report();
})();
