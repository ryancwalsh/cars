/* eslint-disable n/no-process-env */

export const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';
export const CHROME_PATH = process.env.CHROME_PATH ?? '';
/**
 * https://github.com/Sparticuz/chromium/releases
 */
export const CHROMIUM_TAR = process.env.CHROMIUM_TAR ?? 'https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar';
