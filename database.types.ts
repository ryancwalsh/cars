// Generated by https://supabase.com/docs/guides/api/rest/generating-types

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Tables: {
      listings: {
        Insert: {
          body_type?: string | null;
          concerns?: string | null;
          created_at?: string;
          drivetrain?: string | null;
          engine?: string | null;
          exterior_color?: string | null;
          found_at_url?: string | null;
          fuel_type?: string | null;
          image_url?: string | null;
          interior_color?: string | null;
          is_active?: boolean;
          listing_url?: string | null;
          location?: string | null;
          mileage?: number | null;
          model_id: number;
          note?: string | null;
          notes_from_test_drives?: string | null;
          number_of_owners?: number | null;
          price_approx?: number | null;
          priority?: number | null;
          safety_rating?: number | null;
          transmission?: string | null;
          vin: string;
          vin_report_url?: string | null;
        };
        Relationships: [
          {
            columns: ['model_id'];
            foreignKeyName: 'listings_model_id_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'models';
          },
        ];
        Row: {
          body_type: string | null;
          concerns: string | null;
          created_at: string;
          drivetrain: string | null;
          engine: string | null;
          exterior_color: string | null;
          found_at_url: string | null;
          fuel_type: string | null;
          image_url: string | null;
          interior_color: string | null;
          is_active: boolean;
          listing_url: string | null;
          location: string | null;
          mileage: number | null;
          model_id: number;
          note: string | null;
          notes_from_test_drives: string | null;
          number_of_owners: number | null;
          price_approx: number | null;
          priority: number | null;
          safety_rating: number | null;
          transmission: string | null;
          vin: string;
          vin_report_url: string | null;
        };
        Update: {
          body_type?: string | null;
          concerns?: string | null;
          created_at?: string;
          drivetrain?: string | null;
          engine?: string | null;
          exterior_color?: string | null;
          found_at_url?: string | null;
          fuel_type?: string | null;
          image_url?: string | null;
          interior_color?: string | null;
          is_active?: boolean;
          listing_url?: string | null;
          location?: string | null;
          mileage?: number | null;
          model_id?: number;
          note?: string | null;
          notes_from_test_drives?: string | null;
          number_of_owners?: number | null;
          price_approx?: number | null;
          priority?: number | null;
          safety_rating?: number | null;
          transmission?: string | null;
          vin?: string;
          vin_report_url?: string | null;
        };
      };
      models: {
        Insert: {
          back_seat_folds_flat?: boolean | null;
          concern?: string | null;
          created_at?: string;
          id?: number;
          make: string;
          model: string;
          note?: string | null;
          trim?: string;
          year: number;
        };
        Relationships: [];
        Row: {
          back_seat_folds_flat: boolean | null;
          concern: string | null;
          created_at: string;
          id: number;
          make: string;
          model: string;
          note: string | null;
          trim: string;
          year: number;
        };
        Update: {
          back_seat_folds_flat?: boolean | null;
          concern?: string | null;
          created_at?: string;
          id?: number;
          make?: string;
          model?: string;
          note?: string | null;
          trim?: string;
          year?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions['schema']]['Tables'] : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions['schema']]['Tables'] : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums'] : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;