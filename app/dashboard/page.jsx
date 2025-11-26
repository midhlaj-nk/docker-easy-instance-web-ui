'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import InstanceCard from '../components/InstanceCard';
import InstanceTable from '../components/InstanceTable';
import AuthGuard from '../components/AuthGuard';
import { useAuthStore, useInstancesStore } from '@/lib/store';
import logger from '@/lib/logger';


function DashboardContent() {
  const [viewMode, setViewMode] = useState('grid');
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const { user } = useAuthStore();
  const { instances, overviewData, fetchInstances, getInstancesOverview, isLoading, error } = useInstancesStore();
  const router = useRouter();

  // Fetch instances and overview data when component mounts, and set up polling for overview data
  useEffect(() => {
    fetchInstances();
    getInstancesOverview();

    // Set up polling for overview data every 30 seconds
    const interval = setInterval(() => {
      getInstancesOverview();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchInstances, getInstancesOverview]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard-theme">
      <div className="bg-[var(--background)] transition-colors duration-300 min-h-screen font-sans">
        <Navbar />

        <div className="pt-16">
          <main className="w-full max-w-7xl mx-auto pt-12 px-6 pb-12 transition-all duration-300">
            <div className="animate-fade-in">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                <div>
                  <h1 className="text-4xl font-bold text-[var(--text-color)] tracking-tight">
                    {getGreeting()}, {user?.name || "User"}
                  </h1>
                  <div className="flex items-center mt-2 space-x-2 text-[var(--text-secondary)]">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success-color)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--success-color)]"></span>
                    </span>
                    <p className="text-sm font-medium">System Operational</p>
                    <span className="text-xs opacity-50">•</span>
                    <p className="text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[var(--background-secondary)] p-1 rounded-lg border border-[var(--border-color)] shadow-sm">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all ${viewMode === "grid"
                        ? "bg-[var(--input-bg)] text-[var(--primary-color)] shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-color)]"
                        }`}
                      aria-label="Grid view"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-all ${viewMode === "list"
                        ? "bg-[var(--input-bg)] text-[var(--primary-color)] shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-color)]"
                        }`}
                      aria-label="List view"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => router.push("/deploy")}
                    className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-medium">New Instance</span>
                  </button>
                </div>
              </div>

              {/* Content Area */}
              {isLoading && instances.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 animate-pulse">
                  <div className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-[var(--text-secondary)] font-medium">Loading your instances...</p>
                </div>
              ) : error ? (
                <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center dark:bg-red-900/10 dark:border-red-900/30">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-3 dark:bg-red-900/30">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-1">Failed to load instances</h3>
                  <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                  <button
                    onClick={() => { fetchInstances(); getInstancesOverview(); }}
                    className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm shadow-sm dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30"
                  >
                    Try Again
                  </button>
                </div>
              ) : instances.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center border-dashed border-2 border-[var(--border-color)]">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--input-bg)] text-[var(--text-secondary)] mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">No Instances Found</h3>
                  <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                    You haven't deployed any Odoo instances yet. Create your first instance to get started.
                  </p>
                  <button
                    onClick={() => router.push("/deploy")}
                    className="btn-primary"
                  >
                    Create Instance
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {instances.map((instance) => (
                    <InstanceCard
                      key={instance.id}
                      {...instance}
                      overviewData={overviewData[instance.id] || instance}
                    />
                  ))}
                </div>
              ) : (
                <InstanceTable
                  instances={instances}
                  overviewData={overviewData}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}


