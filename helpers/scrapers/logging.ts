import fs from 'node:fs';

import { type Page } from 'puppeteer-core';

import { SCRAPE_LOGS_PATH } from '../config';

export async function saveHtml(page: Page, url: string, searchQuery: string): Promise<string> {
  const currentUrl = page.url();
  console.log({ currentUrl });
  if (SCRAPE_LOGS_PATH) {
    // await page.screenshot({
    //   path: 'screenshot.png',
    // });
    const html = await page.content();
    const safeFilename = currentUrl.replaceAll(/[^a-z\d]/giu, '_').toLowerCase();
    const details = JSON.stringify({ searchQuery, url }, null, 2);

    const filePath = `${SCRAPE_LOGS_PATH}/${safeFilename}.html`;

    // Create the comment with details
    const comment = `<!--
  ${details}
  -->\n`;

    // Combine the comment and HTML content
    const contentToSave = comment + html;

    // Save HTML to local file with `details` saved to the top as a comment:
    fs.writeFileSync(filePath, contentToSave, 'utf8');

    console.log(`HTML saved to ${filePath}`);
  }

  return currentUrl;
}
