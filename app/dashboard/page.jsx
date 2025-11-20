'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import InstanceCard from '../components/InstanceCard';
import { useAuthStore, useInstancesStore } from '@/lib/store';
import logger from '@/lib/logger';


export default function DashboardPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const { user, isAuthenticated, isInitialized, initialize } = useAuthStore();
  const { instances, overviewData, fetchInstances, getInstancesOverview, isLoading, error } = useInstancesStore();
  const router = useRouter();

  // Initialize auth state on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect to login if not authenticated (only after initialization)
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Fetch instances when component mounts
  useEffect(() => {
    if (!isAuthenticated || hasFetchedData) return;

    let isMounted = true;
    setHasFetchedData(true);

    // Fetch both instances and overview data in parallel
    Promise.all([
      fetchInstances(),
      getInstancesOverview()
    ]).catch(error => {
      if (isMounted) {
        logger.error('Error fetching dashboard data:', error);
        setHasFetchedData(false); // Reset on error to allow retry
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, hasFetchedData, fetchInstances, getInstancesOverview]);

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary-color)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated (after initialization)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary-color)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }




  return (
    <div className='transition-colors duration-300 min-h-screen' style={{ backgroundColor: 'var(--background)' }}>
      <Navbar />

      <div className='flex mt-16 px-6'>
        <main className='flex-1'>
          <div className='py-8'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
              <div>
                <h1 className='text-xl font-bold mb-2' style={{ color: 'var(--text-color)' }}>
                  Good Morning {user?.name || 'Administrator'}
                </h1>

                <div className='flex items-center space-x-2 text-sm' style={{ color: 'var(--text-secondary)' }}>
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
                    />
                  </svg>
                  <span>03-10-2025, 09:24:14</span>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                {/* View Mode Toggle */}
                <div className='flex gap-1 items-center rounded-lg p-1' style={{ backgroundColor: 'var(--input-bg)' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className='p-2 w-12 h-12 flex items-center justify-center rounded transition-colors cursor-pointer'
                    style={{
                      backgroundColor: viewMode === 'grid' ? 'var(--background-secondary)' : 'transparent',
                      color: viewMode === 'grid' ? 'var(--text-color)' : 'var(--text-secondary)'
                    }}
                    aria-label='Grid view'
                  >
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className='p-2 w-12 h-12 flex items-center justify-center rounded transition-colors cursor-pointer'
                    style={{
                      backgroundColor: viewMode === 'list' ? 'var(--background-secondary)' : 'transparent',
                      color: viewMode === 'list' ? 'var(--text-color)' : 'var(--text-secondary)'
                    }}
                    aria-label='List view'
                  >
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6h16M4 12h16M4 18h16'
                      />
                    </svg>
                  </button>
                </div>

                {/* Add New Button */}
                <a
                  href='/deploy'
                  className='px-10 py-3 text-white rounded-full transition duration-300'
                  style={{
                    backgroundColor: 'var(--primary-color)',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
                >
                  Add New
                </a>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary-color)' }}></div>
                  <p style={{ color: 'var(--text-secondary)' }}>Loading instances...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="mb-4" style={{ color: 'var(--error-color)' }}>Error loading instances: {error}</p>
                  <button
                    onClick={() => {
                      setHasFetchedData(false);
                      fetchInstances();
                    }}
                    className="px-4 py-2 text-white rounded transition duration-300"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : instances.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>No instances found</p>
                  <a
                    href="/deploy"
                    className="px-10 py-3 text-white rounded-full transition duration-300"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
                  >
                    Create Your First Instance
                  </a>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${viewMode === 'grid'
                    ? 'grid-cols-1 lg:grid-cols-3'
                    : 'grid-cols-1'
                  }`}
              >
                {instances.map((data, index) => (
                  <InstanceCard
                    key={index}
                    {...data}
                    viewMode={viewMode}
                    overviewData={overviewData[data.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
