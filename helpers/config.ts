/* eslint-disable n/no-process-env */
import { config } from 'dotenv';
import { bool, cleanEnv, str } from 'envalid'; // https://github.com/af/envalid

// Only call dotenv.config() when not in Next.js, such as cron jobs (check if process.env.NEXT_PUBLIC variable exists)
if (!process.env.NODE_ENV) {
  console.log('Loading environment variables from .env.local file');
  const result = config({ path: '.env.local' });

  if (result.error) {
    console.error('Error loading .env.local file:', result.error);
  } else {
    console.log('.env.local loaded successfully');
  }
}

export const environment = cleanEnv(process.env, {
  BROWSER_USER_DATA_DIRECTORY: str({ default: undefined }),
  CHROME_PATH: str({ default: '' }),
  // https://github.com/Sparticuz/chromium/releases
  CHROMIUM_TAR: str({ default: 'https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar' }),
  IS_BROWSER_HEADLESS: bool({ default: false }),
  SCRAPE_LOGS_PATH: str({ default: '' }),
  SUPABASE_ANON_KEY: str(),
  SUPABASE_URL: str(),
  // NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
});
