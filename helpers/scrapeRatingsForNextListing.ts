import { type Database } from '../database.types';
import { Sites } from './enums';
import { getCarsDotComRatings } from './scrapers/carsDotCom';
import { getEdmundsRatings } from './scrapers/edmunds';
import { getKbbRatings } from './scrapers/kbb';
import { supabaseClient } from './supabase';

type FetchedRatingsT = Awaited<ReturnType<typeof getKbbRatings>> | Awaited<ReturnType<typeof getEdmundsRatings>> | Awaited<ReturnType<typeof getCarsDotComRatings>> | null;

export async function fetchRatings(site: string, searchQuery: string, modelId: number): Promise<FetchedRatingsT> {
  console.log({ searchQuery, site });
  let result: FetchedRatingsT;
  if (site === Sites.KBB) {
    result = await getKbbRatings(searchQuery, modelId);
  } else if (site === Sites.EDMUNDS) {
    result = await getEdmundsRatings(searchQuery, modelId);
  } else {
    result = await getCarsDotComRatings(searchQuery, modelId);
  }

  console.log({ result });
  return result;
}

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

/**
 * Finds the first row of the missing_ratings view and fetches the ratings for the first type of ratings that are missing.
 */
export async function scrapeRatingsForNextListing() {
  /**
   * https://stackoverflow.com/a/72091477/470749
   * https://github.com/PostgREST/postgrest/discussions/2014#discussioncomment-1598919
   */
  const { data: rows } = await supabaseClient.from<'missing_ratings', Database['public']['Views']['missing_ratings']>('missing_ratings').select();

  console.log({ rows }, rows?.length);

  if (rows && rows.length > 0) {
    const firstRow = rows[0];
    console.log({ firstRow });
    const { modelId, site, searchQuery } = getQueryParameters(firstRow);
    // For just the first model that is missing ratings from at least one site, fetch the ratings from just the first site.
    await fetchRatings(site, searchQuery, modelId as number);
  }

  console.log('scrapeRatingsForNextListing finished.');

  return rows ? rows.length : 0;
}
