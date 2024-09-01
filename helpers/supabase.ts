import { createClient } from '@supabase/supabase-js';

import { type Database } from '../database.types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';
import { getUniqueObjects } from './generic/arrays';
import { type TableRows } from './types';

const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * https://supabase.com/docs/reference/javascript/upsert
 */
export async function upsertModels(records: TableRows<'models'>) {
  const uniqueRecords = getUniqueObjects(records);
  // console.log({ uniqueRecords });
  const onConflict = 'lowercase_hash';
  console.log({ onConflict });
  const { data: upsertData, error: upsertError } = await supabaseClient.from<'models', Database['public']['Tables']['models']>('models').upsert(uniqueRecords, {
    ignoreDuplicates: true, // If true, duplicate rows are ignored. If false, duplicate rows are merged with existing rows.
    onConflict, // Comma-separated UNIQUE column(s) to specify how duplicate rows are determined. Two rows are duplicates if all the onConflict columns are equal.
  });

  const { data: matchingRecords, error: selectError } = await supabaseClient
    .from<'models', Database['public']['Tables']['models']>('models')
    .select(['id', 'lowercase_hash'].join(','))
    .in(
      'lowercase_hash',
      uniqueRecords.map((record) => record.lowercase_hash),
    );

  console.log({ matchingRecords, selectError, upsertData, upsertError });

  return { matchingRecords, upsertError };
}

/**
 * https://supabase.com/docs/reference/javascript/upsert
 */
export async function upsertListings(records: TableRows<'listings'>) {
  const uniqueRecords = getUniqueObjects(records);
  // console.log({ uniqueRecords });
  const onConflict = 'vin';
  console.log({ onConflict });
  const { data: upsertData, error: upsertError } = await supabaseClient.from<'listings', Database['public']['Tables']['listings']>('listings').upsert(uniqueRecords, {
    ignoreDuplicates: true, // If true, duplicate rows are ignored. If false, duplicate rows are merged with existing rows.
    onConflict, // Comma-separated UNIQUE column(s) to specify how duplicate rows are determined. Two rows are duplicates if all the onConflict columns are equal.
  });

  const { data: matchingRecords, error: selectError } = await supabaseClient
    .from<'listings', Database['public']['Tables']['listings']>('listings')
    .select()
    .in(
      'vin',
      uniqueRecords.map((record) => record.vin),
    );

  console.log({ matchingRecords, selectError, upsertData, upsertError });

  return { matchingRecords, upsertError };
}
