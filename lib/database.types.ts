// Types de la base Supabase.
// Généré via le MCP Supabase (generate_typescript_types) — régénérer après toute migration.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      generations: {
        Row: {
          created_at: string;
          id: string;
          model_used: string | null;
          moderation_passed: boolean | null;
          prompt: string | null;
          reference_image_url: string | null;
          result_image_url: string | null;
          source_image_url: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          model_used?: string | null;
          moderation_passed?: boolean | null;
          prompt?: string | null;
          reference_image_url?: string | null;
          result_image_url?: string | null;
          source_image_url?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          model_used?: string | null;
          moderation_passed?: boolean | null;
          prompt?: string | null;
          reference_image_url?: string | null;
          result_image_url?: string | null;
          source_image_url?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      moderation_logs: {
        Row: {
          created_at: string;
          generation_id: string | null;
          id: string;
          passed: boolean;
          reason: string | null;
          type: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          generation_id?: string | null;
          id?: string;
          passed: boolean;
          reason?: string | null;
          type: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          generation_id?: string | null;
          id?: string;
          passed?: boolean;
          reason?: string | null;
          type?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "moderation_logs_generation_id_fkey";
            columns: ["generation_id"];
            isOneToOne: false;
            referencedRelation: "generations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "moderation_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          birth_date: string | null;
          created_at: string;
          current_period_end: string | null;
          email: string | null;
          generations_used_trial: number;
          id: string;
          is_admin: boolean;
          parent_email: string | null;
          parental_consent: boolean;
          stripe_customer_id: string | null;
          subscription_id: string | null;
          subscription_status: string;
          trial_ends_at: string | null;
          updated_at: string;
        };
        Insert: {
          birth_date?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          email?: string | null;
          generations_used_trial?: number;
          id: string;
          is_admin?: boolean;
          parent_email?: string | null;
          parental_consent?: boolean;
          stripe_customer_id?: string | null;
          subscription_id?: string | null;
          subscription_status?: string;
          trial_ends_at?: string | null;
          updated_at?: string;
        };
        Update: {
          birth_date?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          email?: string | null;
          generations_used_trial?: number;
          id?: string;
          is_admin?: boolean;
          parent_email?: string | null;
          parental_consent?: boolean;
          stripe_customer_id?: string | null;
          subscription_id?: string | null;
          subscription_status?: string;
          trial_ends_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_expired_source_images: { Args: never; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ─────────────────────────────────────────────
//  Raccourcis & unions applicatives (miroir des CHECK constraints)
// ─────────────────────────────────────────────
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Generation = Database["public"]["Tables"]["generations"]["Row"];
export type ModerationLog = Database["public"]["Tables"]["moderation_logs"]["Row"];

export type SubscriptionStatus =
  | "free"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "lifetime";

export type GenerationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "blocked";

export type ModerationType = "prompt" | "source_image" | "result_image";
