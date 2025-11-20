'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';
import { useSettingsStore, useInstancesStore } from '@/lib/store';
import logger from '@/lib/logger';

function SettingsPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const router = useRouter();

  const { instanceSettings, isLoading, error, fetchSettings, updateSettings, deleteInstance } = useSettingsStore();
  const { clearSelectedInstance } = useInstancesStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (selectedInstance?.id) {
      fetchSettings(selectedInstance.id).catch(err => {
        logger.error('Failed to fetch settings:', err);
      });
    }
  }, [selectedInstance?.id]);

  useEffect(() => {
    if (instanceSettings?.user_count) {
      setUserCount(instanceSettings.user_count);
    }
  }, [instanceSettings]);

  const handleUserCountChange = async (newCount) => {
    const oldCount = userCount;
    
    if (newCount === oldCount) return;

    const confirmed = window.confirm(
      `Changing the number of users from ${oldCount} to ${newCount} will affect your pricing. Do you wish to continue?`
    );

    if (confirmed) {
      setUserCount(newCount);
      const result = await updateSettings(selectedInstance.id, { user_count: newCount });
      
      if (!result.success) {
        setUserCount(oldCount); // Revert on error
        alert(`Failed to update user count: ${result.error}`);
      }
    }
  };

  const handleDeleteInstance = async () => {
    if (deleteConfirmText !== selectedInstance.name) {
      alert('Instance name does not match. Please type the exact instance name to confirm deletion.');
      return;
    }

    const result = await deleteInstance(selectedInstance.id);

    if (result.success) {
      clearSelectedInstance();
      setShowDeleteModal(false);
      router.push('/dashboard');
    } else {
      alert(`Failed to delete instance: ${result.error}`);
    }
  };

  return (
    <div>
      <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex mt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
            <div className="p-6">

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Settings Sections */}
              <div className="space-y-6">
                {/* General Settings */}
                <div className="rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                    General Settings
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Instance Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                        Instance Name
                      </label>
                      <input
                        type="text"
                        value={selectedInstance.name}
                        disabled
                        className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300 opacity-60 cursor-not-allowed"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-color)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                    </div>

                    {/* Version */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                        Odoo Version
                      </label>
                      <input
                        type="text"
                        value={selectedInstance.version || 'N/A'}
                        disabled
                        className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300 opacity-60 cursor-not-allowed"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-color)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                    </div>

                    {/* User Count */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                        Number of Users
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleUserCountChange(Math.max(1, userCount - 1))}
                          disabled={isLoading || userCount <= 1}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={userCount}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 1;
                            if (newValue >= 1 && newValue <= 1000) {
                              handleUserCountChange(newValue);
                            }
                          }}
                          min="1"
                          max="1000"
                          className="w-24 px-4 py-2 rounded-lg outline-none text-center transition-colors duration-300"
                          style={{
                            backgroundColor: 'var(--input-bg)',
                            color: 'var(--text-color)',
                            border: '1px solid var(--border-color)',
                          }}
                        />
                        <button
                          onClick={() => handleUserCountChange(userCount + 1)}
                          disabled={isLoading || userCount >= 1000}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                        >
                          +
                        </button>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          (Affects pricing)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instance Information */}
                <div className="rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                    Instance Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}>
                      <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Status</div>
                      <div className="font-semibold" style={{ color: 'var(--text-color)' }}>
                        {selectedInstance.status || 'Unknown'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}>
                      <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Deployed</div>
                      <div className="font-semibold" style={{ color: 'var(--text-color)' }}>
                        {selectedInstance.deployed || 'N/A'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}>
                      <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>CPU Request</div>
                      <div className="font-semibold" style={{ color: 'var(--text-color)' }}>
                        {selectedInstance.cpuRequest || 'N/A'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}>
                      <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Memory</div>
                      <div className="font-semibold" style={{ color: 'var(--text-color)' }}>
                        {selectedInstance.memoryRequest || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-md text-sm p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)', border: '2px solid var(--error-color)' }}>
                  <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--error-color)' }}>
                    Danger Zone
                  </h2>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Once you delete an instance, there is no going back. Please be certain.
                  </p>
                  
                  <button
  onClick={() => setShowDeleteModal(true)}
  className="cursor-pointer text-sm px-6 py-3 rounded-md font-normal transition-all duration-300 bg-[var(--error-color)] text-white hover:bg-[#b71c1c]"
>
  Delete Instance
</button>

                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg p-6 max-w-md w-full transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)' }}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--error-color)20' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--text-color)' }}>
              Delete Instance
            </h3>
            <p className="text-sm mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete <strong>{selectedInstance.name}</strong>? This action cannot be undone.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                Type <strong>{selectedInstance.name}</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Instance name"
                className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                }}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInstance}
                disabled={deleteConfirmText !== selectedInstance.name || isLoading}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--error-color)', color: '#ffffff' }}
              >
                {isLoading ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withInstanceGuard(SettingsPage);
