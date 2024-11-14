// `http://localhost:3000/api/addNewListings`
// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/addNewListings

import { type Database } from '../database.types';
// import { demoScrapedListingsJsonString } from '../../helpers/demo';
import { getLatestCarGurusListings } from './scrapers/carGurus';
import { upsertListings, upsertModels } from './supabase';
import { type ModelIdsMap, type ScrapedListing, type TableRows } from './types';

type ModelInsertT = Database['public']['Tables']['models']['Insert'];

function getLowercaseHash(listing: ScrapedListing): string {
  return `${listing.year}_${listing.make}_${listing.model}_${listing.trim}`.toLowerCase();
}

function getUniqueModelsFromListings(listings: ScrapedListing[]): ModelInsertT[] {
  const uniqueHashes = new Set<string>();
  const uniqueModels: ModelInsertT[] = [];

  for (const listing of listings) {
    const lowercaseHash = getLowercaseHash(listing);

    if (!uniqueHashes.has(lowercaseHash)) {
      uniqueHashes.add(lowercaseHash);

      uniqueModels.push({
        lowercase_hash: lowercaseHash,
        make: listing.make,
        model: listing.model,
        trim: listing.trim,
        year: listing.year,
      });
    }
  }

  return uniqueModels;
}

/**
 * To be able to upsert a listing, we need to have first upserted model data in order to get the model_id for that particular lowercase_hash of the model data.
 * This function then looks up the model_id from modelIdsMap and attaches that model_id to the listing data (in preparation to upsert it).
 */
function getListingsWithModelIds(listings: ScrapedListing[], modelIdsMap: ModelIdsMap): TableRows<'listings'> {
  return listings.map((listing) => {
    const lowercaseHash = getLowercaseHash(listing);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { make, model, year, trim, ...rest } = listing;
    const freshListing: TableRows<'listings'>[0] = {
      ...rest,
      model_id: modelIdsMap[lowercaseHash],
    };

    return freshListing;
  });
}

export async function addNewListings(pageNumber = 1) {
  // const listingsAsJsonString = demoScrapedListingsJsonString;
  // const listings = JSON.parse(listingsAsJsonString);
  // console.log({ listings, listingsAsJsonString });
  const listings = await getLatestCarGurusListings(pageNumber);

  const models = getUniqueModelsFromListings(listings);

  // console.log({ models });

  const modelsResult = await upsertModels(models);
  // console.log(JSON.stringify({ modelsResult }, null, 2));

  const modelIdsMap: ModelIdsMap = {};
  if (modelsResult.matchingRecords) {
    for (const modelRecord of modelsResult.matchingRecords) {
      modelIdsMap[modelRecord.lowercase_hash] = modelRecord.id;
    }
  }

  console.log({ modelIdsMap });

  const listingsWithMissingVin = listings?.filter((listing) => listing.vin === null);
  if (listingsWithMissingVin && listingsWithMissingVin.length > 0) {
    console.error({ listingsWithMissingVin }, listingsWithMissingVin.length);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`');
  }

  const listingsToInsert = getListingsWithModelIds(
    listings.filter((listing) => listing.vin !== null),
    modelIdsMap,
  );
  console.log('listingsToInsert.length', listingsToInsert.length);

  await upsertListings(listingsToInsert);
}
