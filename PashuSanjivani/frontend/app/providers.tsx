'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import I18nProvider from './i18n-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const setToken = useAuthStore((state) => state.setToken);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  }, [setToken]);

  if (!isHydrated) {
    return <>{children}</>;
  }

  return <I18nProvider>{children}</I18nProvider>;
}
