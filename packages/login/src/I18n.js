/**
   PRIVATE LICENSE
   */
  
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import Backend from 'i18next-http-backend';
   import LanguageDetector from 'i18next-browser-languagedetector';
   
   const initI18n = _ref => {
     let {
       ns,
       defaultNS,
       ...props
     } = _ref;
     i18n.use(Backend).use(LanguageDetector).use(initReactI18next)
     // init i18next
     // for all options read: https://www.i18next.com/overview/configuration-options
     .init({
       fallbackLng: 'en_US',
       lng: 'en_US',
       ns: ns,
       defaultNS: defaultNS,
       supportedLngs: ['de_DE', 'zh_Hans', 'zh_Hant', 'en_US', 'es_ES', 'fr_FR', 'it_IT', 'ja_JP', 'ko', 'nl_NL', 'pt_BR', 'tr_TR', 'tt_US'],
       debug: true,
       appendNamespaceToMissingKey: true,
       load: 'currentOnly',
       backend: {
         // for all available options read the backend's repository readme file
         loadPath: function (lng, ns) {
           return 'locales/{{lng}}/{{ns}}.json';
         }
       },
       interpolation: {
         escapeValue: false // not needed for react as it escapes by default
       }
     });
   };
   
   export { initI18n as default };
   