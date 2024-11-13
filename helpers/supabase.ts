import { createClient } from '@supabase/supabase-js';
import uniqBy from 'lodash/uniqBy';

import { type Database } from '../database.types';
import { environment } from './config';
import { type TableRows } from './types';

export const supabaseClient = createClient<Database>(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY);

/**
 * https://supabase.com/docs/reference/javascript/upsert
 */
export async function upsertModels(records: TableRows<'models'>) {
  const uniqueRecords = uniqBy(records, (item) => item.lowercase_hash);
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
export async function upsertListings(records: TableRows<'listings'>): Promise<void> {
  const uniqueRecords = uniqBy(records, (item) => item.vin);
  // console.log({ uniqueRecords });
  const onConflict = 'vin';
  console.log({ onConflict });
  const { error: upsertError } = await supabaseClient.from<'listings', Database['public']['Tables']['listings']>('listings').upsert(uniqueRecords, {
    ignoreDuplicates: true, // If true, duplicate rows are ignored. If false, duplicate rows are merged with existing rows.
    onConflict, // Comma-separated UNIQUE column(s) to specify how duplicate rows are determined. Two rows are duplicates if all the onConflict columns are equal.
  });

  // const { data: matchingRecords, error: selectError } = await supabaseClient
  //   .from<'listings', Database['public']['Tables']['listings']>('listings')
  //   .select()
  //   .in(
  //     'vin',
  //     uniqueRecords.map((record) => record.vin),
  //   );
  if (upsertError) {
    console.error('upsertListings', { uniqueRecords, upsertError });
  } else {
    console.log('upsertListings finished.');
  }
}

/**
 * https://supabase.com/docs/reference/javascript/upsert
 */
export async function upsertRatings(records: TableRows<'ratings'>) {
  const modelIdKey = 'model_id';

  const onConflict = modelIdKey;
  console.log({ onConflict });

  const { data: upsertData, error: upsertError } = await supabaseClient.from<'ratings', Database['public']['Tables']['ratings']>('ratings').upsert(records, {
    ignoreDuplicates: false, // If true, duplicate rows are ignored. If false, duplicate rows are merged with existing rows.
    onConflict, // Comma-separated UNIQUE column(s) to specify how duplicate rows are determined. Two rows are duplicates if all the onConflict columns are equal.
  });

  const { data: matchingRecords, error: selectError } = await supabaseClient
    .from<'ratings', Database['public']['Tables']['ratings']>('ratings')
    .select()
    .in(
      modelIdKey,
      records.map((record) => record[modelIdKey]),
    );

  console.log({ matchingRecords, selectError, upsertData, upsertError });

  return { matchingRecords, upsertError };
}
