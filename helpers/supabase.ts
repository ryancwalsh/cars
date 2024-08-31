// TODO: Figure out how to avoid "as" and "unknown" while in TS types.
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';
import { type JsonObject } from './types';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// eslint-disable-next-line max-lines-per-function
export async function upsertAndGetIds<RowT extends JsonObject>(tableName: string, records: RowT[], uniqueColumns: string[]) {
  // Step 1: Build a dynamic filter for fetching existing records
  const filters = records.map((record) => {
    const filterObject: JsonObject = {};
    for (const column of uniqueColumns) {
      filterObject[column] = record[column];
    }

    return filterObject;
  });
  console.log({ filters });

  // Step 2: Fetch all existing records that match the unique combination of columns
  let query = supabaseClient.from(tableName).select(`id, ${uniqueColumns.join(', ')}`);
  // TODO: Fix this section, and make it compare lowercase strings.
  for (const filter of filters) {
    query = query.or(uniqueColumns.map((column) => `${column}.eq.${filter[column]}`).join(','));
  }

  const queryResult = await query;
  const existingRecords = queryResult.data; // TODO: : RowT[] | null
  const selectError = queryResult.error;
  console.log({ existingRecords, query, selectError });

  if (selectError) {
    console.error('Error fetching existing records:', selectError);
    return { data: null, error: selectError };
  }

  // Step 3: Determine which records need to be inserted
  const existingValues = new Set(existingRecords?.map((record) => uniqueColumns.map((column) => record[column]).join('|')));
  console.log({ existingValues });

  const recordsToInsert = records.filter((record) => {
    const key = uniqueColumns.map((column) => record[column]).join('|');
    return !existingValues.has(key);
  });
  console.log({ recordsToInsert });

  // Step 4: Insert non-existing records and get their IDs
  let insertedRecords: RowT[] = [];
  if (recordsToInsert.length > 0) {
    const { data: insertedData, error: insertError } = await supabaseClient
      .from(tableName)
      .insert(recordsToInsert)
      .select(`id, ${uniqueColumns.join(', ')}`);

    if (insertError) {
      console.error('Error inserting new records:', insertError);
      return { data: null, error: insertError };
    }

    if (insertedData) {
      insertedRecords = insertedData;
    }
  }

  // Step 5: Combine the IDs of existing and inserted records
  const allRecords = [...insertedRecords];
  if (existingRecords) {
    allRecords.push(...existingRecords);
  }

  console.log({ existingRecords, insertedRecords });

  // Step 6: Return the combined results with IDs
  return { data: allRecords, error: null };
}
