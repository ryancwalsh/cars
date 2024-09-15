import { type Database } from '../database.types';
import { fetchRatings } from '../pages/api/ratings/fetch';
import { Sites } from './enums';
import { supabaseClient } from './supabase';

function getQueryParameters(row: Database['public']['Views']['missing_ratings']['Row']) {
  let site;
  if (row.cars_dot_com_url) {
    if (row.edmunds_url) {
      site = Sites.KBB;
    } else {
      site = Sites.EDMUNDS;
    }
  } else {
    site = Sites.CARS_DOT_COM;
  }

  const searchQuery = `${row.year} ${row.make} ${row.model} ${row.trim}`;
  const queryParameters = {
    modelId: row.id,
    searchQuery,
    site,
  };
  console.log({ queryParameters });

  return queryParameters;
}

export async function determineMissing() {
  /**
   * https://stackoverflow.com/a/72091477/470749
   * https://github.com/PostgREST/postgrest/discussions/2014#discussioncomment-1598919
   */
  const { data: rows } = await supabaseClient.from<'missing_ratings', Database['public']['Views']['missing_ratings']>('missing_ratings').select();

  console.log({ rows }, rows?.length);

  if (rows) {
    const firstRow = rows[0];
    console.log({ firstRow });
    const { modelId, site, searchQuery } = getQueryParameters(firstRow);
    // For just the first model that is missing ratings from at least one site, fetch the ratings from just the first site.
    await fetchRatings(site, searchQuery, modelId as number);
  }

  console.log('determineMissing finished.');
}
