// `clear && yarn tsx helpers/cron_jobs/checkWhetherStillAvailableLooper.ts`

import dayjs from 'dayjs';

import { type Database } from '../../database.types';
import { sleep } from '../generic/chromium';
import { getLatestCarGurusListing } from '../scrapers/carGurusListing';
import { supabaseClient } from '../supabase';

/**
 * checks each "active" listing in the `queue` view to see if it's still available at CarGurus and updates the `listings` row to say when it was last checked (and update to inactive as necessary or update image)
 */
// eslint-disable-next-line max-lines-per-function
async function check() {
  const yesterday = dayjs().subtract(1, 'day').startOf('day').toISOString();
  const { data: rows } = await supabaseClient.from<'queue', Database['public']['Views']['queue']>('queue').select().lte('last_checked_at', yesterday);

  console.log({ rows }, rows?.length);

  if (rows) {
    let counter = 1;
    for (const row of rows) {
      console.log({ row }, `${counter} of ${rows.length}`);
      if (row.found_at_url) {
        const vin = row.vin as string; // TODO: Why does it think `row.vin` could ever be null?
        const details = await getLatestCarGurusListing(row.found_at_url);
        // See if it's still available at CarGurus:
        const isActive = details !== null;
        const payload: Database['public']['Tables']['listings']['Update'] = {
          is_active: isActive,
          last_checked_at: new Date().toISOString(),
        };
        if (isActive) {
          // eslint-disable-next-line canonical/id-match
          payload.image_url = details.image_url;
          // eslint-disable-next-line canonical/id-match
          payload.price_approx = details.price_approx;
          // eslint-disable-next-line canonical/id-match
          payload.listing_url = details.listing_url;
        }

        console.log({ payload, vin });

        const { error } = await supabaseClient.from('listings').update(payload).eq('vin', vin);
        if (error) {
          console.error(error);
        }

        await sleep(7_000);
      }

      counter += 1;
    }
  }
}

check();
