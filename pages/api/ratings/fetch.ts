// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/ratings/fetch?site=cars&model_id=180&searchQuery=2015%20Honda%20Civic%20hatchback
// http://localhost:3000/api/ratings/fetch?site=kbb&model_id=180&searchQuery=2015%20Honda%20Civic%20hatchback
// http://localhost:3000/api/ratings/fetch?site=edmunds&model_id=180&searchQuery=2015%20Honda%20Civic%20hatchback
// https://cars-walsh.vercel.app/api/ratings?site=cars&model_id=180&searchQuery=2015%20Honda%20Civic%20hatchback
// https://vercel.com/ryancwalshs-projects/cars/logs?slug=app-future&slug=en-US&slug=ryancwalshs-projects&slug=cars&slug=logs&page=1&timeline=past30Minutes&live=true

import { type NextApiRequest, type NextApiResponse } from 'next';

import { Sites } from '../../../helpers/enums';
import { getCarsDotComRatings } from '../../../helpers/scrapers/carsDotCom';
import { getEdmundsRatings } from '../../../helpers/scrapers/edmunds';
import { getKbbRatings } from '../../../helpers/scrapers/kbb';

type FetchedRatingsT = Awaited<ReturnType<typeof getKbbRatings>> | Awaited<ReturnType<typeof getEdmundsRatings>> | Awaited<ReturnType<typeof getCarsDotComRatings>> | null;

export async function fetchRatings(site: string, searchQuery: string, modelId: number): Promise<FetchedRatingsT> {
  console.log({ searchQuery, site });

  let result: FetchedRatingsT;
  if (site === Sites.KBB) {
    result = await getKbbRatings(searchQuery, modelId);
  } else if (site === Sites.EDMUNDS) {
    result = await getEdmundsRatings(searchQuery, modelId);
  } else {
    result = await getCarsDotComRatings(searchQuery, modelId);
  }

  console.log({ result });

  return result;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const searchQuery = request.query.searchQuery as string;
  const site = request.query.site as string;
  const modelId = Number(request.query.model_id as string);

  const result = await fetchRatings(site, searchQuery, modelId);

  // response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
  response.json(result);
}
