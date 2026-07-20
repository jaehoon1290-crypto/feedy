import { useEffect } from 'react';
export function useRealtimeRefresh(refresh: () => void | Promise<void>, intervalMs = 8_000) { useEffect(() => { const id = window.setInterval(() => void refresh(), intervalMs); return () => window.clearInterval(id); }, [refresh, intervalMs]); }
