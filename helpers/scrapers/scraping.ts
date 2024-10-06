/* eslint-disable canonical/id-match */
import { JSDOM } from 'jsdom';
import { type Page } from 'puppeteer';

export async function getValueFromSelector(page: Page, selector: string) {
  const handle = await page.waitForSelector(selector);
  const textContent = await handle?.getProperty('textContent');
  const jsonValue = await textContent?.jsonValue();
  return jsonValue;
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
