'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, token, initialize, checkTokenValidity } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // Initialize auth state first
      initialize();
      
      // Wait a bit for initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { isAuthenticated: auth, isInitialized: init, token: authToken } = useAuthStore.getState();
      
      if (!init) {
        setIsChecking(false);
        return;
      }
      
      // If no token or not authenticated, redirect to login
      if (!authToken || !auth) {
        router.push('/login');
        return;
      }
      
      // Verify token is still valid by checking with backend
      try {
        const isValid = await checkTokenValidity();
        if (!isValid) {
          // Token is invalid/expired, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return;
        }
      } catch (error) {
        // Error checking token, redirect to login
        console.error('Auth check failed:', error);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }
      
      setIsChecking(false);
    };

    verifyAuth();
  }, [router, initialize, checkTokenValidity]);

  // Show loading while checking
  if (isChecking || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--text-secondary)]">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated || !token) {
    return null;
  }

  // User is authenticated and token is valid
  return <>{children}</>;
}

