// TODO: Figure out how to avoid "as" and "unknown" while in TS types.
import { createClient, type QueryData } from '@supabase/supabase-js';

import { type Database } from '../database.types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';
import { getUniqueObjects } from './generic/arrays';
import { type FlatJson } from './types';

const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

type TableRows<TableName extends keyof Database['public']['Tables']> = Array<Database['public']['Tables'][TableName]['Insert']>;

// TODO: https://supabase.com/docs/reference/javascript/upsert
// eslint-disable-next-line max-lines-per-function
export async function upsertAndGetIds<TableName extends keyof Database['public']['Tables']>(tableName: TableName, records: TableRows<TableName>, uniqueColumns: string[]) {
  // Step 1: Build a dynamic filter for fetching existing records
  const filters = records.map((record) => {
    const filterObject: FlatJson = {};
    for (const column of uniqueColumns) {
      filterObject[column] = record[column];
    }

    return filterObject;
  });
  const uniqueFilters = getUniqueObjects(filters);
  // console.log({ uniqueFilters });

  // Step 2: Fetch all existing records that match the unique combination of columns
  const uniqueLowercasedFilters = uniqueFilters.map((filter) => {
    const lowercasedFilter: FlatJson = {};
    for (const key in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, key)) {
        lowercasedFilter[key] = typeof filter[key] === 'string' ? filter[key].toLowerCase() : filter[key];
      }
    }

    return lowercasedFilter;
  });
  console.log({ uniqueLowercasedFilters });

  let query = supabaseClient.from(tableName).select(`id, ${uniqueColumns.join(', ')}`);

  // TODO https://supabase.com/docs/reference/javascript/like

  for (const filter of uniqueLowercasedFilters) {
    const orConditions = uniqueColumns
      .map((column) => {
        if (typeof filter[column] === 'number') {
          return `${column}.eq.${filter[column]}`;
        } else {
          return `${column}.ilike.${encodeURIComponent(filter[column])}`;
        }
      })
      .join(',');
    // console.log({ orConditions });
    query = query.or(orConditions);
  }

  type Rows = QueryData<typeof query>; // https://supabase.com/docs/reference/javascript/select#response-types-for-complex-queries

  const queryResult = await query;
  const existingRecords: Rows | null = queryResult.data;
  const selectError = queryResult.error;
  console.log({ existingRecords, query, selectError });

  if (selectError) {
    console.error('Error fetching existing records:', selectError);
    return { data: null, error: selectError };
  }

  // Step 3: Determine which records need to be inserted
  // TODO: `record[column]` has an error: `Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)`
  const existingValues = new Set(existingRecords?.map((record) => uniqueColumns.map((column) => record[column]).join('|')));
  console.log({ existingValues });

  const recordsToInsert = records.filter((record) => {
    const key = uniqueColumns.map((column) => record[column]).join('|');
    return !existingValues.has(key);
  });
  const uniqueRecordsToInsert = getUniqueObjects(recordsToInsert);
  console.log({ uniqueRecordsToInsert });

  // Step 4: Insert non-existing records and get their IDs
  let insertedRecords: TableRows<TableName> = [];
  if (uniqueRecordsToInsert.length > 0) {
    const { data: insertedData, error: insertError } = await supabaseClient
      .from<TableName, Database['public']['Tables'][TableName]>(tableName)
      .insert(uniqueRecordsToInsert)
      .select(`id, ${uniqueColumns.join(', ')}`);

    if (insertError) {
      console.error('Error inserting new records:', insertError);
      return { data: null, error: insertError };
    }

    if (insertedData) {
      // TODO: fix error `'RowT' could be instantiated with an arbitrary type which could be unrelated to 'ParserError<`Expected identifier at \`${GenericStringError}\``>'.ts(2322)`
      insertedRecords = insertedData;
    }
  }

  // Step 5: Combine the IDs of existing and inserted records
  const allRecords = [...insertedRecords];
  if (existingRecords) {
    // TODO: fix error `'RowT' could be instantiated with an arbitrary type which could be unrelated to 'ParserError<`Expected identifier at \`${GenericStringError}\``>'.ts(2345)`
    allRecords.push(...existingRecords);
  }

  console.log({ existingRecords, insertedRecords });

  // Step 6: Return the combined results with IDs
  return { data: allRecords, error: null };
}

// https://supabase.com/docs/reference/javascript/upsert
// eslint-disable-next-line max-lines-per-function
export async function upsertModels(records: TableRows<'models'>, uniqueColumns: string[]) {
  // FIXNOW: Change the DB to have a column that is a lowercase join column to make this easier. Then the native upsert function can work.
}
