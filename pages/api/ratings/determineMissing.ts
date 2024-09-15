// http://localhost:3000/api/ratings/determineMissing?model_id=181

import { type NextApiRequest, type NextApiResponse } from 'next';

import { type Database } from '../../../database.types';
import { Sites } from '../../../helpers/enums';
import { supabaseClient } from '../../../helpers/supabase';
import { fetchRatings } from './fetch';

function getQueryParameters(row: Database['public']['Views']['missing_ratings']['Row']) {
  const site = row.cars_dot_com_url ? Sites.CARS_DOT_COM : row.edmunds_url ? Sites.EDMUNDS : Sites.KBB;
  const searchQuery = `${row.year} ${row.make} ${row.model} ${row.trim}`;
  const queryParameters = {
    modelId: row.id,
    searchQuery,
    site,
  };
  console.log({ queryParameters });

  return queryParameters;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  /**
   * https://stackoverflow.com/a/72091477/470749
   * https://github.com/PostgREST/postgrest/discussions/2014#discussioncomment-1598919
   */
  const { data: rows } = await supabaseClient.from<'missing_ratings', Database['public']['Views']['missing_ratings']>('missing_ratings').select();

  console.log({ rows }, rows?.length);

  if (rows) {
    const firstRow = rows[0];
    const { modelId, site, searchQuery } = getQueryParameters(firstRow);
    // For just the first model that is missing ratings from at least one site, fetch the ratings from just the first site.
    await fetchRatings(site, searchQuery, modelId as number);
  }

  response.json(rows);
}
