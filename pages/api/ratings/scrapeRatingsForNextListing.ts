// This API endpoint is probably unused since cron jobs probably call TS scripts directly.
// http://localhost:3000/api/ratings/scrapeRatingsForNextListing?model_id=181

import { type NextApiRequest, type NextApiResponse } from 'next';

import { scrapeRatingsForNextListing } from '../../../helpers/scrapeRatingsForNextListing';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const rows = scrapeRatingsForNextListing();

  response.json(rows);
}
