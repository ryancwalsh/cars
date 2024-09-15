/* eslint-disable n/no-process-env */

import dotenv from 'dotenv';

// Only call dotenv.config() when not in Next.js (check if process.env.NEXT_PUBLIC variable exists)
if (!process.env.NEXT_PUBLIC_ENV) {
  console.log('Loading environment variables from .env.local file');
  const result = dotenv.config({ path: '.env.local' });

  if (result.error) {
    console.error('Error loading .env.local file:', result.error);
  } else {
    console.log('.env.local loaded successfully');
  }
}

export const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';
export const CHROME_PATH = process.env.CHROME_PATH ?? '';
/**
 * https://github.com/Sparticuz/chromium/releases
 */
export const CHROMIUM_TAR = process.env.CHROMIUM_TAR ?? 'https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar';
export const SCRAPE_LOGS_PATH = process.env.SCRAPE_LOGS_PATH ?? '';
export const BROWSER_USER_DATA_DIRECTORY = process.env.BROWSER_USER_DATA_DIRECTORY ?? undefined;
export const IS_BROWSER_HEADLESS = process.env.IS_BROWSER_HEADLESS?.toLowerCase() === 'true';
