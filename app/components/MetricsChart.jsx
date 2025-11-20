
"use client";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const lineChartData = {
  labels: ["09:26", "09:27", "09:28", "09:29", "09:30", "09:31", "09:32", "09:33", "09:34", "09:35", "09:36"],
  datasets: [
    {
      label: "Memory Usage (MiB)",
      data: [340, 340, 340, 340, 340, 340, 340, 340, 340, 340, 340],
      fill: true,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      pointBackgroundColor: "rgba(75, 192, 192, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(75, 192, 192, 1)",
    },
  ],
};

const lineChartData2 = {
    labels: ["09:26", "09:27", "09:28", "09:29", "09:30", "09:31", "09:32", "09:33", "09:34", "09:35", "09:36"],
    datasets: [
      {
        label: "CPU Usage (cores)",
        data: [0.014, 0.012, 0.013, 0.011, 0.008, 0.012, 0.010, 0.009, 0.014, 0.015,0.001],
        fill: true,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

const barChartData = {
    labels: ["09:26", "09:27", "09:28", "09:29", "09:30", "09:31", "09:32", "09:33", "09:34", "09:35", "09:36"],
  datasets: [
    {
      label: "CPU Usage (cores)",
      data: [0.014, 0.011, 0.013, 0.012, 0.010, 0.008, 0.014, 0.009, 0.010, 0.015, 0.012],
      backgroundColor: "rgba(255, 159, 64, 0.8)",
    },
  ],
};

const barChartData2 = {
    labels: ["09:26", "09:27", "09:28", "09:29", "09:30", "09:31", "09:32", "09:33", "09:34", "09:35", "09:36"],
  datasets: [
    {
      label: "Memory Usage (MiB)",
      data: [340, 340, 340, 340, 340, 340, 340, 340, 340, 340, 340],
      backgroundColor: "rgba(255, 99, 132, 0.8)",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#333",
      }
    },
    title: {
      display: true,
      text: "Memory Usage (MiB)",
      color: "#333",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#333",
      }
    },
    y: {
      grid: {
        color: "#ddd",
      },
      ticks: {
        color: "#333",
      }
    }
  }
};
const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
        }
      },
      title: {
        display: true,
        text: "CPU Usage (cores)",
        color: "#333",
      },
    },
    scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#333",
          }
        },
        y: {
          grid: {
            color: "#ddd",
          },
          ticks: {
            color: "#333",
          }
        }
      }
  };
  const options3 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
        }
      },
      title: {
        display: true,
        text: "CPU Usage (cores)",
        color: "#333",
      },
    },
    scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#333",
          }
        },
        y: {
          grid: {
            color: "#ddd",
          },
          ticks: {
            color: "#333",
          }
        }
      }
  };
  const options4 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
        }
      },
      title: {
        display: true,
        text: "Memory Usage (MiB)",
        color: "#333",
      },
    },
    scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#333",
          }
        },
        y: {
          grid: {
            color: "#ddd",
          },
          ticks: {
            color: "#333",
          }
        }
      }
  };

export default function MetricsChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="bg-white p-4 rounded-lg h-96" style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                }}>
        <Line options={options} data={lineChartData} />
      </div>
      <div className="bg-white p-4 rounded-lg h-96" style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                }}>
        <Line options={options2} data={lineChartData2} />
      </div>
      <div className="bg-white p-4 rounded-lg h-96" style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                }}>
        <Bar options={options3} data={barChartData} />
      </div>
      <div className="bg-white p-4 rounded-lg h-96" style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                }}>
        <Bar options={options4} data={barChartData2} />
      </div>
    </div>
  );
}
