// `clear && yarn tsx helpers/cron_jobs/determineMissingLooper.ts`

import { determineMissing } from '../determineMissing';

// Utility function to generate a random delay between a given min and max (in milliseconds)
function getRandomDelay(minSeconds: number, maxSeconds: number): number {
  const minMs = minSeconds * 1_000;
  const maxMs = maxSeconds * 1_000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

// Helper to sleep for a specified number of milliseconds
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Main function to manage the repeated calls
async function executeWithRandomIntervals(): Promise<void> {
  const MIN_DELAY_SECONDS = 5;
  const MAX_DELAY_SECONDS = 10;

  while (true) {
    try {
      await determineMissing();

      const delay = getRandomDelay(MIN_DELAY_SECONDS, MAX_DELAY_SECONDS);
      console.log(`[${new Date().toISOString()}] Waiting for ${(delay / 1_000).toFixed(2)} seconds`);

      await sleep(delay);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in determineMissing:`, error);
      // Decide on retry strategy or error handling as needed
    }
  }
}

// Kick off the process
executeWithRandomIntervals().catch((error) => {
  console.error(`[${new Date().toISOString()}] Critical failure:`, error);
  // process.exit(1); // Optional: Exit the process if an unrecoverable error occurs
  throw error;
});