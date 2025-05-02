import { useState, useEffect } from 'react';

interface UseOfflineDetectionResult {
  isOffline: boolean;
  lastOnline: Date | null;
  checkConnection: () => boolean;
}

/**
 * Hook to detect and track offline status
 */
const useOfflineDetection = (): UseOfflineDetectionResult => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastOnline, setLastOnline] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  );

  const handleOnline = () => {
    setIsOffline(false);
    setLastOnline(new Date());
  };

  const handleOffline = () => {
    setIsOffline(true);
  };

  // Check current connection status
  const checkConnection = (): boolean => {
    const online = navigator.onLine;
    setIsOffline(!online);
    if (online) {
      setLastOnline(new Date());
    }
    return online;
  };

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Periodic connection check
  useEffect(() => {
    const interval = setInterval(() => {
      checkConnection();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    isOffline,
    lastOnline,
    checkConnection
  };
};

export default useOfflineDetection;