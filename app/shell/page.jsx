'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';

function ShellPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex mt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 lg:pl-[17rem] overflow-hidden overflow-y-auto">
            <div className="p-6">

              {/* Coming Soon Message */}
              <div className="rounded-lg p-8 flex flex-col justify-center items-center text-center transition-colors duration-300 lg:h-[calc(100vh_-_115px)]" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M6 8l4 4-4 4"/>
                  <path d="M12 16h6"/>
                </svg>
                <h2 className="mb-3 mt-5 text-2xl font-bold" style={{ color: 'var(--text-color)' }}>Web Terminal Coming Soon</h2>
                <p className="mb-6 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                  The web-based terminal interface is currently under development. This feature will allow you to access your instance's shell directly from your browser using a fully-featured terminal emulator.
                </p>
                
                <div className="text-left mt-4">
                  <h3 className="font-semibold mb-3 text-center" style={{ color: 'var(--text-color)' }}>Planned Features:</h3>
                  <ul className="space-y-2 text-sm flex gap-5" style={{ color: 'var(--text-secondary)' }}>
                    <li className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="var(--success-color)" /></svg>
                      Full terminal emulation with xterm.js
                    </li>
                    <li className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="var(--success-color)" /></svg>
                      Real-time WebSocket connection
                    </li>
                    <li className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="var(--success-color)" /></svg>
                      Copy/paste support
                    </li>
                    <li className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="var(--success-color)" /></svg>
                      Command history
                    </li>
                    <li className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="var(--success-color)" /></svg>
                      Multiple terminal tabs
                    </li>
                  </ul>
                </div>

                <div className="mt-8 p-4 rounded-lg max-w-md" style={{ backgroundColor: 'var(--primary-color)10', border: '1px solid var(--primary-color)' }}>
                  <p className="text-sm" style={{ color: 'var(--primary-color)' }}>
                    💡 <strong>Temporary Solution:</strong> Use kubectl exec commands or access your instance pod directly through your Kubernetes cluster.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withInstanceGuard(ShellPage);
