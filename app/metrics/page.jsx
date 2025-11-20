"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MetricsChart from "../components/MetricsChart";

export default function MetricsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="bg-slate-50 transition-colors duration-300">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex mt-16">

          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
            <div className="p-6">



              <h1 className="text-xl font-bold text-[#333] mb-3">Metrics Panel</h1>

              <MetricsChart />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
