// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/ratings?site=cars&model_id=180&searchQuery=2015%20Honda%20Civic%20hatchback
// http://localhost:3000/api/ratings?site=kbb&model_id=180&searchQuery=2015%20Honda%20Civic%20hatchback
// https://cars-walsh.vercel.app/api/ratings?site=cars&model_id=180&searchQuery=2015%20Honda%20Civic%20hatchback
// https://vercel.com/ryancwalshs-projects/cars/logs?slug=app-future&slug=en-US&slug=ryancwalshs-projects&slug=cars&slug=logs&page=1&timeline=past30Minutes&live=true

import { type NextApiRequest, type NextApiResponse } from 'next';

import { getCarsDotComRatings } from '../../helpers/ratings/cars_dot_com';
import { getKbbRatings } from '../../helpers/ratings/kbb';
import { type upsertRatings } from '../../helpers/supabase';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const searchQuery = request.query.searchQuery as string;
  const site = request.query.site as string;
  const modelId = Number(request.query.model_id as string);

  console.log({ searchQuery, site });

  let result: null | Awaited<ReturnType<typeof upsertRatings>>;
  if (site === 'kbb') {
    result = await getKbbRatings(searchQuery, modelId);
  } else {
    result = await getCarsDotComRatings(searchQuery, modelId);
  }

  console.log({ result });

  // response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
  response.json(result);
}
