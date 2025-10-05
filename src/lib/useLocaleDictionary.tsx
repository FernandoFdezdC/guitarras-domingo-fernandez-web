import es from '../locales/es.json';
import en from '../locales/en.json';
import { useMemo } from 'react';

// 1. Inferimos el tipo de las traducciones desde 'es.json'
type TranslationData = typeof es;

// 2. Definimos los idiomas válidos
type AvailableLanguages = 'es' | 'en';

// 3. Mapeamos cada idioma a su JSON
const translations: Record<AvailableLanguages, TranslationData> = {
  es,
  en,
};

/**
 * useLocaleDictionary: hook para obtener las traducciones según el lang actual.
 */
export function useLocaleDictionary(lang: string): TranslationData {
  // Fallback a 'es' si no es 'en' o 'es'
  const safeLang: AvailableLanguages = (lang === 'en' || lang === 'es') ? lang : 'es';

  // useMemo para no recalcular en cada render
  const t = useMemo(() => {
    return translations[safeLang];
  }, [safeLang]);

  return t;
}