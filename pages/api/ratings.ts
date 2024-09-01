// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/ratings?site=cars&model_id=180&searchQuery=2015%20Honda%20Civic%20hatchback

import { type NextApiRequest, type NextApiResponse } from 'next';

import { getCarsDotComRatings } from '../../helpers/ratings/cars_dot_com';
import { getKbbRatings } from '../../helpers/ratings/kbb';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const searchQuery = request.query.searchQuery as string;
  const site = request.query.site as string;
  const modelId = Number(request.query.model_id as string);

  console.log({ searchQuery, site });

  let result;
  if (site === 'kbb') {
    result = await getKbbRatings(searchQuery);
  } else {
    result = await getCarsDotComRatings(searchQuery, modelId);
  }

  console.log({ result });

  // response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
  response.json(result);
}
