'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function ProfilePage() {
  const [username, setUsername] = useState('Arun Kumar');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-slate-50 transition-colors duration-300">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex mt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 ps-0 lg:ps-64 h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-[#333]">Profile</h1>
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="cursor-pointer px-8 py-2 text-sm bg-[var(--primary-color)] text-white rounded-sm hover:bg-[#454685] transition duration-300"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="bg-white rounded-lg p-8" style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <div className="flex items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gray-300 mr-6 ring-2 ring-offset-4 ring-[var(--primary-color)]">
                  <img 
                    src="/img/user.png" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">{username}</h2>
                  <p className="text-gray-500 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className='text-[var(--primary-color)]' width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z"/></svg>
                    easyinstance@gmail.com</p>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="text-[#333] text-xs mb-2 font-medium block">
                    Username
                  </label>
                  <input
                    className="w-full text-sm px-3 py-2 border border-[#e5e7eb] rounded-md focus:border-[var(--primary-color)] transition duration-300 outline-0"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                {isEditing && (
                  <>
                    <div className="mb-4">
                      <label className="text-[#333] text-xs mb-2 font-medium block">
                        New Password
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-[#e5e7eb] rounded-md focus:border-[var(--primary-color)] transition duration-300 outline-0"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <label className="text-[#333] text-xs mb-2 font-medium block">
                        Confirm New Password
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-[#e5e7eb] rounded-md focus:border-[var(--primary-color)] transition duration-300 outline-0"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <button className="cursor-pointer text-sm px-8 py-2 bg-[var(--primary-color)] text-white rounded-sm hover:bg-[#454685] transition duration-300">
                      Update Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
