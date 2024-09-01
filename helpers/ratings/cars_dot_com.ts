/**
 * Use DuckDuckGo to find KBB URL, then visit KBB, and wait for reviews element
 * https://github.com/Sparticuz/chromium?tab=readme-ov-file#-min-package
 * https://github.com/Sparticuz/chromium/blob/master/examples/remote-min-binary/index.js
 */

import { getChromium } from '../generic/chromium';
import { upsertRatings } from '../supabase';

// eslint-disable-next-line max-lines-per-function
export async function getCarsDotComRatings(searchQuery: string, modelId: number) {
  // https://superuser.com/questions/1496083/google-feeling-lucky-url-causing-redirect-notice/1496084#comment2934824_1496084
  // https://duckduckgo.com/bangs
  const url = `https://duckduckgo.com/?q=%5C${encodeURIComponent(`${searchQuery} ratings reviews site:cars.com !ducky`)}`;
  const { browser, page } = await getChromium();
  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    console.log(`visited ${url}`);

    const currentUrl = page.url();
    console.log({ currentUrl });

    // wait for all redirects https://stackoverflow.com/a/57007420/470749
    const reviewsElement = await page.waitForSelector('.ratings-section spark-rating', {
      timeout: 3_000, // max milliseconds to wait
    });
    if (reviewsElement) {
      const ratingString = await reviewsElement.evaluate((element) => {
        return element.getAttribute('rating');
      });
      const childElement = await reviewsElement.$('[data-linkname="research-consumer-reviews-top"]');

      const textContent = await childElement?.getProperty('textContent');
      const text = await textContent?.jsonValue();

      const ratings = {
        cars_dot_com_rating: Number(ratingString),
        cars_dot_com_ratings_count: Number(text?.replaceAll(/\D/gu, '')),
      };
      console.log({ ratings, ratingString, text, textContent });
      const result = await upsertRatings([{ model_id: modelId, ...ratings }]);

      return result;
    } else {
      throw new Error('No reviews element found');
    }
  } catch (error) {
    console.error('Error finding the reviews element:', error);
    return null;
  } finally {
    await browser.close();
  }
}
