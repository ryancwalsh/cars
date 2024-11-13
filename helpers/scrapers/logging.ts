import fs from 'node:fs';

import { type Page } from 'puppeteer';

import { environment } from '../config';

export function getSafeString(input: string): string {
  return input.replaceAll(/[^a-z\d]/giu, '_');
}

export async function saveHtml(page: Page, url: string, searchQuery?: string): Promise<string> {
  const currentUrl = page.url();
  console.log({ currentUrl });
  if (environment.SCRAPE_LOGS_PATH) {
    // await page.screenshot({
    //   path: 'screenshot.png',
    // });
    const html = await page.content();
    const maxLength = 100;
    const datetime = new Date().toISOString();
    const safeFilename = `${getSafeString(currentUrl.slice(-maxLength)).toLowerCase()}${getSafeString(datetime)}`;
    const details = JSON.stringify({ currentUrl, datetime, searchQuery, url }, null, 2);

    const filePath = `${environment.SCRAPE_LOGS_PATH}/${safeFilename}.html`;
    console.log({ filePath, maxLength });

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
