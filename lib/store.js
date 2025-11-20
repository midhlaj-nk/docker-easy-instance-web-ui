/**
 * Zustand Store for Easy Instance Frontend
 * Simple, fast, and clean state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Direct API calls to backend - no proxy
// Read from environment variable, fallback to web.easyinstance.com
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

// ==================== AUTHENTICATION STORE ====================

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      // Actions
      initialize: () => {
        const state = get();
        if (state.token && state.user) {
          set({ isAuthenticated: true, isInitialized: true });
        } else {
          set({ isInitialized: true });
        }
      },
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.data.user,
            token: data.data.token,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
            error: null,
          });

          return { success: true, data: data.data };
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: error.message,
          });
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          set({
            user: data.data.user,
            token: data.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, data: data.data };
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: error.message,
          });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
          error: null,
        });
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return { success: false, error: 'No token to refresh' };

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Token refresh failed');
          }

          set({
            token: data.data.token,
            error: null,
          });

          return { success: true, data: data.data };
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          return { success: false, error: error.message };
        }
      },

      getCurrentUser: async () => {
        const { token } = get();
        if (!token) return { success: false, error: 'No token available' };

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to get user info');
          }

          set({
            user: data.data.user,
            error: null,
          });

          return { success: true, data: data.data };
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ==================== INSTANCES STORE ====================

export const useInstancesStore = create(
  persist(
    (set, get) => ({
  // State
  instances: [],
  overviewData: {},
  selectedInstance: null,
  isLoading: false,
  error: null,
  viewMode: 'grid', // 'grid' or 'list'
  filters: {
    search: '',
    status: 'all', // 'all', 'deployed', 'stopped'
    version: 'all', // 'all', 'odoo_17', 'odoo_18', etc.
  },

  // Actions
  fetchInstances: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/user/instances`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch instances');
      }

      set({
        instances: data.data.instances || [],
        isLoading: false,
        error: null,
      });

      return { success: true, data: data.data };
    } catch (error) {
      set({
        instances: [],
        isLoading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  createInstance: async (instanceData) => {
    set({ isLoading: true, error: null });
    
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/user/instances`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instanceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create instance');
      }

      // Add new instance to the list
      set((state) => ({
        instances: [...state.instances, data.data.instance],
        isLoading: false,
        error: null,
      }));

      return { success: true, data: data.data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  updateInstance: async (instanceId, updateData) => {
    set({ isLoading: true, error: null });
    
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/user/instances/${instanceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update instance');
      }

      // Update instance in the list
      set((state) => ({
        instances: state.instances.map(instance =>
          instance.id === instanceId ? { ...instance, ...data.data.instance } : instance
        ),
        isLoading: false,
        error: null,
      }));

      return { success: true, data: data.data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  deleteInstance: async (instanceId) => {
    set({ isLoading: true, error: null });
    
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/user/instances/${instanceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete instance');
      }

      // Remove instance from the list
      set((state) => ({
        instances: state.instances.filter(instance => instance.id !== instanceId),
        isLoading: false,
        error: null,
      }));

      return { success: true, data: data.data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  },

         getInstanceDetail: async (instanceId) => {
           set({ isLoading: true, error: null });
           
           try {
             const { token } = useAuthStore.getState();
             const response = await fetch(`${API_BASE_URL}/api/v1/instances/detail?id=${instanceId}`, {
               method: 'GET',
               headers: {
                 'Authorization': `Bearer ${token}`,
                 'Content-Type': 'application/json',
               },
             });
     
             const data = await response.json();
     
             if (!response.ok) {
               throw new Error(data.message || 'Failed to fetch instance details');
             }
     
             return { success: true, data: data.data };
           } catch (error) {
             set({ error: error.message });
             return { success: false, error: error.message };
           } finally {
             set({ isLoading: false });
           }
         },

         getInstancesOverview: async () => {
           set({ isLoading: true, error: null });
           
           try {
             const { token } = useAuthStore.getState();
             const response = await fetch(`${API_BASE_URL}/api/v1/instances/overview`, {
               method: 'GET',
               headers: {
                 'Authorization': `Bearer ${token}`,
                 'Content-Type': 'application/json',
               },
             });
     
             const data = await response.json();
     
             if (!response.ok) {
               throw new Error(data.message || 'Failed to fetch instances overview');
             }
     
             set({ overviewData: data.data, isLoading: false, error: null });
             return { success: true, data: data.data };
           } catch (error) {
             set({ error: error.message, isLoading: false });
             return { success: false, error: error.message };
           }
         },

  setSelectedInstance: (instance) => set({ selectedInstance: instance }),
  clearSelectedInstance: () => set({ selectedInstance: null }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  clearError: () => set({ error: null }),

  // Computed values
  getFilteredInstances: () => {
    const { instances, filters } = get();
    return instances.filter(instance => {
      const matchesSearch = !filters.search || 
        instance.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        instance.version.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'deployed' && instance.deployed) ||
        (filters.status === 'stopped' && !instance.deployed);
      
      const matchesVersion = filters.version === 'all' || 
        instance.version.toLowerCase().includes(filters.version.toLowerCase());

      return matchesSearch && matchesStatus && matchesVersion;
    });
  },
    }),
    {
      name: 'instances-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedInstance: state.selectedInstance,
      }),
    }
  )
);

// ==================== METRICS STORE ====================

export const useMetricsStore = create((set, get) => ({
  // State
  metrics: {},
  isLoading: false,
  error: null,
  selectedTimeRange: '1h', // '1h', '6h', '24h', '7d'
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds

  // Actions
  fetchMetrics: async (instanceId, timeRange = '1h') => {
    set({ isLoading: true, error: null });
    
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/metrics/instances/${instanceId}/combined?range=${timeRange}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch metrics');
      }

      set((state) => ({
        metrics: {
          ...state.metrics,
          [instanceId]: data.data,
        },
        isLoading: false,
        error: null,
      }));

      return { success: true, data: data.data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  setTimeRange: (timeRange) => set({ selectedTimeRange: timeRange }),
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
  clearError: () => set({ error: null }),
}));

// ==================== GIT MANAGER STORE ====================

// ==================== LOGS STORE ====================

export const useLogsStore = create((set, get) => ({
  // State
  logs: [],
  podName: null,
  isLoading: false,
  error: null,
  autoRefresh: true,
  refreshInterval: 5000, // 5 seconds

  // Actions
  fetchPodName: async (instanceId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/pod-name`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.pod_name && data.pod_name !== 'Error') {
        set({ podName: data.pod_name, isLoading: false, error: null });
        return { success: true, data: data.pod_name };
      } else {
        throw new Error('Pod name not available');
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  fetchLogs: async (instanceName, podName) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/instance/log/${instanceName}/${podName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const logData = await response.text();
      
      if (logData && logData.trim()) {
        const logLines = logData.split('\n').map(line => line.trim()).filter(line => line);
        set({ logs: logLines, isLoading: false, error: null });
        return { success: true, data: logLines };
      } else {
        set({ logs: [], isLoading: false, error: null });
        return { success: true, data: [] };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
  clearLogs: () => set({ logs: [] }),
  clearError: () => set({ error: null }),
}));

// ==================== BACKUP STORE ====================

export const useBackupStore = create((set, get) => ({
  // State
  backups: [],
  schedules: [],
  isLoading: false,
  error: null,

  // Actions
  fetchBackups: async (instanceId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backups`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch backups');
      }

      set({ backups: data.data.backups || [], isLoading: false, error: null });
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  createBackup: async (instanceId, backupData) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backups/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create backup');
      }

      set((state) => ({ 
        backups: [...state.backups, data.data.backup],
        isLoading: false, 
        error: null 
      }));
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  restoreBackup: async (instanceId, backupId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backups/${backupId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to restore backup');
      }

      set({ isLoading: false, error: null });
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  deleteBackup: async (instanceId, backupId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backups/${backupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete backup');
      }

      set((state) => ({ 
        backups: state.backups.filter(b => b.id !== backupId),
        isLoading: false, 
        error: null 
      }));
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Backup Configuration Actions
  fetchBackupConfigurations: async (instanceId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backup-config`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch backup configurations');
      }

      set({ schedules: data.data.configurations || [], isLoading: false, error: null });
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  getBackupConfiguration: async (instanceId, configId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backup-config/${configId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch configuration');
      }

      set({ isLoading: false, error: null });
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  createBackupConfiguration: async (instanceId, configData) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backup-config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create configuration');
      }

      set((state) => ({ 
        schedules: [...state.schedules, data.data],
        isLoading: false, 
        error: null 
      }));
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  updateBackupConfiguration: async (instanceId, configId, configData) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backup-config/${configId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update configuration');
      }

      set((state) => ({ 
        schedules: state.schedules.map(s => s.id === configId ? data.data : s),
        isLoading: false, 
        error: null 
      }));
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  deleteBackupConfiguration: async (instanceId, configId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/backup-config/${configId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete configuration');
      }

      set((state) => ({ 
        schedules: state.schedules.filter(s => s.id !== configId),
        isLoading: false, 
        error: null 
      }));
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  clearError: () => set({ error: null }),
}));

// ==================== SHELL STORE ====================

export const useShellStore = create((set, get) => ({
  // State
  isConnected: false,
  sessionId: null,
  error: null,

  // Actions
  setConnected: (connected) => set({ isConnected: connected }),
  setSessionId: (sessionId) => set({ sessionId }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// ==================== DOMAINS STORE ====================

export const useDomainsStore = create((set, get) => ({
  // State
  domains: [],
  isLoading: false,
  error: null,

  // Actions
  fetchDomains: async (instanceId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/domains`, {
        method: 'GET',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch domains');
      }

      set({ domains: data.data.domains || [], isLoading: false, error: null });
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  createDomain: async (instanceId, domainData) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/domains`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(domainData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create domain');
      }

      set((state) => ({ 
        domains: [...state.domains, data.data.domain],
        isLoading: false, 
        error: null 
      }));
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  deleteDomain: async (instanceId, domainId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/domains/${domainId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete domain');
      }

      set((state) => ({ 
        domains: state.domains.filter(d => d.id !== domainId),
        isLoading: false, 
        error: null 
      }));
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  clearError: () => set({ error: null }),
}));

// ==================== SETTINGS STORE ====================

export const useSettingsStore = create((set, get) => ({
  // State
  instanceSettings: null,
  isLoading: false,
  error: null,

  // Actions
  fetchSettings: async (instanceId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch settings');
      }

      set({ instanceSettings: data.data.settings, isLoading: false, error: null });
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  updateSettings: async (instanceId, settingsData) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      set({ instanceSettings: data.data.settings, isLoading: false, error: null });
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  deleteInstance: async (instanceId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/user/instances/${instanceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete instance');
      }

      set({ isLoading: false, error: null });
      return { success: true, data: data.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  clearError: () => set({ error: null }),
}));

// ==================== UI STORE ====================

export const useUIStore = create(
  persist(
    (set, get) => ({
      // State
      sidebarOpen: false,
      theme: 'light', // 'light' or 'dark'
      notifications: [],
      modals: {
        createInstance: false,
        deleteInstance: false,
        settings: false,
      },

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setTheme: (theme) => {
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
        set({ theme });
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        set({ theme: newTheme });
      },
      
      initializeTheme: () => {
        const { theme } = get();
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now() }],
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),

  clearNotifications: () => set({ notifications: [] }),

  openModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: true },
  })),

  closeModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: false },
  })),

      closeAllModals: () => set({
        modals: {
          createInstance: false,
          deleteInstance: false,
          settings: false,
        },
      }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

// ==================== API UTILITIES ====================

export const apiClient = {
  baseURL: API_BASE_URL, // Direct calls to backend

  async request(endpoint, options = {}) {
    const { token } = useAuthStore.getState();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          const refreshResult = await useAuthStore.getState().refreshToken();
          if (!refreshResult.success) {
            useAuthStore.getState().logout();
            throw new Error('Session expired. Please login again.');
          }
          // Retry the original request with new token
          return this.request(endpoint, options);
        }
        throw new Error(data.message || 'Request failed');
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  get: (endpoint, options = {}) => this.request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data, options = {}) => this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, options = {}) => this.request(endpoint, { ...options, method: 'DELETE' }),
};

// ==================== GIT MANAGER STORE ====================

export const useGitStore = create((set, get) => ({
  repoInfo: null,
  collaborators: [],
  invitations: [],
  isRepoEmpty: false,
  isLoading: false,
  error: null,
  
  fetchRepoInfo: async (instanceId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/git/repo-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.data?.isRepoEmpty) {
          set({ isRepoEmpty: true, repoInfo: false, isLoading: false });
        } else {
          set({ repoInfo: data.data?.repoInfo, isRepoEmpty: false, isLoading: false });
        }
      } else {
        set({ error: data.message || 'Failed to fetch repo info', isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchCollaborators: async (instanceId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/git/collaborators`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        set({ collaborators: data.data?.collaborators || [], invitations: data.data?.pending_invitations || [], isLoading: false });
      } else {
        set({ error: data.message || 'Failed to fetch collaborators', isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  addCollaborator: async (instanceId, username, permissions) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/git/collaborators/${username}/${permissions.join(',')}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        set({ isLoading: false });
        return { success: true, data };
      } else {
        set({ error: data.data?.msg || 'Failed to add collaborator', isLoading: false });
        return { success: false, data };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  removeCollaborator: async (instanceId, username) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/git/collaborators/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        set({ isLoading: false });
        return { success: true, data };
      } else {
        set({ error: data.message || 'Failed to remove collaborator', isLoading: false });
        return { success: false, data };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  removeInvitation: async (instanceId, username, invitationId) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/git/invitations/${username}/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        set({ isLoading: false });
        return { success: true, data };
      } else {
        set({ error: data.message || 'Failed to remove invitation', isLoading: false });
        return { success: false, data };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));

// ==================== STORE INITIALIZATION ====================

// Initialize stores on app start
export const initializeStores = () => {
  // Check if user is authenticated on app start
  const { token, isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated && token) {
    // Verify token is still valid
    useAuthStore.getState().getCurrentUser();
  }
};

// Export all stores for easy access
export const stores = {
  auth: useAuthStore,
  instances: useInstancesStore,
  metrics: useMetricsStore,
  git: useGitStore,
  logs: useLogsStore,
  backup: useBackupStore,
  shell: useShellStore,
  domains: useDomainsStore,
  settings: useSettingsStore,
  ui: useUIStore,
};
