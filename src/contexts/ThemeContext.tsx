import React, { createContext } from 'react';

type ThemeType = 'light';

interface ThemeContextType {
  theme: ThemeType;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always light theme
  document.documentElement.setAttribute('data-theme', 'light');
  document.body.classList.add('light-theme');
  document.body.classList.remove('dark-theme');

  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};