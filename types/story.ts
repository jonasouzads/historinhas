export interface StoryRequest {
  childName: string;
  childAge: number;
  childGender: 'menino' | 'menina';
  storyTheme: string;
  storyMood?: string;
  storyValues?: string[];
  additionalDetails?: string;
}

export interface Story {
  title: string;
  content: string;
}

export interface StoryResponse {
  story: Story;
  error?: string;
}
