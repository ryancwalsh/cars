// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/addNewListings

import { HttpStatusCode } from 'axios';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { type Database } from '../../database.types';
import { demoScrapedListingsJsonString } from '../../helpers/demo';
import { upsertModels } from '../../helpers/supabase';
import { type ScrapedListing } from '../../helpers/types';

function getModelsFromListings(listings: ScrapedListing[]) {
  return listings.map((listing) => {
    const modelToInsert: Database['public']['Tables']['models']['Insert'] = { make: listing.make, model: listing.model, trim: listing.trim, year: listing.year };
    return modelToInsert;
  });
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  // FIXNOW:  const listingsAsJsonString = request.query.listings as string;
  const listingsAsJsonString = demoScrapedListingsJsonString;
  const listings = JSON.parse(listingsAsJsonString);

  // console.log({ listings, listingsAsJsonString });

  const models = getModelsFromListings(listings);

  // const result = await upsertAndGetIds<'models'>('models', models, ['year', 'make', 'model', 'trim']);
  const result = await upsertModels(models, ['year', 'make', 'model', 'trim']);

  response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
}
