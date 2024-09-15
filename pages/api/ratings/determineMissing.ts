// This API endpoint is probably unused since cron jobs probably call TS scripts directly.
// http://localhost:3000/api/ratings/determineMissing?model_id=181

import { type NextApiRequest, type NextApiResponse } from 'next';

import { determineMissing } from '../../../helpers/cron_jobs/determineMissing';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const rows = determineMissing();

  response.json(rows);
}
