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
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md transition-colors duration-300" style={{ backgroundColor: 'var(--navbar-bg)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="px-6">
        <div className="flex gap-x-2 justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#333] transition-all duration-300 lg:hidden"
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

            <a href="/dashboard" className="flex items-center">
              <img src="/logo/logo.svg" alt="easy instance" className="h-8" />
            </a>
          </div>

          {/* Search Bar - Hidden */}
          {/* <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
            <div className="relative rounded-lg bg-slate-100 transition-all duration-300">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-colors duration-300"
                style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  color: 'var(--text-color)',
                }}
              />
            </div>
          </div> */}

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#333] transition-all duration-300"
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
                className="cursor-pointer relative p-2.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#333] transition-all duration-300 p-2"
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
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full"></span>
              </button>
              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#5355ce1c] hover:text-[#5355ce] transition duration-300"
                  >
                    <p className="font-medium">New message</p>
                    <p className="text-xs text-gray-500">From John Doe</p>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#5355ce1c] hover:text-[#5355ce] transition duration-300"
                  >
                    <p className="font-medium">Password changed</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </a>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="cursor-pointer flex items-center space-x-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#333] transition-all duration-300 p-2"
                aria-label="User profile"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {user && (
                  <span className="hidden md:block text-sm font-medium">
                    {user.name || user.login}
                  </span>
                )}
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#5355ce1c] hover:text-[#5355ce] transition duration-300"
                  >
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#5355ce1c] hover:text-[#5355ce] transition duration-300"
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#5355ce1c] hover:text-[#5355ce] transition duration-300"
                  >
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
