import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__copyright">© {new Date().getFullYear()} OnnOto</p>
        
        <nav className="footer__nav">
          <ul className="footer__nav-list">
            <li className="footer__nav-item">
              <a href="/about" className="footer__nav-link">
                {t('footer.about')}
              </a>
            </li>
            <li className="footer__nav-item">
              <a href="/privacy" className="footer__nav-link">
                {t('footer.privacy')}
              </a>
            </li>
            <li className="footer__nav-item">
              <a href="/terms" className="footer__nav-link">
                {t('footer.terms')}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;