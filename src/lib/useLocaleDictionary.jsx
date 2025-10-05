import es from '../locales/es.json';
import en from '../locales/en.json';
import { useMemo } from 'react';

// Mapeamos cada idioma a su JSON
const translations = {
  es,
  en,
};

/**
 * useLocaleDictionary: hook para obtener las traducciones según el lang actual.
 */
export function useLocaleDictionary(lang) {
  // Fallback a 'es' si no es 'en' o 'es'
  const safeLang = lang === 'en' || lang === 'es' ? lang : 'es';

  // useMemo para no recalcular en cada render
  const t = useMemo(() => translations[safeLang], [safeLang]);

  return t;
}