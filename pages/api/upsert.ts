// https://peterwhite.dev/posts/vercel-puppeteer-2024
// https://github.com/sparticuz/chromium?tab=readme-ov-file#chromium-for-serverless-platforms
// http://localhost:3000/api/upsert?models=[{%22make%22:%22z%22,%20%22model%22:%20%22x%22,%22year%22:%202024,%20%22trim%22:%22y%22}]

import { HttpStatusCode } from 'axios';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { upsertAndGetIds } from '../../helpers/supabase';
import { type Model } from '../../helpers/types';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const modelsAsJsonString = request.query.models as string;
  const models = JSON.parse(modelsAsJsonString);
  console.log({ models, modelsAsJsonString });

  const result = await upsertAndGetIds<Model>('models', models, ['year', 'make', 'model', 'trim']);

  response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
}
