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
export async function getEdmundsRatings(
  searchQuery: string,
  modelId: number,
): Promise<{
  matchingRecords: Array<{
    edmunds_monthly_cost_to_drive_estimate: number | null;
    edmunds_rating: number | null;
    edmunds_ratings_count: number | null;
    edmunds_repair_pal_reliability_rating: number | null;
    edmunds_url: string | null;
    model_id: number;
  }> | null;
  upsertError: PostgrestError | null;
} | null> {
  // https://superuser.com/questions/1496083/google-feeling-lucky-url-causing-redirect-notice/1496084#comment2934824_1496084
  // https://duckduckgo.com/bangs
  const url = `https://duckduckgo.com/?q=%5C${encodeURIComponent(`${searchQuery} ratings reviews site:edmunds.com !ducky`)}`;
  console.log({ url });
  await upsertRatings([
    {
      edmunds_url: url,
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
    const mainElement = await page.waitForSelector('#main-content', {
      timeout: 3_000, // max milliseconds to wait
    });
    if (mainElement) {
      const consumerRatingText = await getValueFromSelector(page, '.consumer-reviews .average-user-rating');
      const reviewCountText = await getValueFromSelector(page, '.consumer-reviews .review-count');
      const costToDriveText = await getValueFromSelector(page, '[data-tracking-id="view_cost_to_drive"]');
      const reliabilityRatingText = await getValueFromSelector(page, '#subnav-reliability .rating-number');

      const payload = {
        edmunds_monthly_cost_to_drive_estimate: getNumberWithinString(costToDriveText),
        edmunds_rating: getNumberWithinString(consumerRatingText),
        edmunds_ratings_count: getNumberWithinString(reviewCountText),
        edmunds_repair_pal_reliability_rating: reliabilityRatingText ? Number(reliabilityRatingText) : undefined,
        edmunds_url: currentUrl,
        model_id: modelId,
      };
      console.log({ payload });
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
