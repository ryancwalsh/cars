/**
 * https://github.com/Sparticuz/chromium?tab=readme-ov-file#-min-package
 * https://github.com/Sparticuz/chromium/blob/master/examples/remote-min-binary/index.js
 */

import { getChromium } from '../generic/chromium';
import { getNumberWithinString } from '../generic/numbers';
import { upsertRatings } from '../supabase';
import { saveHtml } from './logging';

// eslint-disable-next-line max-lines-per-function
export async function getEdmundsRatings(searchQuery: string, modelId: number) {
  // https://superuser.com/questions/1496083/google-feeling-lucky-url-causing-redirect-notice/1496084#comment2934824_1496084
  // https://duckduckgo.com/bangs
  const url = `https://duckduckgo.com/?q=%5C${encodeURIComponent(`${searchQuery} ratings reviews site:edmunds.com !ducky`)}`;
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
      const consumeRatingElement = await mainElement.$('.consumer-reviews .average-user-rating');
      const consumerRatingTextContent = await consumeRatingElement?.getProperty('textContent');
      const consumerRatingText = await consumerRatingTextContent?.jsonValue();
      const reviewCountElement = await mainElement.$('.consumer-reviews .review-count');
      const reviewCountTextContent = await reviewCountElement?.getProperty('textContent');
      const reviewCountText = await reviewCountTextContent?.jsonValue();

      const costToDriveElement = await mainElement.$('[data-tracking-id="view_cost_to_drive"]');
      const costToDriveTextContent = await costToDriveElement?.getProperty('textContent');
      const costToDriveText = await costToDriveTextContent?.jsonValue();

      const reliabilityRatingElement = await mainElement.$('#subnav-reliability .rating-number');
      const reliabilityRatingTextContent = await reliabilityRatingElement?.getProperty('textContent');
      const reliabilityRatingText = await reliabilityRatingTextContent?.jsonValue();

      const payload = {
        edmunds_monthly_cost_to_drive_estimate: getNumberWithinString(costToDriveText),
        edmunds_rating: getNumberWithinString(consumerRatingText),
        edmunds_ratings_count: getNumberWithinString(reviewCountText),
        edmunds_repair_pal_reliability_rating: Number(reliabilityRatingText),
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
    await browser.close();
  }
}
