import { useState, useEffect, useRef, useCallback } from 'react';

export interface DisasterMessage {
  disasterType: string;
  location: string;
  message: string;
  [key: string]: any;
}

const WS_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000')
  .replace(/\/$/, '')
  .replace(/^http/, 'ws') + '/ws';

export default function useAlertWebSocket() {
  const [disasterMessage, setDisasterMessage] = useState<DisasterMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const clearMessage = useCallback(() => setDisasterMessage(null), []);

  useEffect(() => {
    let ws: WebSocket;
    try {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (data.type === 'disaster') {
            setDisasterMessage({
              disasterType: data.disasterType ?? 'Disaster',
              location: data.location ?? 'unknown',
              message: data.message ?? '',
              ...data,
            });
          }
        } catch { /* ignore */ }
      };
      ws.onerror = () => {};
      ws.onclose = () => { wsRef.current = null; };
    } catch { /* ignore */ }
    return () => { try { wsRef.current?.close(); } catch { /* ignore */ } };
  }, []);

  return { disasterMessage, clearMessage };
}

export { useAlertWebSocket as useDisasterWebSocket };
