import React, { createContext, useEffect, useState } from 'react';
import { getDeviceId } from '../utils/storageUtils';

interface AuthContextType {
  deviceId: string | null;
  isAuthenticated: boolean;
  refreshDeviceId: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  deviceId: null,
  isAuthenticated: false,
  refreshDeviceId: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Refresh device ID helper function
  const refreshDeviceId = () => {
    const id = getDeviceId();
    setDeviceId(id);
    setIsAuthenticated(!!id);
  };

  // Initialize authentication state and listen for device ID updates
  useEffect(() => {
    // Initial check
    refreshDeviceId();
    
    // Listen for device ID updates from API client
    const handleDeviceIdUpdated = () => {
      refreshDeviceId();
    };
    
    // Add event listener
    window.addEventListener('deviceIdUpdated', handleDeviceIdUpdated);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('deviceIdUpdated', handleDeviceIdUpdated);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ deviceId, isAuthenticated, refreshDeviceId }}>
      {children}
    </AuthContext.Provider>
  );
};