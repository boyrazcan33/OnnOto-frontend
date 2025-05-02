import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../contexts/LanguageContext';

/**
 * Hook to access language context and translation functions
 */
const useLanguage = () => {
  const languageContext = useContext(LanguageContext);
  const { t, i18n } = useTranslation();
  
  if (!languageContext) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return {
    ...languageContext,
    t,
    i18n,
  };
};

export default useLanguage;