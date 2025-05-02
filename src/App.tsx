import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import setupDeviceAuthInterceptor from './api/deviceAuthInterceptor';
import routes from './routes';
import store from './store';

const App: React.FC = () => {
  // Set up authentication interceptor
  useEffect(() => {
    setupDeviceAuthInterceptor();
  }, []);

  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <div className="app">
              <Routes>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  );
};

export default App;