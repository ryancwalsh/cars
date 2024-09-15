import { closeAllOpenTabs, getChromium } from '../generic/chromium';
import { getNumberWithinString } from '../generic/numbers';
import { upsertRatings } from '../supabase';
import { saveHtml } from './logging';

/**
 * Use DuckDuckGo to find KBB URL, then visit KBB, and wait for reviews element
 * https://github.com/Sparticuz/chromium?tab=readme-ov-file#-min-package
 * https://github.com/Sparticuz/chromium/blob/master/examples/remote-min-binary/index.js
 */
// eslint-disable-next-line max-lines-per-function
export async function getKbbRatings(searchQuery: string, modelId: number) {
  // https://superuser.com/questions/1496083/google-feeling-lucky-url-causing-redirect-notice/1496084#comment2934824_1496084
  // https://duckduckgo.com/bangs?q=kbb
  // const url = `https://duckduckgo.com/?q=%5C${encodeURIComponent(searchQuery)} !kbb`;
  const url = `https://duckduckgo.com/?q=%5C${encodeURIComponent(`${searchQuery} site:kbb.com !ducky`)}`;
  console.log({ url });
  const { browser, page } = await getChromium();

  try {
    await page.goto(url, {
      // waitUntil: 'domcontentloaded',
      waitUntil: 'networkidle0',
    });
    console.log(`visited ${url}`);

    const currentUrl = await saveHtml(page, url, searchQuery);

    // wait for all redirects https://stackoverflow.com/a/57007420/470749
    const appElement = await page.waitForSelector('#app', {
      timeout: 3_000, // max milliseconds to wait
    });

    const consumerReviewElement = await appElement?.$('#consumerreview .css-1sx61am.e1uau9z01');
    const consumerRatingsCountDescriptionTextContent = await consumerReviewElement?.getProperty('textContent');
    const consumerRatingsCountDescription = await consumerRatingsCountDescriptionTextContent?.jsonValue();

    const ratingsElements = await appElement?.$$('.css-1c7qqqr');
    if (ratingsElements) {
      const expertRatingElementTextContent = await ratingsElements[0].getProperty('textContent');
      const expertRatingString = await expertRatingElementTextContent?.jsonValue();
      const consumerRatingElementTextContent = await ratingsElements[1].getProperty('textContent');
      const consumerRatingString = await consumerRatingElementTextContent?.jsonValue();
      const payload = {
        kbb_consumer_rating: Number(consumerRatingString),
        kbb_consumer_ratings_count: getNumberWithinString(consumerRatingsCountDescription),
        kbb_expert_rating: Number(expertRatingString),
        kbb_url: currentUrl,
        model_id: modelId,
      };
      console.log({ consumerRatingString, expertRatingString, payload });

      const result = await upsertRatings([payload]);

      return result;
    } else {
      throw new Error('Could not find the reviews element');
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
