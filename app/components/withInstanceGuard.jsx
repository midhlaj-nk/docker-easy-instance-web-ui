'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInstancesStore } from '@/lib/store';

/**
 * Higher-Order Component to protect instance-specific pages
 * Redirects to dashboard if no instance is selected
 */
export default function withInstanceGuard(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const selectedInstance = useInstancesStore((state) => state.selectedInstance);
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
      // Check if we're in the browser and store has hydrated
      if (typeof window !== 'undefined') {
        // Small delay to ensure localStorage has been read
        const timer = setTimeout(() => {
          setHasHydrated(true);
        }, 50);

        return () => clearTimeout(timer);
      }
    }, []);

    useEffect(() => {
      // Only redirect after hydration is complete
      if (hasHydrated && !selectedInstance) {
        console.log('No selected instance, redirecting to dashboard');
        router.push('/dashboard');
      }
    }, [hasHydrated, selectedInstance, router]);

    // Show loading while hydrating
    if (!hasHydrated) {
      return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-color)' }}></div>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          </div>
        </div>
      );
    }

    // Show loading while redirecting if no instance
    if (!selectedInstance) {
      return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
          <div className="text-center">
            <p style={{ color: 'var(--text-secondary)' }}>Redirecting to dashboard...</p>
          </div>
        </div>
      );
    }

    // Render the protected component with selectedInstance
    return <Component {...props} selectedInstance={selectedInstance} />;
  };
}

