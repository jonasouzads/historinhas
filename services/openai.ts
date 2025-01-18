import { Gender } from '@/lib/supabase';

interface StoryParams {
  childName: string;
  childAge: number;
  childGender: Gender;
  theme: string;
  mood?: string;
  values?: string[];
  additionalDetails?: string;
}

export async function generateStoryWithAI(params: StoryParams) {
  try {
    const response = await fetch('/api/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao gerar história');
    }

    return data.story;
  } catch (error) {
    console.error('Erro ao gerar história:', error);
    throw new Error('Não foi possível gerar a história. Por favor, tente novamente.');
  }
}
