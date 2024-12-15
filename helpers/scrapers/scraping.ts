/* eslint-disable canonical/id-match */
import { JSDOM } from 'jsdom';
import { type Page } from 'puppeteer';

export async function getValueFromSelector(page: Page, selector: string): Promise<string | null | undefined> {
  try {
    const handle = await page.waitForSelector(selector, {
      timeout: 5_000, // max milliseconds to wait
    });
    const textContent = await handle?.getProperty('textContent');
    const jsonValue = await textContent?.jsonValue();
    return jsonValue;
  } catch (error) {
    console.error('Error finding the selector:', selector, error);
    return undefined;
  }
}

export function removeSubstringAtEnd(string: string, substring: string) {
  if (string.endsWith(substring)) {
    return string.slice(0, -substring.length);
  }

  return string;
}

export function getPriceFromText(input?: string | null) {
  const priceText = input?.trim().replaceAll(/[$,]/gu, '');
  return priceText ? Number.parseFloat(priceText) : null;
}

export function getElementFromHtml(html: string, selector: string): Element | null {
  const dom = new JSDOM(html);

  const element = dom.window.document.querySelector(selector);

  return element;
}
