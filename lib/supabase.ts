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

export interface Database {
  public: {
    Tables: {
      children: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number;
          gender: 'menino' | 'menina';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          age: number;
          gender: 'menino' | 'menina';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          gender?: 'menino' | 'menina';
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
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'free' | 'basic' | 'premium';
          status: 'active' | 'inactive' | 'cancelled';
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type: 'free' | 'basic' | 'premium';
          status: 'active' | 'inactive' | 'cancelled';
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_type?: 'free' | 'basic' | 'premium';
          status?: 'active' | 'inactive' | 'cancelled';
          created_at?: string;
          updated_at?: string | null;
        };
      };
      subscription_features: {
        Row: {
          id: string;
          plan_type: 'free' | 'basic' | 'premium';
          feature_name: string;
          feature_value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_type: 'free' | 'basic' | 'premium';
          feature_name: string;
          feature_value: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_type?: 'free' | 'basic' | 'premium';
          feature_name?: string;
          feature_value?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

export type Child = Database['public']['Tables']['children']['Row'];

export type Story = Database['public']['Tables']['stories']['Row'] & {
  children: Child[];
};
