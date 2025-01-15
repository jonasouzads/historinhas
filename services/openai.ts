import OpenAI from 'openai';

export interface StoryParams {
  childId: string;
  childName: string;
  childAge: number;
  childGender: 'menino' | 'menina';
  storyTheme: string;
  storyMood?: string;
  storyValues?: string[];
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao gerar história');
    }

    const data = await response.json();
    return data.story;
  } catch (error) {
    console.error('Erro ao gerar história:', error);
    throw new Error('Não foi possível gerar a história. Por favor, tente novamente.');
  }
}
