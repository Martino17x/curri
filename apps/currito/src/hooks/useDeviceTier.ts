import { useEffect, useState } from 'react';

export type DeviceTier = 'mobile' | 'tablet' | 'desktop';

/** Zoom por defecto según dispositivo (35% / 60% / 80%). */
export const PRESET_ZOOM: Record<DeviceTier, number> = {
  mobile: 0.35,
  tablet: 0.6,
  desktop: 0.8,
};

const MQ_MOBILE = '(max-width: 767px)';
const MQ_TABLET = '(min-width: 768px) and (max-width: 1199px)';

function resolveTier(): DeviceTier {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia(MQ_MOBILE).matches) return 'mobile';
  if (window.matchMedia(MQ_TABLET).matches) return 'tablet';
  return 'desktop';
}

export function useDeviceTier(): { tier: DeviceTier; presetZoom: number; isCompact: boolean } {
  const [tier, setTier] = useState<DeviceTier>(resolveTier);

  useEffect(() => {
    const mobileMq = window.matchMedia(MQ_MOBILE);
    const tabletMq = window.matchMedia(MQ_TABLET);
    const update = () => setTier(resolveTier());
    mobileMq.addEventListener('change', update);
    tabletMq.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      mobileMq.removeEventListener('change', update);
      tabletMq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return {
    tier,
    presetZoom: PRESET_ZOOM[tier],
    isCompact: tier !== 'desktop',
  };
}
