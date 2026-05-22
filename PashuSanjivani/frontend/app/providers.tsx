'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import I18nProvider from './i18n-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  }, [setToken]);

  return <I18nProvider>{children}</I18nProvider>;
}
