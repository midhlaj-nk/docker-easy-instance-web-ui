import React from "react";
import { useRouter } from "next/navigation";
import { useInstancesStore } from "@/lib/store";

function InstanceTable({ instances, overviewData }) {
  const router = useRouter();
  const { setSelectedInstance } = useInstancesStore();

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper to format memory (RAM) - converts g/m to GB/MB
  const formatMemory = (memoryValue) => {
    if (!memoryValue) return 'N/A';
    const str = String(memoryValue).trim();
    const match = str.match(/^([\d.]+)([a-zA-Z]+)$/);
    if (!match) return memoryValue;
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 'g' || unit === 'gb') {
      return value % 1 === 0 ? `${Math.round(value)} GB` : `${value.toFixed(1)} GB`;
    } else if (unit === 'm' || unit === 'mb') {
      return value % 1 === 0 ? `${Math.round(value)} MB` : `${value.toFixed(1)} MB`;
    } else if (unit === 'k' || unit === 'kb') {
      return value % 1 === 0 ? `${Math.round(value)} KB` : `${value.toFixed(1)} KB`;
    }
    return memoryValue;
  };

  // Helper to format storage
  const formatStorage = (storageValue) => {
    if (!storageValue) return '0 MB';
    const str = String(storageValue).trim();
    const match = str.match(/^([\d.]+)([a-zA-Z]+)$/);
    if (!match) return storageValue;
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    let valueInMB = 0;
    if (unit === 'gi' || unit === 'gb') {
      valueInMB = value * 1024;
    } else if (unit === 'mi' || unit === 'mb') {
      valueInMB = value;
    } else if (unit === 'ki' || unit === 'kb') {
      valueInMB = value / 1024;
    } else {
      return storageValue;
    }
    if (valueInMB < 1024) {
      return `${Math.round(valueInMB)} MB`;
    } else {
      const valueInGB = valueInMB / 1024;
      return valueInGB % 1 === 0 ? `${Math.round(valueInGB)} GB` : `${valueInGB.toFixed(1)} GB`;
    }
  };

  // Helper to format uptime
  const formatUptime = (uptimeValue) => {
    if (!uptimeValue) return '0d 0h 0m';
    if (typeof uptimeValue === 'string' && (uptimeValue.includes('d') || uptimeValue.includes('h') || uptimeValue.includes('m'))) {
      return uptimeValue;
    }
    const seconds = Number(uptimeValue);
    if (isNaN(seconds) || seconds <= 0) return '0d 0h 0m';
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Helper to get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'deployed': { label: 'Running', color: 'bg-emerald-500 text-white' },
      'draft': { label: 'Draft', color: 'bg-slate-500 text-white' },
      'container_created': { label: 'Onboarding', color: 'bg-amber-500 text-white' },
      'maintenance_required': { label: 'Maintenance', color: 'bg-rose-500 text-white' },
    };
    const statusInfo = statusMap[status] || { label: 'Unknown', color: 'bg-slate-500 text-white' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Helper to get license status
  const getLicenseStatus = (instance, data) => {
    if (data?.is_trial && data?.trial_end_date) {
      const trialEndDate = new Date(data.trial_end_date);
      const now = new Date();
      const daysLeft = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0) return { text: 'Trial Expired', color: 'text-red-500' };
      if (daysLeft === 0) return { text: 'Trial: Expires today', color: 'text-amber-500' };
      if (daysLeft === 1) return { text: 'Trial: 1 day left', color: 'text-amber-500' };
      return { text: `Trial: ${daysLeft} days left`, color: 'text-amber-500' };
    }
    if (data?.subscription_end_date) {
      return { text: `Expires: ${formatDate(data.subscription_end_date)}`, color: 'text-[var(--text-color)]' };
    }
    return { text: 'No Subscription', color: 'text-[var(--text-secondary)]' };
  };

  const handleRowClick = (instance) => {
    const data = overviewData[instance.id] || {};
    const instanceData = {
      id: instance.id,
      name: instance.name,
      instance: instance.name,
      version: instance.version,
      deployed: instance.deployed,
      uptime: data.uptime || instance.uptime,
      cpuRequest: data.cpu_usage || instance.cpuRequest,
      memoryRequest: data.memory_usage || instance.memoryRequest,
      storageUsed: data.pvc_used || instance.storageUsed,
      lastBackup: data.last_backup || instance.lastBackup,
      licenseExpiry: instance.licenseExpiry,
      logo: data.logo || instance.logo,
      status: data.status || (instance.deployed ? 'deployed' : 'draft'),
      instance_url: data.instance_url || instance.url || '',
      github_repo_url: instance.github_repo_url,
    };
    setSelectedInstance(instanceData);
    router.push('/metrics');
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--input-bg)] border-b border-[var(--border-color)]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Instance
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                CPU
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                RAM
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Storage
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Uptime
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Backup
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                License
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {instances.map((instance) => {
              const data = overviewData[instance.id] || {};
              const licenseStatus = getLicenseStatus(instance, data);
              const backupDate = data.last_backup || instance.lastBackup;
              const backupText = !backupDate || backupDate === 'No Backup' || backupDate === 'No Backups' 
                ? 'No Backups' 
                : (formatDate(backupDate) || 'No Backups');

              return (
                <tr
                  key={instance.id}
                  onClick={() => handleRowClick(instance)}
                  className="hover:bg-[var(--input-bg)] cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[var(--text-color)]">
                      {instance.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(data.status || (instance.deployed ? 'deployed' : 'draft'))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {instance.version}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[var(--text-color)]">
                      {data.cpu_usage || instance.cpuRequest || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[var(--text-color)]">
                      {formatMemory(data.memory_usage || instance.memoryRequest)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[var(--text-color)]">
                      {formatStorage(data.pvc_used || '0Gi')} / {formatStorage(data.pvc_size || data.pvc_available || instance.storageUsed || '0Gi')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-[var(--text-color)]">
                      {formatUptime(data.uptime || instance.uptime)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[var(--text-color)]">
                      {backupText}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${licenseStatus.color}`}>
                      {licenseStatus.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstanceTable;

