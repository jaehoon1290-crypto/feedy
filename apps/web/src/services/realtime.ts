import { useEffect } from 'react';

/** Polling adapter. Replace its implementation with SSE/WebSocket without changing feature screens. */
export function useRealtimeRefresh(refresh: () => void | Promise<void>, intervalMs = 10_000) {
  useEffect(() => { const id = window.setInterval(() => void refresh(), intervalMs); const visible = () => { if (document.visibilityState === 'visible') void refresh(); }; document.addEventListener('visibilitychange', visible); return () => { window.clearInterval(id); document.removeEventListener('visibilitychange', visible); }; }, [refresh, intervalMs]);
}
