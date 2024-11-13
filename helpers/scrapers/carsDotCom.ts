/**
 * https://github.com/Sparticuz/chromium?tab=readme-ov-file#-min-package
 * https://github.com/Sparticuz/chromium/blob/master/examples/remote-min-binary/index.js
 */

import { type PostgrestError } from '@supabase/supabase-js';

import { closeAllOpenTabs, getChromium } from '../generic/chromium';
import { getNumberWithinString } from '../generic/numbers';
import { upsertRatings } from '../supabase';
import { saveHtml } from './logging';
import { getValueFromSelector } from './scraping';

// eslint-disable-next-line max-lines-per-function
export async function getCarsDotComRatings(
  searchQuery: string,
  modelId: number,
): Promise<{
  matchingRecords: Array<{
    cars_dot_com_rating: number | null;
    cars_dot_com_ratings_count: number | null;
    cars_dot_com_url: string | null;
    model_id: number;
  }> | null;
  upsertError: PostgrestError | null;
} | null> {
  // https://superuser.com/questions/1496083/google-feeling-lucky-url-causing-redirect-notice/1496084#comment2934824_1496084
  // https://duckduckgo.com/bangs
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(`${searchQuery} ratings consumer reviews site:cars.com !ducky`)}`;
  console.log({ url });
  await upsertRatings([
    {
      cars_dot_com_url: url,
      model_id: modelId,
    },
  ]);
  const { browser, page } = await getChromium();
  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    console.log(`visited ${url}`);

    const currentUrl = await saveHtml(page, url, searchQuery);

    // wait for all redirects https://stackoverflow.com/a/57007420/470749
    const reviewsElement = await page.waitForSelector('.ratings-section spark-rating', {
      timeout: 3_000, // max milliseconds to wait
    });
    if (reviewsElement) {
      const ratingString = await reviewsElement.evaluate((element) => {
        return element.getAttribute('rating');
      });

      const ratingsCountText = await getValueFromSelector(page, '[data-linkname="research-consumer-reviews-top"]');

      const payload = {
        cars_dot_com_rating: Number(ratingString),
        cars_dot_com_ratings_count: getNumberWithinString(ratingsCountText),
        cars_dot_com_url: currentUrl,
        model_id: modelId,
      };
      console.log({ payload, ratingsCountText, ratingString });
      const result = await upsertRatings([payload]);

      return result;
    } else {
      throw new Error('No reviews element found');
    }
  } catch (error) {
    console.error('Error finding the reviews element:', error);
    return null;
  } finally {
    await page.close();
    await closeAllOpenTabs(browser);
    await browser.close();
  }
}
