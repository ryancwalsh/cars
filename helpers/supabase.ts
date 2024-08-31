// import * as supabase from "../../libraries/supabase-js@2.js";
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

// console.log({ SUPABASE_URL, SUPABASE_ANON_KEY });

// const { createClient } = supabase;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// console.log({ supabaseClient });

// eslint-disable-next-line max-lines-per-function
export async function upsertAndGetIds<RowT>(tableName: string, records: RowT[], uniqueColumns: string[]) {
  // Step 1: Build a dynamic filter for fetching existing records
  const filters = records.map((record) => {
    const filterObject = {};
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

  const { data: existingRecords, error: selectError } = await query;
  console.log({ existingRecords, query, selectError });

  if (selectError) {
    console.error('Error fetching existing records:', selectError);
    return { data: null, error: selectError };
  }

  // Step 3: Determine which records need to be inserted
  const existingValues = new Set(existingRecords.map((record) => uniqueColumns.map((column) => record[column]).join('|')));
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
    } else {
      insertedRecords = insertedData;
    }
  }

  // Step 5: Combine the IDs of existing and inserted records
  const allRecords = [...existingRecords, ...insertedRecords];
  console.log({ existingRecords, insertedRecords });

  // Step 6: Return the combined results with IDs
  return { data: allRecords, error: null };
}
