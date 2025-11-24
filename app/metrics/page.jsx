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
    <div>
      <div className="bg-slate-50 transition-colors duration-300 min-h-screen">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex pt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <main className="flex-1 lg:pl-[17rem] p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Metrics Panel</h1>
                  <p className="text-gray-500 mt-1">Performance monitoring for {selectedInstance?.name}</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setViewMode("live")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "live"
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
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
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    History
                  </button>
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
