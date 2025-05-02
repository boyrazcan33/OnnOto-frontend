import React from 'react';
import { useTranslation } from 'react-i18next';
import useLanguage from '../../hooks/useLanguage';
import Card from '../common/Card';

interface LanguageSelectorProps {
  onSelect?: (language: string) => void;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onSelect,
  className = ''
}) => {
  const { t } = useTranslation();
  const { language, setLanguage, supportedLanguages } = useLanguage();

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    onSelect?.(lang);
  };

  return (
    <Card className={`language-selector ${className}`}>
      <h2 className="language-selector__title">
        {t('settings.selectLanguage')}
      </h2>
      
      <div className="language-selector__options">
        {supportedLanguages.map(lang => (
          <button
            key={lang}
            className={`language-selector__option ${lang === language ? 'language-selector__option--active' : ''}`}
            onClick={() => handleLanguageSelect(lang)}
          >
            <div className="language-selector__option-content">
              <span className="language-selector__language-name">
                {lang === 'et' ? 'Eesti' : lang === 'en' ? 'English' : 'Русский'}
              </span>
              <span className="language-selector__language-native">
                {lang === 'et' ? 'Estonian' : lang === 'en' ? 'English' : 'Russian'}
              </span>
            </div>
            
            {lang === language && (
              <span className="language-selector__check">✓</span>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default LanguageSelector;