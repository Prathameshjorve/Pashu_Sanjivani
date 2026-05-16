import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, setUser, setToken, logout } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, [setToken]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    setUser,
    setToken,
    logout,
  };
}
