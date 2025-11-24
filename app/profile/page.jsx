'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '@/lib/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { user, token, setUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok && data.data?.user) {
        const userData = data.data.user;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          confirmPassword: '',
        });
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate password if provided
    if (formData.password) {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setIsSaving(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      
      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user in store
      if (data.data?.user) {
        setUser(data.data.user);
      }

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    // Reset form to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div>
        <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
          <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex mt-16">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
              <div className="p-6">
                <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex mt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                  Profile
                </h1>
                <button 
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90"
                  style={{ 
                    backgroundColor: isEditing ? 'var(--background-secondary)' : 'var(--primary-color)', 
                    color: isEditing ? 'var(--text-color)' : '#ffffff',
                    border: isEditing ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                  <p className="text-sm">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}>
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mr-6 ring-2 ring-offset-4 transition-colors duration-300" 
                       style={{ 
                         backgroundColor: 'var(--primary-color)20', 
                         color: 'var(--primary-color)',
                         ringColor: 'var(--primary-color)'
                       }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-color)' }}>
                      {user?.name || 'User'}
                    </h2>
                    <p className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className='text-[var(--primary-color)]' width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z"/>
                      </svg>
                      {user?.email || 'No email'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Name
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        opacity: isEditing ? 1 : 0.6,
                        cursor: isEditing ? 'text' : 'not-allowed',
                      }}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Email
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        opacity: isEditing ? 1 : 0.6,
                        cursor: isEditing ? 'text' : 'not-allowed',
                      }}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  {isEditing && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                          New Password (leave blank to keep current)
                        </label>
                        <input
                          className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                          style={{
                            backgroundColor: 'var(--input-bg)',
                            color: 'var(--text-color)',
                            border: '1px solid var(--border-color)',
                          }}
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter new password (min 8 characters)"
                          minLength={8}
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                          Confirm New Password
                        </label>
                        <input
                          className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                          style={{
                            backgroundColor: 'var(--input-bg)',
                            color: 'var(--text-color)',
                            border: '1px solid var(--border-color)',
                          }}
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm new password"
                          minLength={8}
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                      >
                        {isSaving ? 'Saving...' : 'Update Profile'}
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
