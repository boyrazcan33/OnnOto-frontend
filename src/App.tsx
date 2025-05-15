// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext'; 
import setupDeviceAuthInterceptor from './api/deviceAuthInterceptor';
import routes from './routes';
import store from './store';
import { offlineService } from './services/offlineService';
import OfflineNotification from './components/layout/OfflineNotification';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  // Set up authentication interceptor
  useEffect(() => {
    setupDeviceAuthInterceptor();
  }, []);

  // Set up offline detection
  useEffect(() => {
    const checkConnection = () => {
      return navigator.onLine;
    };

    // Initial check
    const isOnline = checkConnection();
    if (!isOnline) {
      console.log('Application started offline');
    }

    // Listen for connection changes
    window.addEventListener('online', () => {
      console.log('Connection restored');
    });
    
    window.addEventListener('offline', () => {
      console.log('Connection lost');
    });

    return () => {
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <LocationProvider>
                <div className="app">
                  <OfflineNotification />
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
              </LocationProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;