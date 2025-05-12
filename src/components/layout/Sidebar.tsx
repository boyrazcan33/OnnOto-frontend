import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      <div 
        className={`sidebar__overlay ${isOpen ? 'sidebar__overlay--visible' : ''}`}
        onClick={onClose}
      />
      
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">OnnOto</div>
          <button 
            className="sidebar__close-button" 
            onClick={onClose}
            aria-label={t('common.close')}
          >
            &times;
          </button>
        </div>
        
        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            <li className="sidebar__nav-item">
              <Link 
                to="/" 
                className={`sidebar__nav-link ${isActive('/') ? 'sidebar__nav-link--active' : ''}`}
                onClick={onClose}
              >
                {t('navigation.home')}
              </Link>
            </li>
            <li className="sidebar__nav-item">
              <Link 
                to="/map" 
                className={`sidebar__nav-link ${isActive('/map') ? 'sidebar__nav-link--active' : ''}`}
                onClick={onClose}
              >
                {t('navigation.map')}
              </Link>
            </li>
            <li className="sidebar__nav-item">
              <Link 
                to="/reliability" 
                className={`sidebar__nav-link ${isActive('/reliability') ? 'sidebar__nav-link--active' : ''}`}
                onClick={onClose}
              >
                {t('navigation.reliability')}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar__footer">
          <p className="sidebar__footer-text">
            {isAuthenticated 
              ? t('sidebar.deviceConnected') 
              : t('sidebar.deviceNotConnected')
            }
          </p>
          <button className="sidebar__footer-button">
            {t('sidebar.refreshConnection')}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;