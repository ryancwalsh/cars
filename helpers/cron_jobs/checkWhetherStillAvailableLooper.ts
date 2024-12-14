// `clear && yarn tsx helpers/cron_jobs/checkWhetherStillAvailableLooper.ts`

import dayjs from 'dayjs';

import { defaultWeights } from '../../components/WeightsInputs';
import { type Database } from '../../database.types';
import { sleep } from '../generic/chromium';
import { getLatestCarGurusListing } from '../scrapers/carGurusListing';
import { supabaseClient } from '../supabase';
import { getListingsWithWeightedRatings } from '../weightedRating';

/**
 * checks each "active" listing in the `queue` view to see if it's still available at CarGurus and updates the `listings` row to say when it was last checked (and update to inactive as necessary or update image)
 */
// eslint-disable-next-line max-lines-per-function
async function check() {
  const yesterday = dayjs().subtract(1, 'day').startOf('day').toISOString();
  const { data: rows } = await supabaseClient
    .from<'queue', Database['public']['Views']['queue']>('queue')
    .select()
    //   .eq(
    //     'image_url',
    //     'https://static-assets.cargurus.com/images/site-cars/no-image-placeholder_c80f77463a1c0559e4735b57ed1d96ec8ff77ec6bce5b247bb733c96e18316b7.svg_09568b15a17955ae746cd5eecca394230418525f04876ca54ce21146bea353e9.svg',
    // )
    .lte('last_checked_at', yesterday);
  console.log({ rows }, rows?.length);

  if (rows) {
    let counter = 1;
    const listings = getListingsWithWeightedRatings(rows, defaultWeights);

    // console.log({ listings }, listings.length);

    for (const row of listings) {
      console.log({ row }, `${counter} of ${rows.length}`);
      if (row.found_at_url) {
        const vin = row.vin as string;
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
