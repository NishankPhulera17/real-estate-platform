'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'SITE_ENTER', path: pathname })
    }).catch(() => {});
  }, [pathname]);

  return null;
}
