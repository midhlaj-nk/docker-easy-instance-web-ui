"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';


function Navbar({ isSidebarOpen, toggleSidebar }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Auth store and router
  const { logout, user } = useAuthStore();
  const router = useRouter();

  // Theme from next-themes
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  //notifications

  const [notifications, setNotifications] = useState([]);

  const [clearAllClicked, setClearAllClicked] = useState(false);

  const [activeNotificationTab, setActiveNotificationTab] = useState('all');



  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    const newState = !isNotificationDropdownOpen;
    setIsNotificationDropdownOpen(newState);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      router.push('/login');
    }
  };

  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setIsProfileDropdownOpen(false);
    }
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target)
    ) {
      setIsNotificationDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const removeNotification = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/docker/remove_notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      // Remove from UI
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      
    } catch (err) {
      console.error("Failed to remove notification", err);
    }
  };



  async function clearNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/docker/clear_notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 123 }), 
      });

      setNotifications([]);

      if (!response.ok) {
        console.error("Failed to fetch notifications", response.statusText);
        return;
      }

    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }



 useEffect(() => {
  async function fetchNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/docker/all_notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 123 }),
      });

      if (!response.ok) {
        console.error("Failed to fetch notifications", response.statusText);
        return;
      }

      const data = await response.json();
      const notifs = Array.isArray(data) ? data : data.result || [];
      setNotifications(notifs);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }

  fetchNotifications();
  const interval = setInterval(fetchNotifications, 300); 
  return () => clearInterval(interval);
}, []);



  return (
    <nav className="fixed w-full top-0 z-50 glass transition-colors duration-300">
      <div className="px-6">
        <div className="flex gap-x-2 justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-color)] transition-all duration-300 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>

            <a href="/" className="flex items-center">
              <img src="/logo/logo.svg" alt="easy instance" className="h-8" />
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full hover:bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-color)] transition-all duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mounted && theme === 'dark' ? (
                // Sun icon for light mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={toggleNotificationDropdown}
                className="glass-card cursor-pointer relative p-2.5 rounded-full hover:bg-[var(--input-bg)] transition-colors duration-200"
                aria-label="Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>

                {/* Show total unread notifications */}
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-600 text-white text-[10px] font-medium rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {isNotificationDropdownOpen && (
                <div className="glass-card absolute right-0 mt-2 w-[520px] bg-white z-50 animate-fade-in shadow-lg rounded-md overflow-hidden">
                  {/* Header */}
                  <div className="glass-card px-4 py-3 border-b border-[var(--border-color)]">
                    <h3 className="font-semibold text-lg text-[var(--text-color)]">Notifications</h3>
                  </div>

                  {/* Tab Navigation */}
                  <div className="glass-card flex border-b border-[var(--border-color)]">
                    {[
                      { id: 'all', label: 'All', count: notifications.length },
                      { id: 'instance', label: 'Instance', count: notifications.filter(n => n.notification_type === 'instance').length },
                      { id: 'subscription', label: 'Subscription', count: notifications.filter(n => n.notification_type === 'subscription').length },
                      { id: 'backup', label: 'Backup', count: notifications.filter(n => n.notification_type === 'backup').length },
                      { id: 'help_ticket', label: 'Help Ticket', count: notifications.filter(n => n.notification_type === 'help_ticket').length }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveNotificationTab(tab.id)}
                        className={`flex-1 px-1.5 py-2.5 text-xs font-medium transition-colors relative ${
                          activeNotificationTab === tab.id
                            ? 'text-[var(--primary-color)] bg-white'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            activeNotificationTab === tab.id
                              ? 'bg-[var(--primary-color)] text-white'
                              : 'bg-gray-300 text-gray-700'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                        {activeNotificationTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-color)]"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Scrollable Notifications List */}
                  <div className="max-h-72 overflow-y-auto">
                    {(() => {
                      const filteredNotifications = activeNotificationTab === 'all' 
                        ? notifications 
                        : notifications.filter(n => n.notification_type === activeNotificationTab);

                      return Array.isArray(filteredNotifications) && filteredNotifications.length > 0 ? (
                        filteredNotifications.map((n) => (
                          <div
                            key={n.id}
                            className="flex items-start justify-between px-4 py-3 hover:bg-[var(--input-bg)] border-b border-gray-100 last:border-b-0"
                          >
                            {/* Icon based on notification_type */}
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`mt-0.5 p-1.5 rounded-full ${
                                n.notification_type === 'subscription' ? 'bg-purple-100 text-purple-600' :
                                n.notification_type === 'backup' ? 'bg-green-100 text-green-600' :
                                n.notification_type === 'instance' ? 'bg-blue-100 text-blue-600' :
                                n.notification_type === 'help_ticket' ? 'bg-orange-100 text-orange-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {n.notification_type === 'subscription' && (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                )}
                                {n.notification_type === 'backup' && (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                )}
                                {n.notification_type === 'instance' && (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                  </svg>
                                )}
                                {n.notification_type === 'help_ticket' && (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                )}
                                {!n.notification_type && (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>

                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-[var(--text-color)] line-clamp-2">
                                  {n.message || n.name}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                  {n.time || 'Just now'}
                                </p>
                              </div>
                            </div>

                            {/* Close Button */}
                            <button
                              onClick={() => removeNotification(n.id)}
                              className="ml-2 text-gray-400 hover:text-red-500 transition flex-shrink-0"
                              aria-label="Remove notification"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-sm text-gray-500">No notifications in this category</p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Footer */}
                  {!clearAllClicked && notifications.length > 0 && (
                    <div className="glass-card px-4 py-3 border-t border-[var(--border-color)] text-center">
                      <button
                        className="w-full px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                        onClick={() => {
                          setClearAllClicked(true);
                          clearNotifications();
                        }}
                      >
                        Clear all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="cursor-pointer flex items-center space-x-2 rounded-full hover:bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-color)] transition-all duration-300 p-1.5 pr-3 border border-transparent hover:border-[var(--border-color)]"
                aria-label="User profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                {user && (
                  <span className="hidden md:block text-sm font-medium">
                    {user.name || user.email}
                  </span>
                )}
                <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-card py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-[var(--border-color)] mb-1">
                    <p className="text-sm font-medium text-[var(--text-color)]">{user?.name || 'User'}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--input-bg)] transition duration-200"
                  >
                    <svg className="w-4 h-4 mr-3 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--input-bg)] transition duration-200"
                  >
                    <svg className="w-4 h-4 mr-3 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </a>
                  <div className="border-t border-[var(--border-color)] my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-[var(--error-color)] hover:bg-[var(--input-bg)] transition duration-200"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
