import { type Database } from '../database.types';

export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
/**
 * // TODO: Reduce duplication with `JSON` type generated by https://supabase.com/docs/guides/api/rest/generating-types
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

type Primitive = string | number | boolean | null;

export type FlatJson = Record<string, Primitive>;

export type TableRows<TableName extends keyof Database['public']['Tables']> = Array<Database['public']['Tables'][TableName]['Insert']>;

type Tables = Database['public']['Tables'];
type ListingsTable = Tables['listings'];
type ListingsTableRow = ListingsTable['Row'];

export type ScrapedListing = {
  make: string;
  model: string;
  trim: string;
  year: number;
} & ListingsTableRow;

export type ModelIdsMap = { [key: string]: number };
