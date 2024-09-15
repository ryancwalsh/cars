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

function getModelsFromListings(listings: ScrapedListing[]) {
  return listings.map((listing) => {
    const modelToInsert: ModelInsertT = {
      lowercase_hash: getLowercaseHash(listing),
      make: listing.make,
      model: listing.model,
      trim: listing.trim,
      year: listing.year,
    };

    return modelToInsert;
  });
}

function getListingsWithModelIds(listings: Array<ScrapedListing & { model_id: number }>, modelIdsMap: ModelIdsMap): TableRows<'listings'> {
  return listings.map((listing) => {
    const lowercaseHash = getLowercaseHash(listing);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { make, model, year, trim, ...rest } = listing;
    const modelToInsert: ModelInsertT = {
      model_id: modelIdsMap[lowercaseHash],
      ...rest,
    };

    return modelToInsert;
  });
}

export async function addNewListings() {
  // const listingsAsJsonString = demoScrapedListingsJsonString;
  // const listings = JSON.parse(listingsAsJsonString);
  // console.log({ listings, listingsAsJsonString });
  const listings = await getLatestCarGurusListings();

  const models = getModelsFromListings(listings);

  console.log({ models });

  // TODO: Figure out why the type of `modelsResult` is `{    matchingRecords: GenericStringError[] | null;    upsertError: PostgrestError | null;}`
  const modelsResult = await upsertModels(models);
  // console.log(JSON.stringify({ modelsResult }, null, 2));

  const modelIdsMap: ModelIdsMap = {};
  if (modelsResult.matchingRecords) {
    for (const match of modelsResult.matchingRecords) {
      modelIdsMap[match.lowercase_hash] = match.id;
    }
  }

  console.log({ modelIdsMap });

  const listingsToInsert = getListingsWithModelIds(listings, modelIdsMap);
  console.log({ listingsToInsert });

  const result = await upsertListings(listingsToInsert);

  console.log({ result });
}
