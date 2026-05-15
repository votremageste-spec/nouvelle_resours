import { ru } from './ru';
import { tt } from './tt';

export const translations = {
  ru,
  tt
};

export type Language = 'ru' | 'tt';
export type TranslationType = typeof ru;
