// src/hooks/useRealtimeService.ts
import { useEffect, useState } from 'react';
import { realtimeService } from '../services/realtimeService';

export const useRealtimeService = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize connection status
    setIsConnected(true);
    
    return () => {
      // Cleanup
      setIsConnected(false);
    };
  }, []);

  return {
    isConnected,
    subscribe: realtimeService.subscribe.bind(realtimeService)
  };
};