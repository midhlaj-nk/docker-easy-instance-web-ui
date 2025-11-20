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
}) {
  const { getInstanceDetail } = useInstancesStore();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

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
      instance_url: overviewData?.instance_url || ''
    };
    
    // Store the selected instance data
    const { setSelectedInstance } = useInstancesStore.getState();
    setSelectedInstance(instanceData);
    
    // Navigate immediately without API call
    router.push('/metrics');
    
    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 1000);
  };
  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isNavigating}
        className={`flex flex-col rounded-xl p-6 border border-transparent hover:border-[var(--primary-color)]
             transition-all duration-300 w-full text-left cursor-pointer
             ${isNavigating ? 'opacity-75 cursor-not-allowed' : ''}`}
        style={{ 
          backgroundColor: 'var(--background-secondary)', 
          boxShadow: 'var(--card-shadow)' 
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>{name}</h3>
              {isNavigating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary-color)]"></div>
              )}
            </div>
                 <div className="flex items-center space-x-3">
                   <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Version: {version}</span>
                   <div className={`flex items-center px-3 py-1 rounded-2xl ${
                     overviewData?.status === 'deployed' ? 'bg-emerald-500' : 
                     overviewData?.status === 'draft' ? 'bg-gray-500' : 
                     overviewData?.status === 'container_created' ? 'bg-yellow-500' : 'bg-red-500'
                   }`}>
                     <span className="text-xs font-medium text-white">
                       {overviewData?.status === 'deployed' ? 'Deployed' : 
                        overviewData?.status === 'draft' ? 'Draft' : 
                        overviewData?.status === 'container_created' ? 'Onboarding' : 
                        overviewData?.status === 'maintenance_required' ? 'Maintenance' : 'Unknown'}
                     </span>
                   </div>
                 </div>
          </div>

          {/* Logo/Icon */}
          {overviewData?.logo ? (
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src={overviewData.logo} 
                alt={`${name} logo`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full items-center justify-center rounded-lg" style={{display: 'none', backgroundColor: 'var(--input-bg)'}}>
                <span className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
                  {name.charAt(0)}
                </span>
              </div>
            </div>
          ) : logo ? (
            <div className="text-xl font-bold" style={{ color: 'var(--text-secondary)' }}>{logo}</div>
          ) : (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--input-bg)' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--text-secondary)' }}
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.5 19a4.5 4.5 0 0 0 0-9 5.5 5.5 0 1 0-9.5 4.5" />
                <path d="M12 17v.01" />
                <path d="M9 17v.01" />
                <path d="M15 17v.01" />
              </svg>
            </div>
          )}
        </div>

              {/* Uptime */}
              <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Uptime</span>
                  <span className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>{overviewData?.uptime || '0d 0h 0m'}</span>
                </div>
              </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* CPU Request */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--input-bg)' }}>
            <div className="flex items-center space-x-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--primary-color)' }}
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
              </svg>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                CPU Request
              </span>
            </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>{overviewData?.cpu_usage || cpuRequest}</p>
          </div>

          {/* Memory Request */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--input-bg)' }}>
            <div className="flex items-center space-x-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--success-color)' }}
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
              </svg>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Memory Request
              </span>
            </div>
            <p className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>{overviewData?.memory_usage || memoryRequest}</p>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--text-secondary)' }}
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <circle cx="7.5" cy="17.5" r="1.5" />
                <circle cx="16.5" cy="17.5" r="1.5" />
                <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Storage Used</span>
            </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>
                    {overviewData?.pvc_used || '0Gi'} - {overviewData?.pvc_available || storageUsed}
                  </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--text-secondary)' }}
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Last Backup</span>
            </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>
                    {overviewData?.last_backup || lastBackup}
                  </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--text-secondary)' }}
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="7.5" cy="15.5" r="3.5" />
                <path d="M10 15.5h8m-2-2v4" />
                <path d="M19 15.5a4 4 0 1 0-4-4" />
              </svg>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>License Expiry</span>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: licenseExpiry === "false" ? 'var(--error-color)' : 'var(--text-color)' }}
            >
              {licenseExpiry === "false" ? "No License" : licenseExpiry}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}

export default InstanceCard;
