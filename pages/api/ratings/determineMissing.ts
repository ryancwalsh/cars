// http://localhost:3000/api/ratings/determineMissing?model_id=181

import { type NextApiRequest, type NextApiResponse } from 'next';

import { type Database } from '../../../database.types';
import { supabaseClient } from '../../../helpers/supabase';
import { fetchRatings } from './fetch';

// https://supabase.com/blog/postgresql-views
// TODO: add other ratings to view. Remember to re-run `npx supabase gen types --lang=typescript --project-id "yzvxivcshrizfccwujzp" --schema public > database.types.ts`
/*
drop view missing_ratings;
create view
  missing_ratings as
select
  models.id,
  models.year,
  models.make,
  models.model,
  models.trim,
  ratings.cars_dot_com_rating,
  ratings.cars_dot_com_ratings_count,
  ratings.kbb_consumer_rating,
  ratings.kbb_consumer_ratings_count,
  ratings.kbb_expert_rating
from
  models
  left join ratings on models.id = ratings.model_id
where
  ratings.kbb_consumer_rating is null
  OR ratings.cars_dot_com_rating is null
order by
  models.id ASC;
*/

function getQueryParameters(row: Database['public']['Views']['missing_ratings']['Row']) {
  const site = row.cars_dot_com_rating ? 'kbb' : 'cars_dot_com';
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
    const { modelId, site, searchQuery } = getQueryParameters(rows[0]);
    // For just the first model that is missing ratings from at least one site, fetch the ratings from just the first site.
    await fetchRatings(site, searchQuery, modelId as number);
  }

  response.json(rows);
}
