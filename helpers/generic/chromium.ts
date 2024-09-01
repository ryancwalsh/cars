import chromium from '@sparticuz/chromium-min';
import { launch } from 'puppeteer-core';

import { CHROME_PATH } from '../config';

export async function getChromium() {
  const options = {
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: CHROME_PATH ?? (await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar')), // https://github.com/Sparticuz/chromium/releases
    headless: chromium.headless,
  };
  console.log({ options });
  const browser = await launch(options);

  const page = await browser.newPage();
  // https://www.zenrows.com/blog/puppeteer-avoid-detection#headers
  await page.setExtraHTTPHeaders({
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,en;q=0.8',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  });

  return { browser, page };
}
