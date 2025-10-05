import es from '../locales/es.json';
import en from '../locales/en.json';
import { useMemo } from 'react';

// 1. Infer the type of the translations from 'es.json'
type TranslationData = typeof es;

// 2. Define the valid languages
type AvailableLanguages = 'es' | 'en';

// 3. Map each language to its JSON
const translations: Record<AvailableLanguages, TranslationData> = {
  es,
  en,
};

/**
 * useLocaleDictionary: hook to get translations according to the current lang.
 */
export function useLocaleDictionary(lang: string): TranslationData {
  // Fallback to 'es' if not 'en' or 'es'
  const safeLang: AvailableLanguages = (lang === 'en' || lang === 'es') ? lang : 'es';

  // useMemo to avoid recalculating on each render
  const t = useMemo(() => {
    return translations[safeLang];
  }, [safeLang]);

  return t;
}