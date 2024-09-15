/* eslint-disable max-lines */
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
          found_at_url: string;
          fuel_type?: string | null;
          image_url?: string | null;
          interior_color?: string | null;
          is_active?: boolean;
          last_checked_at?: string;
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
            referencedRelation: 'finished_ratings';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'listings_model_id_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'missing_ratings';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'listings_model_id_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'models';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'listings_model_id_fkey';
            isOneToOne: false;
            referencedColumns: ['models__id'];
            referencedRelation: 'queue';
          },
        ];
        Row: {
          body_type: string | null;
          concerns: string | null;
          created_at: string;
          drivetrain: string | null;
          engine: string | null;
          exterior_color: string | null;
          found_at_url: string;
          fuel_type: string | null;
          image_url: string | null;
          interior_color: string | null;
          is_active: boolean;
          last_checked_at: string;
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
          found_at_url?: string;
          fuel_type?: string | null;
          image_url?: string | null;
          interior_color?: string | null;
          is_active?: boolean;
          last_checked_at?: string;
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
          lowercase_hash: string;
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
          lowercase_hash: string;
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
          lowercase_hash?: string;
          make?: string;
          model?: string;
          note?: string | null;
          trim?: string;
          year?: number;
        };
      };
      ratings: {
        Insert: {
          cars_dot_com_rating?: number | null;
          cars_dot_com_ratings_count?: number | null;
          cars_dot_com_url?: string | null;
          created_at?: string;
          edmunds_monthly_cost_to_drive_estimate?: number | null;
          edmunds_rating?: number | null;
          edmunds_ratings_count?: number | null;
          edmunds_repair_pal_reliability_rating?: number | null;
          edmunds_url?: string | null;
          id?: number;
          kbb_consumer_rating?: number | null;
          kbb_consumer_ratings_count?: number | null;
          kbb_expert_rating?: number | null;
          kbb_url?: string | null;
          model_id: number;
        };
        Relationships: [
          {
            columns: ['model_id'];
            foreignKeyName: 'ratings_model_id_fkey';
            isOneToOne: true;
            referencedColumns: ['id'];
            referencedRelation: 'finished_ratings';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'ratings_model_id_fkey';
            isOneToOne: true;
            referencedColumns: ['id'];
            referencedRelation: 'missing_ratings';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'ratings_model_id_fkey';
            isOneToOne: true;
            referencedColumns: ['id'];
            referencedRelation: 'models';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'ratings_model_id_fkey';
            isOneToOne: true;
            referencedColumns: ['models__id'];
            referencedRelation: 'queue';
          },
        ];
        Row: {
          cars_dot_com_rating: number | null;
          cars_dot_com_ratings_count: number | null;
          cars_dot_com_url: string | null;
          created_at: string;
          edmunds_monthly_cost_to_drive_estimate: number | null;
          edmunds_rating: number | null;
          edmunds_ratings_count: number | null;
          edmunds_repair_pal_reliability_rating: number | null;
          edmunds_url: string | null;
          id: number;
          kbb_consumer_rating: number | null;
          kbb_consumer_ratings_count: number | null;
          kbb_expert_rating: number | null;
          kbb_url: string | null;
          model_id: number;
        };
        Update: {
          cars_dot_com_rating?: number | null;
          cars_dot_com_ratings_count?: number | null;
          cars_dot_com_url?: string | null;
          created_at?: string;
          edmunds_monthly_cost_to_drive_estimate?: number | null;
          edmunds_rating?: number | null;
          edmunds_ratings_count?: number | null;
          edmunds_repair_pal_reliability_rating?: number | null;
          edmunds_url?: string | null;
          id?: number;
          kbb_consumer_rating?: number | null;
          kbb_consumer_ratings_count?: number | null;
          kbb_expert_rating?: number | null;
          kbb_url?: string | null;
          model_id?: number;
        };
      };
    };
    Views: {
      check_whether_still_available: {
        Insert: {
          created_at?: string | null;
          found_at_url?: string | null;
          last_checked_at?: string | null;
          listing_url?: string | null;
          vin?: string | null;
        };
        Relationships: [];
        Row: {
          created_at: string | null;
          found_at_url: string | null;
          last_checked_at: string | null;
          listing_url: string | null;
          vin: string | null;
        };
        Update: {
          created_at?: string | null;
          found_at_url?: string | null;
          last_checked_at?: string | null;
          listing_url?: string | null;
          vin?: string | null;
        };
      };
      finished_ratings: {
        Relationships: [];
        Row: {
          cars_dot_com_rating: number | null;
          cars_dot_com_ratings_count: number | null;
          id: number | null;
          kbb_consumer_rating: number | null;
          kbb_consumer_ratings_count: number | null;
          kbb_expert_rating: number | null;
          make: string | null;
          model: string | null;
          trim: string | null;
          year: number | null;
        };
      };
      missing_ratings: {
        Relationships: [];
        Row: {
          cars_dot_com_rating: number | null;
          cars_dot_com_ratings_count: number | null;
          cars_dot_com_url: string | null;
          edmunds_monthly_cost_to_drive_estimate: number | null;
          edmunds_rating: number | null;
          edmunds_ratings_count: number | null;
          edmunds_repair_pal_reliability_rating: number | null;
          edmunds_url: string | null;
          id: number | null;
          kbb_consumer_rating: number | null;
          kbb_consumer_ratings_count: number | null;
          kbb_expert_rating: number | null;
          kbb_url: string | null;
          make: string | null;
          model: string | null;
          trim: string | null;
          year: number | null;
        };
      };
      queue: {
        Relationships: [
          {
            columns: ['model_id'];
            foreignKeyName: 'listings_model_id_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'models';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'listings_model_id_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'finished_ratings';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'listings_model_id_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'missing_ratings';
          },
          {
            columns: ['model_id'];
            foreignKeyName: 'listings_model_id_fkey';
            isOneToOne: false;
            referencedColumns: ['models__id'];
            referencedRelation: 'queue';
          },
          {
            columns: ['ratings__model_id'];
            foreignKeyName: 'ratings_model_id_fkey';
            isOneToOne: true;
            referencedColumns: ['id'];
            referencedRelation: 'models';
          },
          {
            columns: ['ratings__model_id'];
            foreignKeyName: 'ratings_model_id_fkey';
            isOneToOne: true;
            referencedColumns: ['id'];
            referencedRelation: 'finished_ratings';
          },
          {
            columns: ['ratings__model_id'];
            foreignKeyName: 'ratings_model_id_fkey';
            isOneToOne: true;
            referencedColumns: ['id'];
            referencedRelation: 'missing_ratings';
          },
          {
            columns: ['ratings__model_id'];
            foreignKeyName: 'ratings_model_id_fkey';
            isOneToOne: true;
            referencedColumns: ['models__id'];
            referencedRelation: 'queue';
          },
        ];
        Row: {
          back_seat_folds_flat: boolean | null;
          body_type: string | null;
          cars_dot_com_rating: number | null;
          cars_dot_com_ratings_count: number | null;
          concern: string | null;
          concerns: string | null;
          created_at: string | null;
          drivetrain: string | null;
          engine: string | null;
          exterior_color: string | null;
          found_at_url: string | null;
          fuel_type: string | null;
          image_url: string | null;
          interior_color: string | null;
          is_active: boolean | null;
          kbb_consumer_rating: number | null;
          kbb_consumer_ratings_count: number | null;
          kbb_expert_rating: number | null;
          listing_url: string | null;
          location: string | null;
          lowercase_hash: string | null;
          make: string | null;
          mileage: number | null;
          model: string | null;
          model_id: number | null;
          models__created_at: string | null;
          models__id: number | null;
          models__note: string | null;
          note: string | null;
          notes_from_test_drives: string | null;
          number_of_owners: number | null;
          price_approx: number | null;
          priority: number | null;
          ratings__created_at: string | null;
          ratings__id: number | null;
          ratings__model_id: number | null;
          safety_rating: number | null;
          transmission: string | null;
          trim: string | null;
          vin: string | null;
          vin_report_url: string | null;
          year: number | null;
        };
      };
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
