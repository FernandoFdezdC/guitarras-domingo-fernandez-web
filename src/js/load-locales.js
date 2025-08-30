// js/load-locales.js
export async function loadLocales(lang) {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const texts = await response.json();
    return texts;
}