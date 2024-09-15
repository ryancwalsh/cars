// This API endpoint is probably unused since cron jobs probably call TS scripts directly.
// `http://localhost:3000/api/addNewListings`
// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/addNewListings

// import { HttpStatusCode } from 'axios';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { addNewListings } from '../../helpers/addNewListings';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const result = await addNewListings();

  // response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
  response.json(result);
}
