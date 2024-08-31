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
