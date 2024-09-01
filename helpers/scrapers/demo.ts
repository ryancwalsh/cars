// `CHROME_PATH=/snap/bin/chromium npx tsx helpers/scrapers/demo.ts`
// This does not seem to open the local browser even when `headless: false`.

import { getChromium } from '../generic/chromium';

(async () => {
  const { browser, page } = await getChromium();

  await page.goto('https://www.example.com');
  // await page.waitForTimeout(2_000); // Keep the browser open
  await browser.close();
})();
