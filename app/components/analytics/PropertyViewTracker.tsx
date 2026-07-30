'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PropertyViewTracker({ propertyId }: { propertyId?: string }) {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const lastHeartbeatRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!propertyId) return;

    startTimeRef.current = Date.now();
    lastHeartbeatRef.current = Date.now();

    // 1. Initial property view tracking
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'PROPERTY_VIEW', path: pathname, propertyId })
    }).catch(() => {});

    // 2. Heartbeat timer every 30 seconds of active viewing
    const intervalId = setInterval(() => {
      const now = Date.now();
      const durationSeconds = Math.round((now - lastHeartbeatRef.current) / 1000);
      lastHeartbeatRef.current = now;

      if (durationSeconds >= 5) {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'TIME_SPENT',
            path: pathname,
            propertyId,
            metadata: { durationSeconds, type: 'heartbeat' }
          })
        }).catch(() => {});
      }
    }, 30000);

    // 3. Exit tracking when leaving the property page or closing tab
    const sendExitTelemetry = () => {
      const now = Date.now();
      const remainingSeconds = Math.round((now - lastHeartbeatRef.current) / 1000);
      if (remainingSeconds >= 3 && propertyId) {
        const payload = JSON.stringify({
          eventType: 'TIME_SPENT',
          path: pathname,
          propertyId,
          metadata: { durationSeconds: remainingSeconds, type: 'exit' }
        });

        // Use keepalive fetch or sendBeacon to ensure delivery during page navigation
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/track', blob);
        } else {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('beforeunload', sendExitTelemetry);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', sendExitTelemetry);
      sendExitTelemetry();
    };
  }, [propertyId, pathname]);

  return null;
}

