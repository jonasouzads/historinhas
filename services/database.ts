import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase';

const supabase = createClientComponentClient<Database>();

type Child = Database['public']['Tables']['children']['Row'];
type Story = Database['public']['Tables']['stories']['Row'];

// Funções para gerenciar crianças
export async function getChildren(userId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createChild(childData: {
  user_id: string;
  name: string;
  age: number;
  gender: 'menino' | 'menina';
}): Promise<Child> {
  const { data, error } = await supabase
    .from('children')
    .insert([childData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChild(childId: string): Promise<void> {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId);

  if (error) throw error;
}

// Funções para gerenciar histórias
export async function getStories(userId: string) {
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      children (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createStory(storyData: {
  child_id: string;
  title: string;
  content: string;
  theme: string;
  mood?: string;
  values?: string[];
  additional_details?: string;
}) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('stories')
    .insert([{ ...storyData, user_id: user.id }])
    .select('*, children(*)')
    .single();

  if (error) throw error;
  return { data, error };
}

export async function getStory(storyId: string) {
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      children (*)
    `)
    .eq('id', storyId)
    .single();

  if (error) throw error;
  return data;
}
