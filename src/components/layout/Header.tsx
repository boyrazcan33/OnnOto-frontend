// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useTheme from '../../hooks/useTheme';
import useLanguage from '../../hooks/useLanguage';
import useAuth from '../../hooks/useAuth';
import Toast from '../common/Toast';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleConnectionStatus = () => {
    setShowConnectionStatus(true);
    setTimeout(() => {
      setShowConnectionStatus(false);
    }, 3000);
  };
  
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <Link to="/" className="header__logo">
            <img 
              src="/icons/logo.png" 
              alt="OnnOto Logo" 
              className="header__logo-image" 
            />
            <span className="header__logo-text">OnnOto</span>
          </Link>
          
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item">
                <Link 
                  to="/" 
                  className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
                >
                  {t('navigation.home')}
                </Link>
              </li>
              <li className="header__nav-item">
                <Link 
                  to="/map" 
                  className={`header__nav-link ${isActive('/map') ? 'header__nav-link--active' : ''}`}
                >
                  {t('navigation.map')}
                </Link>
              </li>
              <li className="header__nav-item">
                <Link 
                  to="/reliability" 
                  className={`header__nav-link ${isActive('/reliability') ? 'header__nav-link--active' : ''}`}
                >
                  {t('navigation.reliability')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="header__right">
          <div className="header__language-selector">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label={t('settings.language')}
              className="header__language-select"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'et' ? 'Eesti' : lang === 'en' ? 'English' : 'Русский'}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="header__connection-status"
            onClick={handleConnectionStatus}
            title={isAuthenticated ? t('sidebar.deviceConnected') : t('sidebar.deviceNotConnected')}
          >
            <div className={`header__connection-indicator ${isAuthenticated ? 'header__connection-indicator--connected' : 'header__connection-indicator--disconnected'}`}></div>
          </button>
          
          <button 
            className="header__theme-toggle" 
            onClick={toggleTheme}
            aria-label={t('settings.toggleTheme')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
      
      {showConnectionStatus && (
        <Toast
          message={isAuthenticated ? t('sidebar.deviceConnected') : t('sidebar.deviceNotConnected')}
          type={isAuthenticated ? 'success' : 'warning'}
          position="top-right"
          onClose={() => setShowConnectionStatus(false)}
        />
      )}
    </header>
  );
};

export default Header;