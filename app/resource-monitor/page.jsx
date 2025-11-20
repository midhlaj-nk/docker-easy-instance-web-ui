'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';
import { useAuthStore } from '@/lib/store';
import logger from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

function ResourceMonitorPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [grafanaUrl, setGrafanaUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchGrafanaUrl = async () => {
    if (!selectedInstance?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Backend endpoint: /api/v1/instances/<instance_id>/grafana-dashboard
      const baseUrl = (API_BASE_URL || 'https://web.easyinstance.com').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const grafanaUrlEndpoint = `${baseUrl}/api/v1/instances/${selectedInstance.id}/grafana-dashboard`;
      
      logger.log('Fetching Grafana URL from:', grafanaUrlEndpoint);
      
      const response = await fetch(grafanaUrlEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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

      if (!response.ok) {
        throw new Error(data.message || data.error?.message || `Failed to fetch Grafana dashboard URL (${response.status})`);
      }

      if (!data.data || !data.data.url) {
        throw new Error('Invalid response format: missing URL');
      }

      setGrafanaUrl(data.data.url);
    } catch (err) {
      logger.error('Error fetching Grafana URL:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenGrafana = () => {
    if (grafanaUrl) {
      window.open(grafanaUrl, '_blank');
    } else {
      fetchGrafanaUrl();
    }
  };

  useEffect(() => {
    if (selectedInstance?.id) {
      fetchGrafanaUrl().catch(err => {
        logger.error('Failed to fetch Grafana URL:', err);
      });
    }
  }, [selectedInstance?.id]);

  return (
    <div>
      <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex mt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
            <div className="p-6">
              {/* Instance Header */}

              {/* Main Content */}
              <div
                className="rounded-lg p-8 md:p-12 lg:min-h-[calc(100vh_-_115px)] flex  transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <div className="grid grid-cols-1  gap-8 md:grid-cols-2 w-full">
                  <div>
                    <h1 className="mb-4 text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
                      Resource Monitoring
                    </h1>
                    <p className="mb-8 text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Monitor your instance's resource usage in real-time with comprehensive Grafana dashboards. 
                      Track CPU, memory, storage, and network metrics collected every 5 minutes. 
                      View data aggregated across multiple time ranges for detailed performance insights.
                    </p>

                    {/* Metrics Quick View */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-lg border transition-colors duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background)' }}>
                        <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>CPU Usage</div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                          {selectedInstance?.cpuRequest || 'N/A'}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border transition-colors duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background)' }}>
                        <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Memory</div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                          {selectedInstance?.memoryRequest || 'N/A'}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border transition-colors duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background)' }}>
                        <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Storage</div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                          {selectedInstance?.storageUsed || 'N/A'}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border transition-colors duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background)' }}>
                        <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Uptime</div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                          {selectedInstance?.uptime || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
  onClick={handleOpenGrafana}
  disabled={isLoading}
  className="cursor-pointer px-10 py-4 bg-[var(--primary-color)] hover:bg-[#454685] rounded-full text-white font-medium transition duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isLoading ? (
    <>
      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      Loading Dashboard...
    </>
  ) : (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
      Open Grafana Dashboard
    </>
  )}
</button>

                  </div>

                  {/* Illustration */}
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-md">
                      {/* Animated Metrics Visualization */}
                      <div className="space-y-4">
                        <div className="p-6 rounded-lg border transition-colors duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span style={{ color: 'var(--text-secondary)' }}>CPU</span>
                            <span className="font-bold" style={{ color: 'var(--success-color)' }}>75%</span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: '75%', backgroundColor: 'var(--success-color)' }}></div>
                          </div>
                        </div>
                        <div className="p-6 rounded-lg border transition-colors duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span style={{ color: 'var(--text-secondary)' }}>Memory</span>
                            <span className="font-bold" style={{ color: 'var(--warning-color)' }}>82%</span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: '82%', backgroundColor: 'var(--warning-color)' }}></div>
                          </div>
                        </div>
                        <div className="p-6 rounded-lg border transition-colors duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span style={{ color: 'var(--text-secondary)' }}>Storage</span>
                            <span className="font-bold" style={{ color: 'var(--primary-color)' }}>45%</span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: '45%', backgroundColor: 'var(--primary-color)' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withInstanceGuard(ResourceMonitorPage);
