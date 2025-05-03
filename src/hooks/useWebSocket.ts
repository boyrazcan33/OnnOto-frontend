// src/hooks/useWebSocket.ts
import { useState, useEffect } from 'react';

export const useWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = (event) => {
      setError(new Error('WebSocket error'));
      setIsConnected(false);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [url]);

  return { ws, isConnected, error };
};