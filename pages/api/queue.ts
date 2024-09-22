import { type NextApiRequest, type NextApiResponse } from 'next';

import { type Database } from '../../database.types';
import { supabaseClient } from '../../helpers/supabase';

export type Queue = Database['public']['Views']['queue'];

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const result = await supabaseClient.from<'queue', Queue>('queue').select();
  console.log({ result });

  // response.status(result.data ? HttpStatusCode.Ok : HttpStatusCode.BadRequest).json(result);
  response.json(result);
}
