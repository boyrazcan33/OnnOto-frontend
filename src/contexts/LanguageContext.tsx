// src/contexts/LanguageContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Define supported languages
const SUPPORTED_LANGUAGES = ['et', 'en', 'ru'];
const DEFAULT_LANGUAGE = process.env.REACT_APP_DEFAULT_LANGUAGE || 'et';

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
      caches: ['localStorage'],
    },
    backend: {
      // Changed the path to match webpack's static asset handling
      loadPath: 'static/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'stations', 'reports', 'errors'],
    defaultNS: 'common',
  });

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(i18n.language || DEFAULT_LANGUAGE);

  // Set language and update i18n
  const setLanguage = (lang: string) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
      setLanguageState(lang);
    }
  };

  // Load default language on mount if not set
  useEffect(() => {
    if (!i18n.language || !SUPPORTED_LANGUAGES.includes(i18n.language)) {
      setLanguage(DEFAULT_LANGUAGE);
    }
  }, []);

  // Update state when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = (lang: string) => {
      setLanguageState(lang);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};