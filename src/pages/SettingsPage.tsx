import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Switch from '../components/common/Switch';
import Button from '../components/common/Button';
import useTheme from '../hooks/useTheme';
import useLanguage from '../hooks/useLanguage';
import useAuth from '../hooks/useAuth';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { deviceId, isAuthenticated, refreshDeviceId } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSaveSettings = () => {
    if (isDarkMode !== (theme === 'dark')) {
      setTheme(isDarkMode ? 'dark' : 'light');
    }
    
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
    }
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <MainLayout>
      <div className="settings-page">
        <h1 className="settings-page__title">{t('settings.title')}</h1>
        
        <Card className="settings-page__card">
          <h2 className="settings-page__section-title">{t('settings.appearance')}</h2>
          
          <div className="settings-page__option">
            <span className="settings-page__option-label">{t('settings.darkMode')}</span>
            <Switch
              checked={isDarkMode}
              onChange={handleThemeToggle}
              label={isDarkMode ? t('settings.darkModeEnabled') : t('settings.darkModeDisabled')}
            />
          </div>
          
          <div className="settings-page__option">
            <span className="settings-page__option-label">{t('settings.language')}</span>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="settings-page__select"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'et' ? 'Eesti' : lang === 'en' ? 'English' : 'Русский'}
                </option>
              ))}
            </select>
          </div>
        </Card>
        
        <Card className="settings-page__card">
          <h2 className="settings-page__section-title">{t('settings.account')}</h2>
          
          <div className="settings-page__device-info">
            <span className="settings-page__label">{t('settings.deviceId')}:</span>
            <code className="settings-page__device-id">{deviceId || t('settings.noDeviceId')}</code>
          </div>
          
          <div className="settings-page__status">
            {isAuthenticated ? (
              <div className="settings-page__status-connected">
                {t('settings.deviceConnected')}
              </div>
            ) : (
              <div className="settings-page__status-disconnected">
                {t('settings.deviceNotConnected')}
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={refreshDeviceId}
            className="settings-page__refresh-button"
          >
            {t('settings.refreshConnection')}
          </Button>
        </Card>
        
        <div className="settings-page__actions">
          <Button
            variant="primary"
            onClick={handleSaveSettings}
          >
            {t('settings.saveSettings')}
          </Button>
          
          {saveSuccess && (
            <div className="settings-page__success-message">
              {t('settings.settingsSaved')}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;