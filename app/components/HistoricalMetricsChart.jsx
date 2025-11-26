"use client";
import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAuthStore } from "@/lib/store";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const HistoricalMetricsChart = ({ instanceId }) => {
    const { token } = useAuthStore();
    const [period, setPeriod] = useState("24h");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metricsData, setMetricsData] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8017";

    useEffect(() => {
        if (!instanceId || !token) return;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/v1/instances/${instanceId}/metrics/history?period=${period}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    console.error('API Error:', result);
                    throw new Error(result.message || result.error?.message || `HTTP ${response.status}`);
                }

                if (result.data) {
                    setMetricsData(result.data);
                } else {
                    console.error('No data in response:', result);
                    throw new Error("No data received from server");
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [instanceId, period, token]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading history...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!metricsData || metricsData.labels.length === 0)
        return <div className="p-8 text-center text-gray-500">No historical data available for this period.</div>;

    const timeOptions = [
        { value: '1h', label: '1 Hour', hours: 1 },
        { value: '6h', label: '6 Hours', hours: 6 },
        { value: '12h', label: '12 Hours', hours: 12 },
        { value: '24h', label: '24 Hours', hours: 24 },
        { value: '7d', label: '7 Days', days: 7 },
        { value: '30d', label: '30 Days', days: 30 },
    ];

    // Dynamically adjust tick limits based on period
    const getTickLimit = () => {
        switch (period) {
            case '1h': return 12; // Show every 5 minutes
            case '6h': return 12; // Show every 30 minutes
            case '12h': return 12; // Show every hour
            case '24h': return 12; // Show every 2 hours
            case '7d': return 14; // Show every 12 hours
            case '30d': return 15; // Show every 2 days
            default: return 10;
        }
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    maxTicksLimit: getTickLimit(),
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0,0,0,0.05)" },
            },
        },
        interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
        },
    };

    const cpuData = {
        labels: metricsData.labels,
        datasets: [
            {
                label: "CPU Usage (%)",
                data: metricsData.cpu,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const memData = {
        labels: metricsData.labels,
        datasets: [
            {
                label: "Memory (MiB)",
                data: metricsData.memory,
                borderColor: "rgb(168, 85, 247)",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const storageData = {
        labels: metricsData.labels,
        datasets: [
            {
                label: "Storage (MiB)",
                data: metricsData.storage,
                borderColor: "rgb(234, 179, 8)",
                backgroundColor: "rgba(234, 179, 8, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const networkData = {
        labels: metricsData.labels,
        datasets: [
            {
                label: "Network RX (MiB)",
                data: metricsData.net_rx,
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Network TX (MiB)",
                data: metricsData.net_tx,
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const ioData = {
        labels: metricsData.labels,
        datasets: [
            {
                label: "Disk Read (MiB)",
                data: metricsData.io_read,
                borderColor: "rgb(99, 102, 241)",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Disk Write (MiB)",
                data: metricsData.io_write,
                borderColor: "rgb(236, 72, 153)",
                backgroundColor: "rgba(236, 72, 153, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Time Period:</span>
                    <div className="flex flex-wrap gap-2">
                        {timeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setPeriod(option.value)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${period === option.value
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    {metricsData.labels.length} data points collected
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">CPU History</h3>
                    <div className="h-64">
                        <Line data={cpuData} options={commonOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Memory History</h3>
                    <div className="h-64">
                        <Line data={memData} options={commonOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Storage Growth</h3>
                    <div className="h-64">
                        <Line data={storageData} options={commonOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Network I/O</h3>
                    <div className="h-64">
                        <Line data={networkData} options={commonOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Disk I/O</h3>
                    <div className="h-64">
                        <Line data={ioData} options={commonOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoricalMetricsChart;
