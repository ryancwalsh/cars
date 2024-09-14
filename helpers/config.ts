/* eslint-disable n/no-process-env */

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
