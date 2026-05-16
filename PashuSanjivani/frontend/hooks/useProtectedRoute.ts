import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return isLoading;
}
