import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "loading": "Loading..."
    }
  },
  hi: {
    translation: {
      "welcome": "स्वागत है",
      "loading": "लोड हो रहा है..."
    }
  },
  gu: {
    translation: {
      "welcome": "સ્વાગત છે",
      "loading": "લોડ થઈ રહ્યું છે..."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
