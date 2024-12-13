import i18next from 'i18next';
import fs from 'fs';
import path from 'path'

// Define a function to manually load a translation file
function loadTranslation(language: string): Record<string, any> {
    const filePath = path.resolve(`build/locales/${language}.json`);

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
    return {}; // Return an empty object if the file does not exist
  }

// Load translations for each language and namespace
const enTranslations = loadTranslation('en');
const esTranslations = loadTranslation('es');
const frTranslations = loadTranslation('fr');
const ptTranslations = loadTranslation('pt');

// Initialize i18next with manually loaded resources
i18next.init({
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  resources: {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
    fr: { translation: frTranslations },
    pt: { translation: ptTranslations }
  },
});

export default i18next;
