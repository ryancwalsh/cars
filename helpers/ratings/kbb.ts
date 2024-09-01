import { getChromium } from '../generic/chromium';

/**
 * Use DuckDuckGo to find KBB URL, then visit KBB, and wait for reviews element
 * https://github.com/Sparticuz/chromium?tab=readme-ov-file#-min-package
 * https://github.com/Sparticuz/chromium/blob/master/examples/remote-min-binary/index.js
 */
// eslint-disable-next-line max-lines-per-function
export async function getKbbRatings(searchQuery: string) {
  // https://superuser.com/questions/1496083/google-feeling-lucky-url-causing-redirect-notice/1496084#comment2934824_1496084
  // https://duckduckgo.com/bangs?q=kbb
  // const url = `https://duckduckgo.com/?q=%5C${encodeURIComponent(searchQuery)}!kbb`;
  const url = `https://duckduckgo.com/?q=%5C${encodeURIComponent(`${searchQuery} ratings reviews site:cars.com !ducky`)}`;
  const { browser, page } = await getChromium();

  try {
    await page.goto(url, {
      // waitUntil: 'domcontentloaded',
      waitUntil: 'networkidle0',
    });
    console.log(`visited ${url}`);
    // await page.screenshot({
    //   path: 'a.png',
    // });

    const currentUrl = page.url();
    console.log({ currentUrl });
    // await page.waitForNavigation({
    //   timeout: 2_000, // max milliseconds to wait
    //   waitUntil: 'load',
    //   // waitUntil: 'networkidle0',
    // });
    // await page.screenshot({
    //   path: 'kbb.png',
    // });
    // const html = await page.content();
    // console.log({ html });
    // wait for all redirects https://stackoverflow.com/a/57007420/470749
    const reviewsElement = await page.waitForSelector('[data-automation="reviews"]', {
      timeout: 3_000, // max milliseconds to wait
    });
    // FIXNOW: Save to DB for this model

    return reviewsElement;
  } catch (error) {
    console.error('Error finding the reviews element:', error);
    return null;
  } finally {
    await browser.close();
  }
}
