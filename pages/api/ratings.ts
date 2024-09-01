// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/ratings?site=cars&searchQuery=2015%20Honda%20Civic%20hatchback

import { type NextApiRequest, type NextApiResponse } from 'next';

import { getCarsDotComRatings } from '../../helpers/ratings/cars_dot_com';
import { getKbbRatings } from '../../helpers/ratings/kbb';
import { type FlatJson } from '../../helpers/types';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const searchQuery = request.query.searchQuery as string;
  const site = request.query.site as string;

  console.log({ searchQuery, site });

  let result: FlatJson | null;
  if (site === 'kbb') {
    result = await getKbbRatings(searchQuery);
  } else {
    result = await getCarsDotComRatings(searchQuery);
  }

  console.log({ result });

  // FIXNOW: Return all ratings for this model from DB
  // response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
  response.json(result);
}
