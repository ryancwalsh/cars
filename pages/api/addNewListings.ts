// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/addNewListings

import { HttpStatusCode } from 'axios';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { type Database } from '../../database.types';
import { demoScrapedListingsJsonString } from '../../helpers/demo';
import { upsertListings, upsertModels } from '../../helpers/supabase';
import { type ModelIdsMap, type ScrapedListing, type TableRows } from '../../helpers/types';

function getLowercaseHash(listing: ScrapedListing): string {
  return `${listing.year}_${listing.make}_${listing.model}_${listing.trim}`.toLowerCase();
}

function getModelsFromListings(listings: ScrapedListing[]) {
  return listings.map((listing) => {
    const modelToInsert: Database['public']['Tables']['models']['Insert'] = {
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
    const modelToInsert: Database['public']['Tables']['models']['Insert'] = {
      model_id: modelIdsMap[lowercaseHash],
      ...listing,
    };
    delete modelToInsert.make;
    delete modelToInsert.model;
    delete modelToInsert.year;
    delete modelToInsert.trim;

    return modelToInsert;
  });
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  // FIXNOW:  const listingsAsJsonString = request.query.listings as string;
  const listingsAsJsonString = demoScrapedListingsJsonString;
  const listings = JSON.parse(listingsAsJsonString);

  // console.log({ listings, listingsAsJsonString });

  const models = getModelsFromListings(listings);

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

  response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
}
