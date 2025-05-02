import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useTheme from '../../hooks/useTheme';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <button 
            className="header__menu-button" 
            onClick={onMenuClick}
            aria-label={t('navigation.menu')}
          >
            ☰
          </button>
          <Link to="/" className="header__logo">
            <span className="header__logo-text">OnnOto</span>
          </Link>
        </div>
        
        <nav className="header__nav">
          <ul className="header__nav-list">
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
            <li className="header__nav-item">
              <Link 
                to="/settings" 
                className={`header__nav-link ${isActive('/settings') ? 'header__nav-link--active' : ''}`}
              >
                {t('navigation.settings')}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="header__right">
          <button 
            className="header__theme-toggle" 
            onClick={toggleTheme}
            aria-label={t('settings.toggleTheme')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;