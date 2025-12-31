"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import withInstanceGuard from "../components/withInstanceGuard";
import { useGitStore } from "@/lib/store";
import { useInstancesStore } from "@/lib/store";
import { showSuccess, showError, showWarning, showConfirm, showDeleteConfirm } from '@/lib/swal';

function GitManagerPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [showPermissions, setShowPermissions] = useState(false);
  const [adminPermission, setAdminPermission] = useState(false);

  const [permissions, setPermissions] = useState({
    push: false,
    pull: false,
  });

  const {
    repoInfo,
    collaborators,
    invitations,
    isRepoEmpty,
    isLoading,
    error,
    fetchRepoInfo,
    fetchCollaborators,
    addCollaborator,
    removeCollaborator,
    removeInvitation,
    clearError,
  } = useGitStore();
  const { selectedInstance: currentInstance } = useInstancesStore();

  const collaboratorInputRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (selectedInstance?.id) {
      fetchRepoInfo(selectedInstance.id);
      fetchCollaborators(selectedInstance.id);
    }
  }, [selectedInstance?.id]);

  const handleCollaboratorInputChange = (value) => {
    setNewCollaborator(value);
    setShowPermissions(value.trim().length > 0);

    if (!value.trim()) {
      setPermissions({ push: false, pull: false });
      setAdminPermission(false);
    }
  };

  const handleAdminPermissionChange = () => {
    setAdminPermission(!adminPermission);
    if (!adminPermission) {
      setPermissions({ push: false, pull: false });
    }
  };

  const handleAddCollaborator = async () => {
    if (!newCollaborator.trim()) {
      await showWarning("Please enter a GitHub username.", "Username Required");
      return;
    }

    // GitHub only supports single permission level: pull, push, or admin
    // push includes pull, so if push is selected, we just send "push"
    let permission = null;
    if (adminPermission) {
      permission = "admin";
    } else if (permissions.push) {
      permission = "push"; // push includes pull
    } else if (permissions.pull) {
      permission = "pull";
    }

    if (!permission) {
      await showWarning("Please select at least one permission.", "Permissions Required");
      return;
    }

    const result = await addCollaborator(
      selectedInstance.id,
      newCollaborator,
      [permission] // Send as array for consistency with store function
    );

    if (result.success) {
      setNewCollaborator("");
      setShowPermissions(false);
      setPermissions({ push: false, pull: false });
      setAdminPermission(false);
      fetchCollaborators(selectedInstance.id);

      // Show success message
      await showSuccess(result.msg || result.data?.msg || "Collaborator added successfully!", "Success");
    } else {
      // Show error message
      await showError(result.error || result.data?.msg || "Failed to add collaborator", "Error");
    }
  };

  const handleRemoveCollaborator = async (username) => {
    const result = await showDeleteConfirm(
      `Are you sure you want to remove ${username} as a collaborator?`,
      "Remove Collaborator"
    );
    
    if (!result.isConfirmed) return;
    
    const removeResult = await removeCollaborator(selectedInstance.id, username);
    if (removeResult.success) {
      fetchCollaborators(selectedInstance.id);
      await showSuccess("Collaborator removed successfully!", "Success");
    } else {
      await showError(removeResult.error || "Failed to remove collaborator", "Error");
    }
  };

  const handleRemoveInvitation = async (username, invitationId) => {
    const result = await showConfirm(
      `Are you sure you want to cancel the invitation for ${username}?`,
      "Cancel Invitation",
      "Yes, cancel it",
      "No"
    );
    
    if (!result.isConfirmed) return;
    
    const removeResult = await removeInvitation(
      selectedInstance.id,
      username,
      invitationId
    );
    if (removeResult.success) {
      fetchCollaborators(selectedInstance.id);
      await showSuccess("Invitation cancelled successfully!", "Success");
    } else {
      await showError(removeResult.error || "Failed to remove invitation", "Error");
    }
  };

  const openWebEditor = () => {
    // Get git owner from config - for now using default
    const gitOwner = "easy-instance"; // TODO: Get from config
    const repo = `${selectedInstance.name}-easyinstance`;
    window.open(`https://github.dev/${gitOwner}/${repo}`, "_blank");
  };

  return (
    <div className="dashboard-theme">
      <div className="bg-[var(--background)] transition-colors duration-300 min-h-screen font-sans">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex pt-16">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
          <div className="p-3">
            {/* Header with Code Editor Button */}
            {selectedInstance?.github_repo_url && (
              <div className="flex justify-end pt-3 mb-4">
                <button
                  onClick={openWebEditor}
                  className="btn-go-to-web-editor flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition duration-300 text-white"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Code Editor
                </button>
              </div>
            )}

            <div className="git_management-container mt-1">
              <section name="git_management" className="git_management pt-3">
                {/* Check if repo_url is false */}
                {!selectedInstance?.github_repo_url ? (
                  <div
                    className="rounded-lg p-8 md:p-12 lg:min-h-[calc(100vh_-_115px)] flex  transition-colors duration-300"
                    style={{
                      backgroundColor: "var(--background-secondary)",
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    <div className="cy-img-alert-container gap-2 flex items-center flex-col text-center">
                      <div className="img-container col-3">
                        <img
                          src="/easy_instance/static/src/img/github-mark-white.svg"
                          className="card-img"
                          alt="CI/CD Integration"
                          style={{ margin: "15px", filter: "invert(0.2)" }}
                        />
                      </div>
                      <div
                        className="alert-container p-4"
                        style={{ fontFamily: "var(--inter-sans)" }}
                      >
                        <div style={{ color: "var(--text-color)" }}>
                          <div
                            className="ei-alert-content text-base mb-4"
                            style={{
                              color: "var(--text-color)",
                              lineHeight: "1.6",
                            }}
                          >
                            Please contact the administrator to set up the
                            GitHub repository. Enabling custom addons will allow
                            for seamless management and integration of
                            additional functionalities tailored to your needs.
                          </div>
                          <ul
                            className="no-git-info-ul list-none p-0 ml-4 flex gap-6 justify-center mt-10 flex-row"
                            style={{ color: "var(--text-color)" }}
                          >
                            <li className="mb-2 flex items-center gap-2">
                              <span style={{ color: "var(--success-color)" }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"
                                  />
                                </svg>
                              </span>{" "}
                              Custom module deployment
                            </li>
                            <li className="mb-2 flex items-center gap-2">
                              <span style={{ color: "var(--success-color)" }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"
                                  />
                                </svg>
                              </span>{" "}
                              Custom module editing and committing
                            </li>
                            <li className="mb-2 flex items-center gap-2">
                              <span style={{ color: "var(--success-color)" }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"
                                  />
                                </svg>
                              </span>{" "}
                              Real-time updates
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Repository Information */}
                    <div
                      className="cc-card rounded-lg p-6 mb-6 transition-colors duration-300"
                      style={{
                        backgroundColor: "var(--background-secondary)",
                        boxShadow: "var(--card-shadow)",
                      }}
                    >
                      {selectedInstance?.github_repo_url && (
                        <div className="row">
                          <h5
                            className="repo-section-title text-lg font-semibold mb-4"
                            style={{ color: "var(--text-color)" }}
                          >
                            Repository Information
                          </h5>
                        </div>
                      )}

                      {/* Loading Animation */}
                      {isLoading && !repoInfo && !isRepoEmpty && (
                        <div className="loading-wrap mb-5 pt-5">
                          <div className="git-load">
                            <div className="git-letter-holder flex justify-center">
                              {[
                                "L",
                                "o",
                                "a",
                                "d",
                                "i",
                                "n",
                                "g",
                                ".",
                                ".",
                                ".",
                              ].map((letter, index) => (
                                <div
                                  key={index}
                                  className={`l-${index + 1
                                    } letter animate-bounce`}
                                  style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                  {letter}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Repository Link */}
                      <div className="git-link-wrapper flex align-items-center">
                        <div className="icon-container mr-3">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="w-6 h-6"
                            style={{ color: "var(--text-color)" }}
                          >
                            <path
                              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <a
                          href={selectedInstance?.github_repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono hover:underline"
                          style={{ color: "var(--text-color)" }}
                        >
                          {selectedInstance?.github_repo_url}
                        </a>
                      </div>

                      {/* Repository Stats */}
                      {repoInfo && (
                        <div className="repoInfo row no-gutters mb-5 border-top pt-5">
                          <div className="cy-stats-grid grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Git Commits */}
                            <div
                              className="tilt-box cy-stats-card rounded-lg p-6 text-center transition-colors duration-300"
                              style={{
                                backgroundColor: "var(--background)",
                                boxShadow: "var(--card-shadow)",
                              }}
                            >
                              <div className="tilt-box-contents">
                                <span
                                  className="box-content-text text-sm font-medium mb-2 block"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Number of Commits
                                </span>
                                <span
                                  className="box-content-number text-2xl font-bold"
                                  style={{ color: "var(--text-color)" }}
                                >
                                  {repoInfo.num_commits || 0}
                                </span>
                              </div>
                            </div>

                            {/* Git Size */}
                            <div
                              className="tilt-box cy-stats-card rounded-lg p-6 text-center transition-colors duration-300"
                              style={{
                                backgroundColor: "var(--background)",
                                boxShadow: "var(--card-shadow)",
                              }}
                            >
                              <div className="tilt-box-contents">
                                <span
                                  className="box-content-text text-sm font-medium mb-2 block"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Size
                                </span>
                                <div className="flex justify-center">
                                  <span
                                    className="box-content-number text-2xl font-bold"
                                    style={{ color: "var(--text-color)" }}
                                  >
                                    {repoInfo.size || 0} KB
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Git Last Updated */}
                            <div
                              className="tilt-box cy-stats-card git-last-updated-card rounded-lg p-6 text-center transition-colors duration-300"
                              style={{
                                backgroundColor: "var(--background)",
                                boxShadow: "var(--card-shadow)",
                              }}
                            >
                              <div className="tilt-box-contents">
                                <span
                                  className="box-content-text text-sm font-medium mb-2 block"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Last Updated
                                </span>
                                <span
                                  className="box-content-number git-last-updated-value text-2xl font-bold"
                                  style={{ color: "var(--text-color)" }}
                                >
                                  {repoInfo.last_updated || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Empty Repository State */}
                      {isRepoEmpty && (
                        <div className="emptyRepo no-gutters flex flex-col align-items-center justify-content-center text-center py-12">
                          <div className="text-6xl mb-4">📁</div>
                          <p
                            className="text-center empty-text text-lg font-medium"
                            style={{ color: "var(--text-color)" }}
                          >
                            Repository is Empty 🙇🏻‍♂️
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Git Collaborators */}
                    <div
                      className="cc-card rounded-lg p-6 transition-colors duration-300"
                      style={{
                        backgroundColor: "var(--background-secondary)",
                        boxShadow: "var(--card-shadow)",
                      }}
                    >
                      <div>
                        <h5
                          className="section-title text-lg font-semibold mb-2"
                          style={{ color: "var(--text-color)" }}
                        >
                          Git Collaborators
                        </h5>
                        <p
                          className="text-secondary gm-description text-sm mb-4"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Manage the collaborators for your Git repository.
                        </p>
                        <p
                          className="text-secondary gm-description text-sm mb-4"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          You can add collaborators by entering their GitHub
                          Username. Note that collaborators must have an
                          existing GitHub account to be added.
                        </p>
                      </div>

                      <div className="o_settings_section_panel">
                        <div className="form-group">
                          <form>
                            <div className="mb-3">
                              <div className="input-group gap-2 git-collab-input-wrapper flex flex-wrap">
                                <input
                                  type="text"
                                  ref={collaboratorInputRef}
                                  value={newCollaborator}
                                  onChange={(e) =>
                                    handleCollaboratorInputChange(
                                      e.target.value
                                    )
                                  }
                                  placeholder="git-username"
                                  className="form-control cy-gm-form-input git-collab-input flex-1 min-w-[250px] p-3 rounded-l-lg outline-none transition-colors duration-300"
                                  style={{
                                    backgroundColor: "var(--input-bg)",
                                    color: "var(--text-color)",
                                    border: "1px solid var(--border-color)",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={handleAddCollaborator}
                                  disabled={
                                    isLoading || !newCollaborator.trim()
                                  }
                                  className="btn btn-outline-secondary cy-gm-add-collab git-collab-btn text-sm px-6 py-3 rounded-r-lg font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                  style={{
                                    backgroundColor: "var(--primary-color)",
                                  }}
                                >
                                  {isLoading ? "Adding..." : "Add Collaborator"}
                                </button>
                              </div>
                            </div>

                            {/* Permissions Section */}
                            <div
                              className={`cy-gm-permissions transition-all duration-300 ${showPermissions
                                  ? "block opacity-100"
                                  : "hidden opacity-0"
                                }`}
                            >
                              <div className="cy-gm-permissions-header mb-3">
                                <span
                                  className="cy-gm-section-label text-md font-semibold"
                                  style={{ color: "var(--text-color)" }}
                                >
                                  Permissions
                                </span>
                              </div>
                              <div className="cy-gm-permissions-options">
                                <div className="cy-gm-permissions-row">
                                  {/* Toggle switch for Admin */}
                                  <div className="cy-gm-toggle-item mb-2">
                                    <label className="cy-gm-toggle flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        name="permission"
                                        value="admin"
                                        id="adminPermission"
                                        checked={adminPermission}
                                        onChange={handleAdminPermissionChange}
                                        className="sr-only"
                                      />
                                      <span
                                        className="cy-gm-toggle-slider relative inline-block w-12 h-6 rounded-full transition-colors duration-300"
                                        style={{
                                          backgroundColor: adminPermission
                                            ? "var(--primary-color)"
                                            : "var(--border-color)",
                                        }}
                                      >
                                        <span
                                          className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300 ${adminPermission
                                              ? "transform translate-x-6"
                                              : ""
                                            }`}
                                          style={{ backgroundColor: "white" }}
                                        ></span>
                                      </span>
                                      <span
                                        className="cy-gm-toggle-label ml-3"
                                        style={{ color: "var(--text-color)" }}
                                      >
                                        Admin
                                      </span>
                                    </label>
                                  </div>

                                  {/* Checkboxes for Push and Pull */}
                                  {!adminPermission && (
                                    <div className="cy-gm-checkbox-group flex gap-6">
                                      <label className="cy-gm-checkbox flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          name="permission"
                                          value="push"
                                          id="pushPermission"
                                          checked={permissions.push}
                                          onChange={(e) =>
                                            setPermissions({
                                              ...permissions,
                                              push: e.target.checked,
                                            })
                                          }
                                          className="w-4 h-4 rounded"
                                        />
                                        <span
                                          className="cy-gm-checkbox-label ml-2"
                                          style={{ color: "var(--text-color)" }}
                                        >
                                          Push
                                        </span>
                                      </label>
                                      <label className="cy-gm-checkbox flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          name="permission"
                                          value="pull"
                                          id="pullPermission"
                                          checked={permissions.pull}
                                          onChange={(e) =>
                                            setPermissions({
                                              ...permissions,
                                              pull: e.target.checked,
                                            })
                                          }
                                          className="w-4 h-4 rounded"
                                        />
                                        <span
                                          className="cy-gm-checkbox-label ml-2"
                                          style={{ color: "var(--text-color)" }}
                                        >
                                          Pull
                                        </span>
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </form>

                          {/* Collaborators List */}
                          {collaborators.length > 0 && (
                            <div className="mt-6">
                              <p
                                className="text-secondary gm-description text-sm mb-3"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                collaborator
                              </p>
                              <div className="domain-list mb-3 space-y-2">
                                {collaborators.map((collaborator) => (
                                  <div
                                    key={collaborator.id}
                                    className="domain-item flex items-center justify-between p-3 rounded-lg transition-colors duration-300"
                                    style={{
                                      backgroundColor: "var(--background)",
                                      border: "1px solid var(--border-color)",
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      {collaborator.avatar_url && (
                                        <img
                                          src={collaborator.avatar_url}
                                          alt={collaborator.login}
                                          className="w-8 h-8 rounded-full"
                                        />
                                      )}
                                      <span
                                        className="section-title font-medium"
                                        style={{ color: "var(--text-color)" }}
                                      >
                                        {collaborator.login}
                                      </span>
                                      <div className="flex gap-1">
                                        {collaborator.permissions &&
                                          Object.entries(
                                            collaborator.permissions
                                          ).map(
                                            ([permission, hasPermission]) =>
                                              hasPermission && (
                                                <span
                                                  key={permission}
                                                  className="github-permission-badge px-2 py-0.5 text-xs rounded-full"
                                                  style={{
                                                    backgroundColor:
                                                      "var(--primary-color)20",
                                                    color:
                                                      "var(--primary-color)",
                                                  }}
                                                >
                                                  {permission.charAt(0).toUpperCase() + permission.slice(1)}
                                                </span>
                                              )
                                          )}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleRemoveCollaborator(
                                          collaborator.login
                                        )
                                      }
                                      className="delete-button p-2 rounded-lg transition-colors duration-300 hover:bg-red-100"
                                      style={{ color: "var(--error-color)" }}
                                    >
                                      🗑
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pending Invitations */}
                          {invitations.length > 0 && (
                            <div className="mt-6">
                              <p
                                className="text-secondary gm-description text-sm mb-3"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Invitations
                              </p>
                              <div className="domain-list mt-3 space-y-2">
                                {invitations.map((invitation) => (
                                  <div
                                    key={invitation.id}
                                    className="domain-item flex items-center justify-between p-3 rounded-lg transition-colors duration-300"
                                    style={{
                                      backgroundColor: "var(--warning-color)10",
                                      border: "1px solid var(--warning-color)",
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span
                                        className="section-title font-medium"
                                        style={{ color: "var(--text-color)" }}
                                      >
                                        {invitation.invitee?.login ||
                                          invitation.login}
                                      </span>
                                      <div className="flex gap-2">
                                        <span
                                          className="github-permission-badge px-2 py-0.5 text-xs rounded-full"
                                          style={{
                                            backgroundColor:
                                              "var(--warning-color)20",
                                            color: "var(--warning-color)",
                                          }}
                                        >
                                          {invitation.permissions}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleRemoveInvitation(
                                          invitation.invitee?.login ||
                                          invitation.login,
                                          invitation.id
                                        )
                                      }
                                      className="delete-button p-2 rounded-lg transition-colors duration-300 hover:bg-red-100"
                                      style={{ color: "var(--error-color)" }}
                                    >
                                      🗑
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
}

export default withInstanceGuard(GitManagerPage);
