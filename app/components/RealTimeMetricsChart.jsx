"use client";
import React, { useState, useEffect, useRef } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useAuthStore } from "@/lib/store";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const MAX_DATA_POINTS = 60; // Keep last 2 minutes (assuming 2s interval)

export default function RealTimeMetricsChart({ instanceId }) {
    const { token } = useAuthStore();

    // State for chart history
    const [metricsHistory, setMetricsHistory] = useState({
        labels: [],
        odooCpu: [],
        postgresCpu: [],
        odooMem: [],
        postgresMem: [],
        odooPids: [],
        postgresPids: [],
        blockReadRate: [],
        blockWriteRate: [],
        netRxRate: [],
        netTxRate: [],
    });

    // State for current summary stats
    const [currentStats, setCurrentStats] = useState({
        cpu: 0,
        mem: 0,
        memLimit: 0,
        pids: 0,
        storage: {
            db: 0,
            filestore: 0,
            total: 0
        },
        ioReadSpeed: 0,
        ioWriteSpeed: 0
    });

    // Ref to store previous values for rate calculation
    const lastValuesRef = useRef({
        blockRead: 0,
        blockWrite: 0,
        netRx: 0,
        netTx: 0,
        timestamp: 0
    });

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8017";

    useEffect(() => {
        if (!instanceId || !token) return;

        const fetchMetrics = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/metrics`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) return;

                const result = await response.json();
                const data = result.data;

                if (!data.running) return;

                const now = Date.now();
                const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

                // Calculate Rates (MB/s)
                let readRate = 0;
                let writeRate = 0;
                let rxRate = 0;
                let txRate = 0;

                const currentTotalRead = (data.odoo?.block_read_mib || 0) + (data.postgres?.block_read_mib || 0);
                const currentTotalWrite = (data.odoo?.block_write_mib || 0) + (data.postgres?.block_write_mib || 0);
                const currentTotalRx = (data.odoo?.net_rx_mib || 0) + (data.postgres?.net_rx_mib || 0);
                const currentTotalTx = (data.odoo?.net_tx_mib || 0) + (data.postgres?.net_tx_mib || 0);

                if (lastValuesRef.current.timestamp > 0) {
                    const timeDiff = (now - lastValuesRef.current.timestamp) / 1000; // seconds
                    if (timeDiff > 0) {
                        // Avoid negative spikes if container restarts
                        readRate = Math.max(0, (currentTotalRead - lastValuesRef.current.blockRead) / timeDiff);
                        writeRate = Math.max(0, (currentTotalWrite - lastValuesRef.current.blockWrite) / timeDiff);
                        rxRate = Math.max(0, (currentTotalRx - lastValuesRef.current.netRx) / timeDiff);
                        txRate = Math.max(0, (currentTotalTx - lastValuesRef.current.netTx) / timeDiff);
                    }
                }

                // Update ref with current values
                lastValuesRef.current = {
                    blockRead: currentTotalRead,
                    blockWrite: currentTotalWrite,
                    netRx: currentTotalRx,
                    netTx: currentTotalTx,
                    timestamp: now
                };

                // Update history state
                setMetricsHistory((prev) => {
                    const newLabels = [...(prev.labels || []), timestamp].slice(-MAX_DATA_POINTS);

                    return {
                        labels: newLabels,
                        odooCpu: [...(prev.odooCpu || []), data.odoo?.cpu_percent || 0].slice(-MAX_DATA_POINTS),
                        postgresCpu: [...(prev.postgresCpu || []), data.postgres?.cpu_percent || 0].slice(-MAX_DATA_POINTS),
                        odooMem: [...(prev.odooMem || []), data.odoo?.memory_usage_mib || 0].slice(-MAX_DATA_POINTS),
                        postgresMem: [...(prev.postgresMem || []), data.postgres?.memory_usage_mib || 0].slice(-MAX_DATA_POINTS),
                        odooPids: [...(prev.odooPids || []), data.odoo?.pids || 0].slice(-MAX_DATA_POINTS),
                        postgresPids: [...(prev.postgresPids || []), data.postgres?.pids || 0].slice(-MAX_DATA_POINTS),
                        blockReadRate: [...(prev.blockReadRate || []), readRate].slice(-MAX_DATA_POINTS),
                        blockWriteRate: [...(prev.blockWriteRate || []), writeRate].slice(-MAX_DATA_POINTS),
                        netRxRate: [...(prev.netRxRate || []), rxRate].slice(-MAX_DATA_POINTS),
                        netTxRate: [...(prev.netTxRate || []), txRate].slice(-MAX_DATA_POINTS),
                    };
                });

                // Update current live stats
                setCurrentStats({
                    cpu: (data.odoo?.cpu_percent || 0) + (data.postgres?.cpu_percent || 0),
                    mem: (data.odoo?.memory_usage_mib || 0) + (data.postgres?.memory_usage_mib || 0),
                    memLimit: (data.odoo?.memory_limit_mib || 0) + (data.postgres?.memory_limit_mib || 0),
                    pids: (data.odoo?.pids || 0) + (data.postgres?.pids || 0),
                    storage: {
                        db: data.storage?.database_size_mib || 0,
                        filestore: data.storage?.filestore_size_mib || 0,
                        total: data.storage?.total_size_mib || 0
                    },
                    ioReadSpeed: readRate,
                    ioWriteSpeed: writeRate
                });

            } catch (error) {
                console.error("Failed to fetch metrics:", error);
            }
        };

        // Initial fetch
        fetchMetrics();

        // Poll every 2 seconds
        const interval = setInterval(fetchMetrics, 2000);

        return () => clearInterval(interval);
    }, [instanceId, token]);

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: "top",
                labels: { color: "#64748b", font: { family: "'Inter', sans-serif", size: 11, weight: 500 }, usePointStyle: true, boxWidth: 6 },
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                displayColors: true,
                boxPadding: 4
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: "#94a3b8", maxTicksLimit: 8, font: { size: 10 } } },
            y: { grid: { color: "#f1f5f9", borderDash: [4, 4] }, ticks: { color: "#94a3b8", font: { size: 10 } }, beginAtZero: true },
        },
        elements: { point: { radius: 0, hitRadius: 20, hoverRadius: 4 }, line: { tension: 0.4, borderWidth: 2 } }
    };

    const cpuData = {
        labels: metricsHistory.labels || [],
        datasets: [
            { label: "Odoo", data: metricsHistory.odooCpu || [], fill: true, backgroundColor: "rgba(99, 102, 241, 0.2)", borderColor: "#6366f1" },
            { label: "PostgreSQL", data: metricsHistory.postgresCpu || [], fill: true, backgroundColor: "rgba(168, 85, 247, 0.2)", borderColor: "#a855f7" },
        ],
    };

    const memData = {
        labels: metricsHistory.labels || [],
        datasets: [
            { label: "Odoo", data: metricsHistory.odooMem || [], fill: true, backgroundColor: "rgba(236, 72, 153, 0.2)", borderColor: "#ec4899" },
            { label: "PostgreSQL", data: metricsHistory.postgresMem || [], fill: true, backgroundColor: "rgba(59, 130, 246, 0.2)", borderColor: "#3b82f6" },
        ],
    };

    const ioData = {
        labels: metricsHistory.labels || [],
        datasets: [
            { label: "Read (MB/s)", data: metricsHistory.blockReadRate || [], borderColor: "#f59e0b", backgroundColor: "rgba(245, 158, 11, 0.5)", borderWidth: 0, borderRadius: 4, barPercentage: 0.6 },
            { label: "Write (MB/s)", data: metricsHistory.blockWriteRate || [], borderColor: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.5)", borderWidth: 0, borderRadius: 4, barPercentage: 0.6 },
        ],
    };

    const netData = {
        labels: metricsHistory.labels || [],
        datasets: [
            { label: "RX (MB/s)", data: metricsHistory.netRxRate || [], fill: true, backgroundColor: "rgba(16, 185, 129, 0.2)", borderColor: "#10b981" },
            { label: "TX (MB/s)", data: metricsHistory.netTxRate || [], fill: true, backgroundColor: "rgba(59, 130, 246, 0.2)", borderColor: "#3b82f6" },
        ],
    };

    const storageData = {
        labels: ['Database', 'Filestore'],
        datasets: [
            {
                data: [currentStats.storage?.db || 0, currentStats.storage?.filestore || 0],
                backgroundColor: ['#8b5cf6', '#ec4899'],
                borderColor: ['#7c3aed', '#db2777'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6 pb-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total CPU</p>
                        <h4 className="text-2xl font-bold text-slate-800 mt-1">{currentStats.cpu.toFixed(1)}%</h4>
                    </div>
                    <div className="glass-card h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Memory</p>
                        <h4 className="text-2xl font-bold text-slate-800 mt-1">{currentStats.mem.toFixed(0)} <span className="text-sm text-slate-400 font-normal">/ {currentStats.memLimit > 0 ? currentStats.memLimit.toFixed(0) : '-'} MiB</span></h4>
                    </div>
                    <div className="glass-card h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg IO Speed</p>
                        <h4 className="text-2xl font-bold text-slate-800 mt-1">{(currentStats.ioReadSpeed + currentStats.ioWriteSpeed).toFixed(2)} <span className="text-sm text-slate-400 font-normal">MB/s</span></h4>
                    </div>
                    <div className="glass-card h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Storage Used</p>
                        <h4 className="text-2xl font-bold text-slate-800 mt-1">{(currentStats.storage?.total || 0).toFixed(0)} <span className="text-sm text-slate-400 font-normal">MiB</span></h4>
                    </div>
                    <div className="glass-card h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CPU Usage */}
                <div className="glass-card p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="glass-card flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-slate-800">CPU Usage (%)</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">Live</span>
                    </div>
                    <div className="glass-card h-64">
                        <Line options={commonOptions} data={cpuData} />
                    </div>
                </div>

                {/* Memory Usage */}
                <div className="glass-card p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="glass-card flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-slate-800">Memory Usage (MiB)</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">Live</span>
                    </div>
                    <div className="glass-card h-64">
                        <Line options={commonOptions} data={memData} />
                    </div>
                </div>

                {/* Storage Breakdown */}
                <div className="glass-card p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="glass-card flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-slate-800">Storage Breakdown</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">Total: {(currentStats.storage?.total || 0).toFixed(0)} MiB</span>
                    </div>
                    <div className="glass-card h-64 flex items-center justify-center">
                        <div className="glass-card w-48">
                            <Doughnut data={storageData} options={{ cutout: '70%', plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>

                {/* Network I/O */}
                <div className="glass-card p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="glass-card flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-slate-800">Network Throughput (MB/s)</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">Live</span>
                    </div>
                    <div className="glass-card h-64">
                        <Line options={commonOptions} data={netData} />
                    </div>
                </div>

                {/* Block I/O - Full Width */}
                <div className="glass-card p-6 rounded-xl border border-slate-100 shadow-sm md:col-span-2">
                    <div className="glass-cardflex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-slate-800">Disk I/O Throughput (MB/s)</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">Live</span>
                    </div>
                    <div className="glass-card h-64">
                        <Bar options={commonOptions} data={ioData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
