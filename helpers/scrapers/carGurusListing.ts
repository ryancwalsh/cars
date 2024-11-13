/* eslint-disable canonical/id-match */

import { environment } from '../config';
import { getChromium, sleep } from '../generic/chromium';
import { type ScrapedListing } from '../types';
import { getSafeString, saveHtml } from './logging';
import { getPriceFromText, getValueFromSelector } from './scraping';

// eslint-disable-next-line max-lines-per-function
export async function getLatestCarGurusListing(url: string): Promise<Partial<ScrapedListing> | null> {
  const { browser, page } = await getChromium();
  try {
    // const localTestFile =''
    // await page.goto(`file://${localTestFile}`);
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    console.log(`visited ${url}`);
    await sleep(2_500);
    await saveHtml(page, url);

    const now = new Date().toISOString();
    await page.screenshot({
      path: `${environment.SCRAPE_LOGS_PATH}/carGurus_${now}_${getSafeString(url)}.png`,
    });

    const mainPhotoSelector = '[alt="Vehicle Full Photo"]';
    const alternativePhotoSelector = '[alt="Preparing for a close up..."]';
    const listingNotAvailableHeaderSelector = '.cg-listingNotAvailableHeader';
    const jointSelector = `${mainPhotoSelector}, ${listingNotAvailableHeaderSelector}, ${alternativePhotoSelector}`;
    console.log(`Looking for joint selector: ${jointSelector}`);

    // wait for all redirects https://stackoverflow.com/a/57007420/470749 https://pptr.dev/api/puppeteer.page.waitforselector/
    const elementHandle = await page.waitForSelector(jointSelector, {
      timeout: 3_000, // max milliseconds to wait
    });
    console.log({ elementHandle });
    const imageUrl = await page.evaluate((element) => element?.getAttribute('src'), elementHandle);
    console.log(`Found joint selector: ${jointSelector}`, elementHandle, imageUrl);

    let result: Partial<ScrapedListing> | null = null;
    if (imageUrl) {
      const priceApproxString = await getValueFromSelector(page, 'aside[data-testid="vdpDesktopRightColumn"] div h2');
      const priceApprox = getPriceFromText(priceApproxString);

      const handle = await page.waitForSelector('a[aria-label="Dealer website"]'); // dealer URL
      const hrefProperty = await handle?.getProperty('href');
      const listingUrl = await hrefProperty?.jsonValue();
      result = {
        image_url: imageUrl,
        listing_url: listingUrl,
        price_approx: priceApprox,
      };
    }

    console.log({ result });

    return result;
  } catch (error) {
    console.error('Error finding the listing:', error);
    return null;
  } finally {
    await page.close();
    await browser.close();
  }
}
