"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
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
                className="cursor-pointer relative p-2.5 rounded-full hover:bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-color)] transition-all duration-300"
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
                <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--error-color)] rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>
              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-card py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-[var(--border-color)]">
                    <h3 className="font-semibold text-[var(--text-color)]">Notifications</h3>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-3 hover:bg-[var(--input-bg)] transition duration-200"
                  >
                    <p className="font-medium text-sm text-[var(--text-color)]">New message</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">From John Doe</p>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 hover:bg-[var(--input-bg)] transition duration-200"
                  >
                    <p className="font-medium text-sm text-[var(--text-color)]">Password changed</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">2 hours ago</p>
                  </a>
                  <div className="px-4 py-2 border-t border-[var(--border-color)] text-center">
                    <a href="#" className="text-xs font-medium text-[var(--primary-color)] hover:underline">View all</a>
                  </div>
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
