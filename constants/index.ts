export const STORY_THEMES = [
  'Aventura na Floresta',
  'Viagem Espacial',
  'Fundo do Mar',
  'Mundo dos Dinossauros',
  'Escola de Magia',
  'Circo Mágico',
  'Reino dos Doces',
  'Fazenda Encantada',
] as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  CREATE_STORY: '/criar-historia',
  MY_STORIES: '/minhas-historias',
} as const;

export const API_CONFIG = {
  OPENAI_MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
} as const;
