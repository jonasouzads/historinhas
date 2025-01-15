export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          updated_at?: string | null;
        };
      };
      children: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          age: number;
          created_at?: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          name: string;
          age: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          name?: string;
          age?: number;
          created_at?: string;
        };
      };
    };
  };
};
