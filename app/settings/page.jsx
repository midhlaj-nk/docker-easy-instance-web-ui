'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';
import { useSettingsStore, useInstancesStore } from '@/lib/store';

function SettingsPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const router = useRouter();

  const { isLoading, deleteInstance } = useSettingsStore();
  const { clearSelectedInstance } = useInstancesStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
              {/* Danger Zone - Instance Deletion */}
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
