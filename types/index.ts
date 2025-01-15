// Auth Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Story Types
export interface Story {
  id: string;
  title: string;
  content: string;
  theme: string;
  child_id: string;
  created_at: string;
}

// Child Types
export interface Child {
  id: string;
  name: string;
  age: number;
  gender: 'menino' | 'menina';
  user_id: string;
  created_at: string;
}

// Form Types
export interface StoryFormData {
  childId: string;
  childName: string;
  childAge: number;
  childGender: 'menino' | 'menina';
  storyTheme: string;
  additionalDetails: string;
}
