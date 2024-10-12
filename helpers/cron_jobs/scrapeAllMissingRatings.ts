// `clear && yarn tsx helpers/cron_jobs/scrapeAllMissingRatings.ts`

import { sleep } from '../generic/chromium';
import { scrapeRatingsForNextListing } from '../scrapeRatingsForNextListing';

function getRandomDelay(minSeconds: number, maxSeconds: number): number {
  const minMs = minSeconds * 1_000;
  const maxMs = maxSeconds * 1_000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

async function executeWithRandomIntervals(): Promise<void> {
  const MIN_DELAY_SECONDS = 5;
  const MAX_DELAY_SECONDS = 10;
  const SLOW_DELAY_MS = 1_000 * 60 * 60 * 2; // 2 hr

  while (true) {
    try {
      const rowsRemaining = await scrapeRatingsForNextListing();
      console.log({ rowsRemaining });
      const delayMs = rowsRemaining === 0 ? SLOW_DELAY_MS : getRandomDelay(MIN_DELAY_SECONDS, MAX_DELAY_SECONDS);
      console.log(`[${new Date().toISOString()}] Waiting for ${(delayMs / 1_000).toFixed(2)} seconds`);

      await sleep(delayMs);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in determineMissing:`, error);
    }
  }
}

executeWithRandomIntervals().catch((error) => {
  console.error(`[${new Date().toISOString()}] Critical failure:`, error);
  // process.exit(1); // Optional: Exit the process if an unrecoverable error occurs
  throw error;
});
