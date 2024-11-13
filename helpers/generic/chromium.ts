import { type Browser, type Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { environment } from '../config';

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
    executablePath: environment.CHROME_PATH, // ?? (await chromium.executablePath(environment.CHROMIUM_TAR)), // https://github.com/Sparticuz/chromium/releases
    headless: environment.IS_BROWSER_HEADLESS, // chromium.headless,
    userDataDir: environment.BROWSER_USER_DATA_DIRECTORY,
  };
  console.log({ options });
  const browser = await puppeteer.launch(options);

  const page = await closeAllTabsExceptMostRecent(browser);
  // await closeAllTabsExceptMostRecent(browser);
  // const [page] = await browser.pages(); // https://stackoverflow.com/a/65514432/
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function closeAllOpenTabs(browser: Browser) {
  // const pages = await browser.pages();
  // console.log('closeAllOpenTabs', pages.length);
  // for (const page of pages) {
  //   await page.close();
  // }
}

export async function closeAllTabsExceptMostRecent(browser: Browser): Promise<Page> {
  const pages = await browser.pages();
  console.log('closeAllTabsExceptMostRecent. pages.length = ', pages.length);
  if (pages.length === 0) {
    return await browser.newPage();
  } else {
    const recentPage = pages.pop() as Page;
    for (const page of pages) {
      await page.close();
    }

    return recentPage;
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
