import puppeteer from 'puppeteer-extra';
// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { BROWSER_USER_DATA_DIRECTORY, CHROME_PATH, IS_BROWSER_HEADLESS } from '../config';

puppeteer.use(StealthPlugin());

export async function getChromium() {
  const options = {
    // args: chromium.args,
    // defaultViewport: chromium.defaultViewport,
    args: ['--no-sandbox', `--window-size=1920,1080`],
    defaultViewport: {
      height: 1_080,
      width: 1_920,
    },
    dumpio: true,
    executablePath: CHROME_PATH, // ?? (await chromium.executablePath(CHROMIUM_TAR)), // https://github.com/Sparticuz/chromium/releases
    headless: IS_BROWSER_HEADLESS, // chromium.headless,
    userDataDir: BROWSER_USER_DATA_DIRECTORY,
  };
  console.log({ options });
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();
  // https://www.zenrows.com/blog/puppeteer-avoid-detection#headers
  // await page.setExtraHTTPHeaders({
  //   accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  //   'accept-encoding': 'gzip, deflate, br',
  //   'accept-language': 'en-US,en;q=0.9,en;q=0.8',
  //   'upgrade-insecure-requests': '1',
  //   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  // });

  return { browser, page };
}
