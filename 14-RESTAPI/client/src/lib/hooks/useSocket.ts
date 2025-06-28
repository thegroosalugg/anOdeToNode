import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@/lib/util/fetchData';
import Logger, { LogConfig } from '@/models/Logger';

export function useSocket(config: LogConfig) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(BASE_URL);
    const logger = new Logger(config);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        logger.disconnect();
      }
    };
  }, [config]);

  return socketRef;
}
