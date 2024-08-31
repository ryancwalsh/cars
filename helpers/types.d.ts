export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export type Model = {
  back_seat_folds_flat?: boolean | null;
  concern?: string | null;
  /**
   * Using ISO string format for the timestamp
   */
  created_at: string;
  id: number;
  make: string;
  model: string;
  note?: string | null;
  trim: string;
  year: number;
};
