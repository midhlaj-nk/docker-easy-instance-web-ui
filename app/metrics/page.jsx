"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RealTimeMetricsChart from "../components/RealTimeMetricsChart";
import withInstanceGuard from "../components/withInstanceGuard";
import HistoricalMetricsChart from "../components/HistoricalMetricsChart";

function MetricsPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("live"); // 'live' or 'history'

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-theme">
      <div className="bg-[var(--background)] transition-colors duration-300 min-h-screen font-sans">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex pt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <main className="flex-1 lg:pl-72 pt-8 px-6 pb-10 transition-all duration-300">
            <div className="container-custom mx-auto animate-fade-in">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[var(--text-color)] tracking-tight">Metrics Panel</h1>
                  <p className="text-[var(--text-secondary)] mt-1">Performance monitoring for {selectedInstance?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-[var(--background-secondary)] p-1 rounded-lg border border-[var(--border-color)] shadow-sm">
                    <button
                      onClick={() => setViewMode("live")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "live"
                        ? "bg-[var(--input-bg)] text-[var(--primary-color)] shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-color)]"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${viewMode === "live" ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></span>
                        Live
                      </span>
                    </button>
                    <button
                      onClick={() => setViewMode("history")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "history"
                        ? "bg-[var(--input-bg)] text-[var(--primary-color)] shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-color)]"
                        }`}
                    >
                      History
                    </button>
                  </div>
                  {(() => {
                    const instanceUrl = selectedInstance?.instance_url || selectedInstance?.url;
                    console.log('instanceUrl', instanceUrl);
                    // Check if URL exists and is not empty
                      return (
                        <button
                          onClick={() => {
                            window.open(instanceUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 px-6 py-2.5"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          <span className="font-semibold tracking-wide">Connect</span>
                        </button>
                      );
                    
                  })()}
                </div>
              </div>

              <div className="min-h-[calc(100vh-180px)]">
                {viewMode === "live" ? (
                  <RealTimeMetricsChart instanceId={selectedInstance?.id} />
                ) : (
                  <HistoricalMetricsChart instanceId={selectedInstance?.id} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withInstanceGuard(MetricsPage);
