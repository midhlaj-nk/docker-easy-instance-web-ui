import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useInstancesStore } from "@/lib/store";

function InstanceCard({
  id,
  name,
  version,
  deployed,
  uptime,
  cpuRequest,
  memoryRequest,
  storageUsed,
  lastBackup,
  licenseExpiry,
  logo,
  overviewData, // New prop for real data
  github_repo_url,
}) {
  const { getInstanceDetail } = useInstancesStore();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null; // Invalid date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper to format uptime
  const formatUptime = (uptimeValue) => {
    if (!uptimeValue) return '0d 0h 0m';
    
    // If it's already a string with d/h/m, assume it's formatted
    if (typeof uptimeValue === 'string' && (uptimeValue.includes('d') || uptimeValue.includes('h') || uptimeValue.includes('m'))) {
      return uptimeValue;
    }
    
    // If it's a number (seconds) or string number, format it
    const seconds = Number(uptimeValue);
    if (isNaN(seconds) || seconds <= 0) return '0d 0h 0m';
    
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Helper to format memory (RAM) - converts g/m to GB/MB
  const formatMemory = (memoryValue) => {
    if (!memoryValue) return 'N/A';
    
    const str = String(memoryValue).trim();
    const match = str.match(/^([\d.]+)([a-zA-Z]+)$/);
    
    if (!match) return memoryValue; // Return as-is if format is unexpected
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    // Convert to readable format
    if (unit === 'g' || unit === 'gb') {
      return value % 1 === 0 ? `${Math.round(value)} GB` : `${value.toFixed(1)} GB`;
    } else if (unit === 'm' || unit === 'mb') {
      return value % 1 === 0 ? `${Math.round(value)} MB` : `${value.toFixed(1)} MB`;
    } else if (unit === 'k' || unit === 'kb') {
      return value % 1 === 0 ? `${Math.round(value)} KB` : `${value.toFixed(1)} KB`;
    }
    
    return memoryValue;
  };

  // Helper to format storage - shows MB until 1GB, then GB
  const formatStorage = (storageValue) => {
    if (!storageValue) return '0 MB';
    
    // Handle string values like "0Gi", "10Gi", "500Mi", etc.
    const str = String(storageValue).trim();
    const match = str.match(/^([\d.]+)([a-zA-Z]+)$/);
    
    if (!match) return storageValue; // Return as-is if format is unexpected
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    // Convert everything to MB first
    let valueInMB = 0;
    if (unit === 'gi' || unit === 'gb') {
      valueInMB = value * 1024;
    } else if (unit === 'mi' || unit === 'mb') {
      valueInMB = value;
    } else if (unit === 'ki' || unit === 'kb') {
      valueInMB = value / 1024;
    } else {
      // Unknown unit, return as-is
      return storageValue;
    }
    
    // If less than 1024 MB, show in MB, otherwise show in GB
    if (valueInMB < 1024) {
      return `${Math.round(valueInMB)} MB`;
    } else {
      const valueInGB = valueInMB / 1024;
      // Show 1 decimal place for GB if needed, otherwise round
      return valueInGB % 1 === 0 ? `${Math.round(valueInGB)} GB` : `${valueInGB.toFixed(1)} GB`;
    }
  };

  // Helper to get license status text and color
  const getLicenseStatus = () => {
    const data = overviewData || {};

    // Check if instance is on trial (no subscription but has trial_end_date)
    const isTrial = data.is_trial || (data.trial_end_date && !data.subscription_end_date);
    
    if (isTrial && data.trial_end_date) {
      const trialEndDate = new Date(data.trial_end_date);
      const now = new Date();
      const daysLeft = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysLeft < 0) {
        return { text: 'Trial Expired', color: 'text-[var(--error-color)]' };
      } else if (daysLeft === 0) {
        return { text: 'Trial: Expires today', color: 'text-[var(--warning-color)]' };
      } else if (daysLeft === 1) {
        return { text: 'Trial: 1 day left', color: 'text-[var(--warning-color)]' };
      } else {
        return { text: `Trial: ${daysLeft} days left`, color: 'text-[var(--warning-color)]' };
      }
    }

    // If no trial but has subscription
    if (data.subscription_end_date) {
      return { text: `Expires: ${formatDate(data.subscription_end_date)}`, color: 'text-[var(--text-color)]' };
    }

    // Legacy license expiry field
    if (licenseExpiry && licenseExpiry !== "false" && licenseExpiry !== "No License") {
      return { text: licenseExpiry, color: 'text-[var(--text-color)]' };
    }

    // No subscription and no trial
    return { text: 'No Subscription', color: 'text-[var(--text-secondary)]' };
  };

  const licenseStatus = getLicenseStatus();

  const handleClick = () => {
    if (isNavigating) return; // Prevent multiple clicks

    setIsNavigating(true);
    // Store the selected instance data in the store for the metrics page
    const instanceData = {
      id,
      name,
      instance: name, // Add instance field for API calls
      version,
      deployed,
      uptime: overviewData?.uptime || uptime,
      cpuRequest: overviewData?.cpu_usage || cpuRequest,
      memoryRequest: overviewData?.memory_usage || memoryRequest,
      storageUsed: overviewData?.pvc_used || storageUsed,
      lastBackup: overviewData?.last_backup || lastBackup,
      licenseExpiry,
      logo: overviewData?.logo || logo,
      status: overviewData?.status || (deployed ? 'deployed' : 'draft'),
      instance_url: overviewData?.instance_url || '',
      github_repo_url,
    };

    // Store the selected instance data
    const { setSelectedInstance } = useInstancesStore.getState();
    setSelectedInstance(instanceData);

    // Navigate immediately without API call
    router.push('/metrics');

    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed': return 'bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white';
      case 'draft': return 'bg-slate-500 text-white dark:bg-slate-600 dark:text-white';
      case 'container_created': return 'bg-amber-500 text-white dark:bg-amber-600 dark:text-white';
      case 'maintenance_required': return 'bg-rose-500 text-white dark:bg-rose-600 dark:text-white';
      default: return 'bg-slate-500 text-white dark:bg-slate-600 dark:text-white';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'deployed': return 'Running';
      case 'draft': return 'Draft';
      case 'container_created': return 'Onboarding';
      case 'maintenance_required': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  return (
    <div className="h-full">
      <button
        onClick={handleClick}
        disabled={isNavigating}
        className={`glass-card flex flex-col p-5 w-full text-left cursor-pointer h-full relative overflow-hidden group
             ${isNavigating ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {/* Hover Highlight */}
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Header */}
        <div className="flex items-start justify-between mb-5 w-full">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-bold truncate text-[var(--text-color)]">{name}</h3>
              {isNavigating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary-color)]"></div>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[var(--input-bg)] text-[var(--text-secondary)]">
                v{version}
              </span>
            </div>
          </div>
          {/* Status Badge - Right Side */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${getStatusColor(overviewData?.status || (deployed ? 'deployed' : 'draft'))}`}>
            {getStatusLabel(overviewData?.status || (deployed ? 'deployed' : 'draft'))}
          </div>
        </div>

        {/* Uptime */}
        <div className="mb-4 pb-4 border-b border-[var(--border-color)] w-full">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Uptime</span>
            <span className="text-sm font-semibold font-mono text-[var(--text-color)]">
              {formatUptime(overviewData?.uptime || uptime)}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 w-full">
          {/* CPU Request */}
          <div className="p-3 rounded-lg bg-[var(--input-bg)] transition-colors group-hover:bg-opacity-80">
            <div className="flex items-center space-x-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="text-xs font-medium text-[var(--text-secondary)]">CPU</span>
            </div>
            <p className="text-sm font-bold text-[var(--text-color)]">{overviewData?.cpu_usage || cpuRequest}</p>
          </div>

          {/* Memory Request */}
          <div className="p-3 rounded-lg bg-[var(--input-bg)] transition-colors group-hover:bg-opacity-80">
            <div className="flex items-center space-x-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-[var(--success-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs font-medium text-[var(--text-secondary)]">RAM</span>
            </div>
            <p className="text-sm font-bold text-[var(--text-color)]">{formatMemory(overviewData?.memory_usage || memoryRequest)}</p>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-2 w-full mt-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <span>Storage</span>
            </div>
            <span className="font-medium text-[var(--text-color)]">
              {formatStorage(overviewData?.pvc_used || '0Gi')} <span className="text-[var(--text-secondary)]">/ {formatStorage(overviewData?.pvc_size || overviewData?.pvc_available || storageUsed || '0Gi')}</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Backup</span>
            </div>
            <span className="font-medium text-[var(--text-color)]">
              {(() => {
                const backupDate = overviewData?.last_backup || lastBackup;
                if (!backupDate || backupDate === 'No Backup' || backupDate === 'No Backups') {
                  return 'No Backups';
                }
                const formatted = formatDate(backupDate);
                return formatted || 'No Backups';
              })()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>License</span>
            </div>
            <span className={`font-medium ${licenseStatus.color}`}>
              {licenseStatus.text}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}

export default InstanceCard;
