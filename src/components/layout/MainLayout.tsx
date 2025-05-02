import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  fullHeight?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  fullHeight = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <div className={`layout ${fullHeight ? 'layout--full-height' : ''}`}>
      {showHeader && <Header onMenuClick={toggleSidebar} />}
      
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="layout__main">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;