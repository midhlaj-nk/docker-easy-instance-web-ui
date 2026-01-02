'use client';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';
import { useLogsStore } from '@/lib/store';
import { useAuthStore } from '@/lib/store';
import logger from '@/lib/logger';
import AnsiUp from 'ansi_up';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

function LogsPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [displayLogs, setDisplayLogs] = useState([]);
  const [podName, setPodName] = useState('');
  const [logType, setLogType] = useState('odoo');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const logContainerRef = useRef(null);
  const refreshIntervalRef = useRef(null);
  const ansiUp = new AnsiUp();
  const { token } = useAuthStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch real logs from the pod via Odoo backend
  const fetchRealLogs = async (isInitialLoad = false) => {
    try {
      // Only show loading on initial load, not on refreshes
      if (isInitialLoad) {
        setIsLoading(true);
      }
      setError(null);

      // Get logs from Odoo backend which uses Kubernetes Python API
      // Backend endpoint: /api/v1/instances/<instance_id>/logs
      const baseUrl = (API_BASE_URL || 'https://web.easyinstance.com').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const logsUrl = `${baseUrl}/api/v1/instances/${selectedInstance?.id}/logs?tail=100&type=${logType}`;

      logger.log('Fetching logs from:', logsUrl);

      const response = await fetch(logsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Response is not JSON (e.g., HTML error page)
        const textResponse = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${textResponse.substring(0, 100)}`);
      }

      if (response.ok && data.success) {
        // Set pod name from response (only on initial load)
        if (isInitialLoad && data.data?.podName) {
          setPodName(data.data.podName);
        }

        if (data.data?.logLines && data.data.logLines.length > 0) {
          if (isInitialLoad) {
            // On initial load, replace all logs
            setDisplayLogs(data.data.logLines);
          } else {
            // On refresh, append only new logs
            setDisplayLogs(prevLogs => {
              const newLogs = data.data.logLines;
              const existingLogs = prevLogs;

              // Find the last log that exists in both arrays to avoid duplicates
              const lastExistingIndex = existingLogs.length - 1;
              let startIndex = 0;

              if (lastExistingIndex >= 0 && newLogs.length > 0) {
                const lastExistingLog = existingLogs[lastExistingIndex];
                const lastExistingIndexInNew = newLogs.findIndex(log => log === lastExistingLog);

                if (lastExistingIndexInNew >= 0) {
                  startIndex = lastExistingIndexInNew + 1;
                }
              }

              // Append only new logs
              const logsToAppend = newLogs.slice(startIndex);
              return [...existingLogs, ...logsToAppend];
            });
          }
          setError(null);
        } else if (isInitialLoad) {
          setDisplayLogs([]);
          setError('No logs available from the pod');
        }
      } else {
        if (isInitialLoad) {
          const errorMsg = data.message || data.error?.message || `Failed to fetch logs (${response.status})`;
          setError(errorMsg);
          setDisplayLogs([]);
          logger.error('Failed to fetch logs:', { status: response.status, data });
        }
      }
    } catch (error) {
      logger.error('Error fetching logs:', error);
      if (isInitialLoad) {
        setError('Network error: ' + error.message);
        setDisplayLogs([]);
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  };


  // Initialize logs on component mount
  useEffect(() => {
    if (selectedInstance?.id && token) {
      fetchRealLogs(true); // Initial load
    }
  }, [selectedInstance?.id, token, logType]); // Re-fetch when logType changes

  // Auto-refresh logs
  useEffect(() => {
    if (autoScroll && selectedInstance?.id && token) {
      refreshIntervalRef.current = setInterval(() => {
        fetchRealLogs(false); // Refresh without loading state
      }, 5000); // Refresh every 5 seconds

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoScroll, selectedInstance?.id, token, logType]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [displayLogs, autoScroll]);

  const handleRefresh = () => {
    fetchRealLogs(false); // Manual refresh without loading state
  };

  const handleClearLogs = () => {
    setDisplayLogs([]);
  };

  const filteredLogs = searchTerm
    ? displayLogs.filter((log) => log.toLowerCase().includes(searchTerm.toLowerCase()))
    : displayLogs;

  return (
    <div className="dashboard-theme">
    <div className="bg-[var(--background)] transition-colors duration-300 min-h-screen font-sans">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
          <div className="p-6">

            {/* Logs Controls */}
            <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-card w-full bg-white pl-10 pr-4 py-2 rounded-lg outline-none transition-colors duration-300"
                    style={{

                      color: 'var(--text-color)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-secondary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>

                <div className="flex rounded-lg overflow-hidden border border-[var(--border-color)]">
                  <button
                    onClick={() => setLogType('odoo')}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${logType === 'odoo'
                        ? 'bg-[var(--primary-color)] text-white'
                        : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--background)]'
                      }`}
                  >
                    Odoo
                  </button>
                  <button
                    onClick={() => setLogType('postgres')}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 border-l border-[var(--border-color)] ${logType === 'postgres'
                        ? 'bg-[var(--primary-color)] text-white'
                        : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--background)]'
                      }`}
                  >
                    Postgres
                  </button>
                </div>

                <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                  Pod: <span className="font-mono" style={{ color: 'var(--text-color)' }}>{podName || 'Loading...'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 ${autoScroll ? 'bg-[var(--primary-color)] text-white' : ''
                    }`}
                  style={!autoScroll ? { backgroundColor: 'var(--background-secondary)', color: 'var(--text-color)', border: '1px solid var(--border-color)' } : {}}
                >
                  Auto-scroll
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
                >
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-5 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  style={{ backgroundColor: 'var(--error-color)', color: 'white' }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                <p className="text-sm">{error}</p>
                <button onClick={() => setError(null)} className="text-sm underline">Dismiss</button>
              </div>
            )}

            {/* Logs Display */}
            <div className="rounded-lg transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}>
              <div
                ref={logContainerRef}
                className="p-4 font-mono text-sm overflow-y-auto lg:min-h-[calc(100vh_-_210px)]"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  height: 'calc(100vh - 280px)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
              >
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-color)' }}></div>
                      <p className="mt-2" style={{ color: '#888' }}>Loading logs...</p>
                    </div>
                  </div>
                )}

                {!isLoading && filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <div
                      key={index}
                      className="mb-1 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: ansiUp.ansi_to_html(log) }}
                    />
                  ))
                ) : !isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="9" />
                        <line x1="9" y1="13" x2="15" y2="13" />
                        <line x1="9" y1="17" x2="13" y2="17" />
                      </svg>
                      <p className="mt-4 text-lg font-medium" style={{ color: 'var(--text-color)' }}>No logs available</p>
                      <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {error ? 'Unable to fetch logs from the pod.' : 'Logs will appear here when the pod generates output.'}
                      </p>
                      <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Logs Info */}
            <div className="mt-4 flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-4">
                <span>Total logs: {filteredLogs.length}</span>
                {autoScroll && <span>Auto-refresh: ON</span>}
                <span>Mode: Live</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}

export default withInstanceGuard(LogsPage);