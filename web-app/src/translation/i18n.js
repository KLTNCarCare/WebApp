import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en/translation';
import translationVI from '../locales/vi/translation';

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'vi',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
