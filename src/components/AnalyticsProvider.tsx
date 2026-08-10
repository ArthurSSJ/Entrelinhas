'use client';

import { useEffect, useRef } from 'react';
import { trackLandingView, trackExitIntentShown } from '@/lib/analytics';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const hasTrackedLanding = useRef(false);
  const hasTrackedExitIntent = useRef(false);

  useEffect(() => {
    // 1. Rastrear Landing View automaticamente no carregamento inicial
    if (!hasTrackedLanding.current) {
      hasTrackedLanding.current = true;
      trackLandingView({
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
      });
    }

    // 2. Rastrear Exit Intent se o mouse mover para fora do topo da tela no desktop
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTrackedExitIntent.current) {
        hasTrackedExitIntent.current = true;
        trackExitIntentShown('landing_page');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <>{children}</>;
}
