import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'de',
    supportedLngs: ['de', 'en'],
    defaultNS: 'common',
    load: 'currentOnly',

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['path', 'cookie', 'navigator'],
      lookupCookie: 'i18next',
      lookupFromPathIndex: 0,
      caches: ['cookie'],
      cookieOptions: {
        path: '/',
        secure: true,
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60 // 1 year
      }
    },

    react: {
      useSuspense: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;