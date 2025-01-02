// app/i18n/config.ts
import i18n from 'i18next'
import type { InitOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  de: {
    translation: require('../locales/de.json')
  },
  en: {
    translation: require('../locales/en.json')
  },
  tr: {
    translation: require('../locales/tr.json')
  }
}

const config: InitOptions = {
  resources,
  lng: 'de',
  interpolation: {
    escapeValue: false
  },
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  react: {
    useSuspense: false
  }
};

i18n
  .use(initReactI18next)
  .init(config);

// Error Handler für fehlende Übersetzungen
i18n.on('missingKey', (_lngs, _namespace, key) => {
  console.warn(`Missing translation key: ${key}`);
});

export default i18n;
