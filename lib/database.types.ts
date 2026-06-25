// Types de la base Supabase.
// Écrits à la main pour l'étape 2 — à régénérer via le MCP Supabase
// (ou `supabase gen types typescript`) une fois la migration appliquée.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          birth_date: string | null;
          parental_consent: boolean;
          parent_email: string | null;
          stripe_customer_id: string | null;
          subscription_status: SubscriptionStatus;
          subscription_id: string | null;
          trial_ends_at: string | null;
          current_period_end: string | null;
          generations_used_trial: number;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          birth_date?: string | null;
          parental_consent?: boolean;
          parent_email?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: SubscriptionStatus;
          subscription_id?: string | null;
          trial_ends_at?: string | null;
          current_period_end?: string | null;
          generations_used_trial?: number;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          birth_date?: string | null;
          parental_consent?: boolean;
          parent_email?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: SubscriptionStatus;
          subscription_id?: string | null;
          trial_ends_at?: string | null;
          current_period_end?: string | null;
          generations_used_trial?: number;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          source_image_url: string | null;
          reference_image_url: string | null;
          prompt: string | null;
          result_image_url: string | null;
          status: GenerationStatus;
          moderation_passed: boolean | null;
          model_used: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_image_url?: string | null;
          reference_image_url?: string | null;
          prompt?: string | null;
          result_image_url?: string | null;
          status?: GenerationStatus;
          moderation_passed?: boolean | null;
          model_used?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_image_url?: string | null;
          reference_image_url?: string | null;
          prompt?: string | null;
          result_image_url?: string | null;
          status?: GenerationStatus;
          moderation_passed?: boolean | null;
          model_used?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      moderation_logs: {
        Row: {
          id: string;
          user_id: string | null;
          generation_id: string | null;
          type: ModerationType;
          passed: boolean;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          generation_id?: string | null;
          type: ModerationType;
          passed: boolean;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          generation_id?: string | null;
          type?: ModerationType;
          passed?: boolean;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Raccourcis pratiques
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Generation = Database["public"]["Tables"]["generations"]["Row"];
export type ModerationLog = Database["public"]["Tables"]["moderation_logs"]["Row"];
