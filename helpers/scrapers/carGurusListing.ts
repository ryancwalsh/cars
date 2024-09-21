/* eslint-disable canonical/id-match */

import { getChromium } from '../generic/chromium';
import { type ScrapedListing } from '../types';
import { saveHtml } from './logging';

// eslint-disable-next-line max-lines-per-function
export async function getLatestCarGurusListing(url: string): Promise<Partial<ScrapedListing> | null> {
  const { browser, page } = await getChromium();
  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    console.log(`visited ${url}`);

    await saveHtml(page, url);

    // await page.screenshot({
    //   path: `${SCRAPE_LOGS_PATH}/carGurus_${url}_${now}.png`,
    // });

    const mainPhotoSelector = '[alt="Vehicle Full Photo"]';
    const listingNotAvailableHeaderSelector = '.cg-listingNotAvailableHeader';

    // wait for all redirects https://stackoverflow.com/a/57007420/470749
    await page.waitForSelector(`${mainPhotoSelector}, ${listingNotAvailableHeaderSelector}`, {
      timeout: 3_000, // max milliseconds to wait
    });
    console.log('found joint selector.');

    const result = await page.evaluate(() => {
      // Any console logs here will be visible in the browser rather than the terminal.
      const mainPhotoSelectorInside = '[alt="Vehicle Full Photo"]'; // TODO: Reduce duplication with `mainPhotoSelector`.
      const imageElement = document.querySelector(mainPhotoSelectorInside);
      console.log({ imageElement });

      const partialListing: Partial<ScrapedListing> | null = imageElement ? { image_url: imageElement.getAttribute('src') } : null;

      return partialListing;
    });
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
