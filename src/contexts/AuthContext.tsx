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

  // Initialize authentication state
  useEffect(() => {
    refreshDeviceId();
  }, []);

  const refreshDeviceId = () => {
    const id = getDeviceId();
    setDeviceId(id);
    setIsAuthenticated(!!id);
  };

  return (
    <AuthContext.Provider value={{ deviceId, isAuthenticated, refreshDeviceId }}>
      {children}
    </AuthContext.Provider>
  );
};