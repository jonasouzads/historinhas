import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SubscriptionStatus = 'active' | 'canceled' | 'expired';
export type SubscriptionPlan = 'magic' | 'family';
export type Gender = 'menino' | 'menina';
export type UserRole = 'user' | 'admin';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string | null;
          email: string;
          role: UserRole;
          created_at: string;
          phone: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name?: string | null;
          email: string;
          role?: UserRole;
          created_at?: string;
          phone?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string | null;
          email?: string;
          role?: UserRole;
          created_at?: string;
          phone?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          kiwify_order_id: string | null;
          kiwify_subscription_id: string | null;
          plan_type: SubscriptionPlan;
          status: SubscriptionStatus;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kiwify_order_id?: string | null;
          kiwify_subscription_id?: string | null;
          plan_type: SubscriptionPlan;
          status?: SubscriptionStatus;
          start_date: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kiwify_order_id?: string | null;
          kiwify_subscription_id?: string | null;
          plan_type?: SubscriptionPlan;
          status?: SubscriptionStatus;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      children: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number;
          gender: Gender;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          age: number;
          gender: Gender;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          gender?: Gender;
          created_at?: string;
        };
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          child_id: string;
          title: string;
          content: string;
          theme: string;
          mood?: string;
          values?: string[];
          additional_details?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          child_id: string;
          title: string;
          content: string;
          theme: string;
          mood?: string;
          values?: string[];
          additional_details?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          child_id?: string;
          title?: string;
          content?: string;
          theme?: string;
          mood?: string;
          values?: string[];
          additional_details?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_user_profile: {
        Args: {
          p_user_id: string;
          p_full_name: string;
          p_email: string;
          p_role: UserRole;
        };
        Returns: void;
      };
    };
    Enums: {
      subscription_status: SubscriptionStatus;
      subscription_plan: SubscriptionPlan;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

export type Child = Database['public']['Tables']['children']['Row'];

export type Story = Database['public']['Tables']['stories']['Row'] & {
  children: Child[];
};
