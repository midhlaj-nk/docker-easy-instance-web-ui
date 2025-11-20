"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import withInstanceGuard from "../components/withInstanceGuard";
import BackupConfigModal from "../components/BackupConfigModal";
import { useBackupStore, useInstancesStore, useAuthStore } from "@/lib/store";
import logger from "@/lib/logger";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8069";

function BackupPage() {
  const [activeTab, setActiveTab] = useState("backup");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  const { selectedInstance } = useInstancesStore();
  const {
    backups,
    schedules,
    isLoading,
    error,
    fetchBackups,
    createBackup,
    deleteBackup,
    fetchBackupConfigurations,
    createBackupConfiguration,
    updateBackupConfiguration,
    deleteBackupConfiguration,
    clearError,
  } = useBackupStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (selectedInstance?.id) {
      fetchBackups(selectedInstance.id).catch((err) => {
        logger.error("Failed to fetch backups:", err);
      });
      if (activeTab === "configure") {
        fetchBackupConfigurations(selectedInstance.id).catch((err) => {
          logger.error("Failed to fetch configurations:", err);
        });
      }
    }
  }, [
    selectedInstance?.id,
    activeTab,
    fetchBackups,
    fetchBackupConfigurations,
  ]);

  const handleBackupNow = async () => {
    if (!selectedInstance?.id) return;

    const result = await createBackup(selectedInstance.id, {});

    if (result.success) {
      alert("Backup created successfully!");
      // Refresh backup list
      await fetchBackups(selectedInstance.id);
    } else {
      alert(`Failed to create backup: ${result.error}`);
    }
  };

  const handleDownloadBackup = (backupId, filename) => {
    const { token } = useAuthStore.getState();
    const url = `${API_BASE_URL}/web/content?model=instance.backup&id=${backupId}&field=backup_file&filename_field=backup_file_name&filename=${filename}&download=true`;

    // Open in new tab to trigger download
    window.open(url, "_blank");
  };

  const handleDeleteBackup = async (backupId, backupName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete backup "${backupName}"?`
    );
    if (!confirmed) return;

    const result = await deleteBackup(selectedInstance.id, backupId);
    if (result.success) {
      alert("Backup deleted successfully!");
      // Refresh backup list
      await fetchBackups(selectedInstance.id);
    } else {
      alert(`Failed to delete backup: ${result.error}`);
    }
  };

  const handleSaveConfiguration = async (configData) => {
    if (editingConfig) {
      const result = await updateBackupConfiguration(
        selectedInstance.id,
        editingConfig.id,
        configData
      );
      if (result.success) {
        alert("Configuration updated successfully!");
        setShowConfigModal(false);
        setEditingConfig(null);
        await fetchBackupConfigurations(selectedInstance.id);
      } else {
        alert(`Failed to update configuration: ${result.error}`);
      }
    } else {
      const result = await createBackupConfiguration(
        selectedInstance.id,
        configData
      );
      if (result.success) {
        alert("Configuration created successfully!");
        setShowConfigModal(false);
        await fetchBackupConfigurations(selectedInstance.id);
      } else {
        alert(`Failed to create configuration: ${result.error}`);
      }
    }
  };

  const handleEditConfiguration = (config) => {
    setEditingConfig(config);
    setShowConfigModal(true);
  };

  const handleDeleteConfiguration = async (configId, displayName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete configuration "${displayName}"?`
    );
    if (!confirmed) return;

    const result = await deleteBackupConfiguration(
      selectedInstance.id,
      configId
    );
    if (result.success) {
      alert("Configuration deleted successfully!");
      await fetchBackupConfigurations(selectedInstance.id);
    } else {
      alert(`Failed to delete configuration: ${result.error}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  if (!selectedInstance) {
    return (
      <div
        className="transition-colors duration-300"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-color)" }}
            >
              No Instance Selected
            </h1>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              Please select an instance from the dashboard first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="transition-colors duration-300"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex mt-16">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 lg:pl-[17rem] overflow-hidden overflow-y-auto">
            <div className="p-6">
              {/* Error Display */}
              {error && (
                <div
                  className="mb-4 p-4 rounded-lg flex items-center justify-between"
                  style={{
                    backgroundColor: "var(--error-color)20",
                    color: "var(--error-color)",
                  }}
                >
                  <p className="text-sm">{error}</p>
                  <button onClick={clearError} className="text-sm underline">
                    Dismiss
                  </button>
                </div>
              )}

              {/* Header with Tabs */}
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-color)" }}
                >
                  Backup Management
                </h1>
                <div>
                  <nav className="flex space-x-1" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab("backup")}
                      className={`whitespace-nowrap py-2 px-6 rounded-md font-medium text-sm transition-all duration-300 ${
                        activeTab === "backup"
                          ? "bg-[var(--primary-color)] text-white"
                          : "hover:bg-[var(--primary-color)]20"
                      }`}
                      style={
                        activeTab !== "backup"
                          ? {
                              color: "var(--text-color)",
                              backgroundColor: "var(--background-secondary)",
                            }
                          : {}
                      }
                    >
                      Backup List
                    </button>
                    <button
                      onClick={() => setActiveTab("configure")}
                      className={`whitespace-nowrap py-2 px-6 rounded-md font-medium text-sm transition-all duration-300 ${
                        activeTab === "configure"
                          ? "bg-[var(--primary-color)] text-white"
                          : "hover:bg-[var(--primary-color)]20"
                      }`}
                      style={
                        activeTab !== "configure"
                          ? {
                              color: "var(--text-color)",
                              backgroundColor: "var(--background-secondary)",
                            }
                          : {}
                      }
                    >
                      Configuration
                    </button>
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === "backup" && (
                  <div>
                    {/* Backup Now Button */}
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={handleBackupNow}
                        disabled={isLoading}
                        className="px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "#ffffff",
                        }}
                      >
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
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        {isLoading ? "Creating Backup..." : "Backup Now"}
                      </button>
                    </div>

                    {/* Loading State */}
                    {isLoading && backups.length === 0 ? (
                      <div
                        className="rounded-lg p-8 flex justify-center items-center"
                        style={{
                          backgroundColor: "var(--background-secondary)",
                          boxShadow: "var(--card-shadow)",
                        }}
                      >
                        <div className="text-center">
                          <div
                            className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
                            style={{ borderColor: "var(--primary-color)" }}
                          ></div>
                          <p
                            className="mt-4"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Loading backups...
                          </p>
                        </div>
                      </div>
                    ) : backups.length === 0 ? (
                      /* Empty State */
                      <div
                        className="rounded-lg p-8 flex flex-col justify-center items-center text-center h-[calc(100vh_-_235px)]"
                        style={{
                          backgroundColor: "var(--background-secondary)",
                          boxShadow: "var(--card-shadow)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--text-secondary)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        <h2
                          className="mb-3 mt-5 text-2xl font-bold"
                          style={{ color: "var(--text-color)" }}
                        >
                          No Backups Found
                        </h2>
                        <p
                          className="mb-6 max-w-2xl"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          You haven't created any backups yet. Click "Backup
                          Now" to create your first backup.
                        </p>
                      </div>
                    ) : (
                      /* Table View */
                      <div
                        className="rounded-lg overflow-hidden"
                        style={{
                          backgroundColor: "var(--background-secondary)",
                          boxShadow: "var(--card-shadow)",
                        }}
                      >
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr
                                style={{
                                  backgroundColor: "var(--background)",
                                  borderBottom: "1px solid var(--border-color)",
                                }}
                              >
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Time (UTC)
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Display Name
                                </th>
                                <th
                                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              style={{
                                backgroundColor: "var(--background-secondary)",
                              }}
                            >
                              {backups.map((backup, index) => (
                                <tr
                                  key={backup.id}
                                  style={{
                                    borderBottom:
                                      index !== backups.length - 1
                                        ? "1px solid var(--border-color)"
                                        : "none",
                                  }}
                                  className="hover:bg-[var(--background)] transition-colors duration-200"
                                >
                                  <td
                                    className="px-6 py-4 whitespace-nowrap text-sm"
                                    style={{ color: "var(--text-color)" }}
                                  >
                                    {formatDate(backup.created_at)}
                                  </td>
                                  <td
                                    className="px-6 py-4 text-sm"
                                    style={{ color: "var(--text-color)" }}
                                  >
                                    <div className="flex items-center gap-2">
                                      {backup.name || `Backup ${backup.id}`}
                                      <span
                                        className="px-2 py-0.5 text-xs rounded-full"
                                        style={{
                                          backgroundColor:
                                            "var(--success-color)20",
                                          color: "var(--success-color)",
                                        }}
                                      >
                                        {backup.status}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() =>
                                          handleDownloadBackup(
                                            backup.id,
                                            backup.name
                                          )
                                        }
                                        className="p-2 rounded-lg transition-all duration-300 hover:bg-[var(--background)]"
                                        title="Download"
                                        style={{
                                          color: "var(--primary-color)",
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                          <polyline points="7 10 12 15 17 10"></polyline>
                                          <line
                                            x1="12"
                                            y1="15"
                                            x2="12"
                                            y2="3"
                                          ></line>
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteBackup(
                                            backup.id,
                                            backup.name
                                          )
                                        }
                                        disabled={isLoading}
                                        className="p-2 rounded-lg transition-all duration-300 hover:bg-[var(--error-color)]20 disabled:opacity-50"
                                        title="Delete"
                                        style={{ color: "var(--error-color)" }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polyline points="3 6 5 6 21 6"></polyline>
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "configure" && (
                  <div>
                    {/* Add Configuration Button */}
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => {
                          setEditingConfig(null);
                          setShowConfigModal(true);
                        }}
                        disabled={isLoading}
                        className="px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "#ffffff",
                        }}
                      >
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
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Configuration
                      </button>
                    </div>

                    {/* Loading State */}
                    {isLoading && schedules.length === 0 ? (
                      <div
                        className="rounded-lg p-8 flex justify-center items-center"
                        style={{
                          backgroundColor: "var(--background-secondary)",
                          boxShadow: "var(--card-shadow)",
                        }}
                      >
                        <div className="text-center">
                          <div
                            className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
                            style={{ borderColor: "var(--primary-color)" }}
                          ></div>
                          <p
                            className="mt-4"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Loading configurations...
                          </p>
                        </div>
                      </div>
                    ) : schedules.length === 0 ? (
                      /* Empty State */
                      <div
                        className="rounded-lg p-8 flex flex-col justify-center items-center text-center h-[calc(100vh_-_235px)]"
                        style={{
                          backgroundColor: "var(--background-secondary)",
                          boxShadow: "var(--card-shadow)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--text-secondary)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        </svg>
                        <h2
                          className="mb-3 mt-5 text-2xl font-bold"
                          style={{ color: "var(--text-color)" }}
                        >
                          No Configurations Found
                        </h2>
                        <p
                          className="mb-6 max-w-2xl"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          You haven't configured any automated backups yet.
                          Click "Add Configuration" to set up your first backup
                          schedule.
                        </p>
                      </div>
                    ) : (
                      /* Configuration List */
                      <div
                        className="rounded-lg overflow-hidden"
                        style={{
                          backgroundColor: "var(--background-secondary)",
                          boxShadow: "var(--card-shadow)",
                        }}
                      >
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr
                                style={{
                                  backgroundColor: "var(--background)",
                                  borderBottom: "1px solid var(--border-color)",
                                }}
                              >
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Display Name
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Destination
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Frequency
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Last Backup
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Next Backup
                                </th>
                                <th
                                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              style={{
                                backgroundColor: "var(--background-secondary)",
                              }}
                            >
                              {schedules.map((config, index) => (
                                <tr
                                  key={config.id}
                                  style={{
                                    borderBottom:
                                      index !== schedules.length - 1
                                        ? "1px solid var(--border-color)"
                                        : "none",
                                  }}
                                  className="hover:bg-[var(--background)] transition-colors duration-200"
                                >
                                  <td
                                    className="px-6 py-4 text-sm font-medium"
                                    style={{ color: "var(--text-color)" }}
                                  >
                                    {config.display_name || "New Configuration"}
                                  </td>
                                  <td
                                    className="px-6 py-4 text-sm"
                                    style={{ color: "var(--text-color)" }}
                                  >
                                    <span
                                      className="px-2 py-1 text-xs rounded-full"
                                      style={{
                                        backgroundColor:
                                          "var(--primary-color)20",
                                        color: "var(--primary-color)",
                                      }}
                                    >
                                      {config.backup_destination
                                        ?.replace("_", " ")
                                        .toUpperCase()}
                                    </span>
                                  </td>
                                  <td
                                    className="px-6 py-4 text-sm capitalize"
                                    style={{ color: "var(--text-color)" }}
                                  >
                                    {config.backup_frequency}
                                  </td>
                                  <td
                                    className="px-6 py-4 whitespace-nowrap text-sm"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {formatDate(config.last_backup_date)}
                                  </td>
                                  <td
                                    className="px-6 py-4 whitespace-nowrap text-sm"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {formatDate(config.next_backup_date)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() =>
                                          handleEditConfiguration(config)
                                        }
                                        className="p-2 rounded-lg transition-all duration-300 hover:bg-[var(--background)]"
                                        title="Edit"
                                        style={{
                                          color: "var(--primary-color)",
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteConfiguration(
                                            config.id,
                                            config.display_name
                                          )
                                        }
                                        disabled={isLoading}
                                        className="p-2 rounded-lg transition-all duration-300 hover:bg-[var(--error-color)]20 disabled:opacity-50"
                                        title="Delete"
                                        style={{ color: "var(--error-color)" }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polyline points="3 6 5 6 21 6"></polyline>
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Backup Configuration Modal */}
      <BackupConfigModal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setEditingConfig(null);
        }}
        onSave={handleSaveConfiguration}
        instanceId={selectedInstance?.id}
        editConfig={editingConfig}
      />
    </div>
  );
}

export default withInstanceGuard(BackupPage);
