'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';
import { useSettingsStore, useInstancesStore } from '@/lib/store';
import { showWarning, showError } from '@/lib/swal';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

function PackageInstaller({ selectedInstance }) {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const { isLoading } = useSettingsStore();
  const { clearSelectedInstance } = useInstancesStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  /* ================================
     FETCH INSTALLED PACKAGES
  ================================= */
 const fetchPackages = async () => {
  if (!selectedInstance?.id) return;

  setTableLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/api/package/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instance_id: selectedInstance.id }),
    });

    const data = await res.json();
    if (data.success) {
      setPackages(data.data || []);
    } else {
      showError(data.message || 'Failed to load packages');
    }
  } catch (err) {
    showError('Unable to fetch installed packages');
  } finally {
    setTableLoading(false);
  }
};

  /* ================================
     INSTALL PACKAGE
  ================================= */
  const installPackage = async () => {
  if (!packageName.trim()) {
    showWarning('Please enter a package name');
    return;
  }

  setTableLoading(true); // optional, like uninstall

  try {
    const res = await fetch(`${API_BASE_URL}/api/package/install`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        package_name: packageName,
        instance_id: selectedInstance.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setPackageName('');    // clear input
      fetchPackages();       // refresh package list
    } else {
      showError(data.message || 'Install failed');
    }
  } catch (err) {
    showError('Package installation failed');
  } finally {
    setTableLoading(false); // stop loading
  }
};


  /* ================================
     UNINSTALL PACKAGE
  ================================= */
  const uninstallPackage = async (dependencyId) => {
  setTableLoading(true); // optional, if you want loading state
  try {
    const res = await fetch(`${API_BASE_URL}/api/package/uninstall`, {
      method: 'POST', // match backend route
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            dependency_id: dependencyId ,
            instance_id: selectedInstance.id
      }),
    });

    const data = await res.json();
    if (data.success) {
      fetchPackages(); // refresh package list
    } else {
      showError(data.message || 'Uninstall failed');
    }
  } catch (err) {
    showError('Unable to uninstall package');
  } finally {
    setTableLoading(false); // stop loading
  }
};


  useEffect(() => {
    fetchPackages();
  }, [selectedInstance?.id]);

  return (
    <div className="dashboard-theme">
      <div className="bg-[var(--background)] transition-colors duration-300 min-h-screen font-sans">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex pt-16">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1 lg:pl-[18rem] p-6 pr-6 lg:pr-12 overflow-y-auto">
            {/* Package Installation Section */}
            <div className="glass-card p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                  Python Package Manager
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Install and manage Python packages for your environment
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-xl">
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="Enter package name (e.g., requests, pandas, numpy)"
                    className="w-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-[var(--text-secondary)]"
                  />
                </div>

                <button
                  onClick={installPackage}
                  disabled={loading || !packageName.trim()}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Installing...
                    </>
                  ) : (
                    'Install Package'
                  )}
                </button>

                <button
                  onClick={() => setPackageName('')}
                  disabled={!packageName.trim()}
                  className="bg-[var(--card)] border border-[var(--border)] text-[var(--text-primary)] px-6 py-2.5 rounded-md font-medium hover:bg-[var(--hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Installed Packages Section */}
            <div className="glass-card p-6 mt-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  Installed Dependencies
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Manage your currently installed Python packages
                </p>
              </div>

              {tableLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-medium">Loading packages...</span>
                  </div>
                </div>
              ) : packages.length === 0 ? (
                <div className="text-center py-12 bg-[var(--hover)] rounded-lg border-2 border-dashed border-[var(--border)]">
                  <svg className="mx-auto h-12 w-12 text-[var(--text-secondary)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">No packages installed</p>
                  <p className="text-sm text-[var(--text-secondary)]">Get started by installing your first package above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--hover)] transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                            {pkg.package}
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            Python package
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => uninstallPackage(pkg.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        Uninstall
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withInstanceGuard(PackageInstaller);
