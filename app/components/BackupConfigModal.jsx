'use client';
import React, { useState, useEffect } from 'react';
import { showInfo } from '@/lib/swal';

const BackupConfigModal = ({ isOpen, onClose, onSave, instanceId, editConfig = null }) => {
  const [formData, setFormData] = useState({
    backup_destination: '',
    backup_frequency: 'daily',
    notify_user: false,
    auto_remove: false,
    days_to_remove: 30,
    // Local Storage
    backup_path: '',
    // FTP
    ftp_host: '',
    ftp_port: '21',
    ftp_user: '',
    ftp_password: '',
    ftp_path: '',
    // SFTP
    sftp_host: '',
    sftp_port: '22',
    sftp_user: '',
    sftp_password: '',
    sftp_path: '',
        // Google Drive
        gdrive_client_key: '',
        gdrive_client_secret: '',
        gdrive_redirect_uri: '',
        gdrive_access_token: '',
        gdrive_refresh_token: '',
        gdrive_token_validity: '',
        google_drive_folder_key: '',
        // Dropbox
        dropbox_client_key: '',
        dropbox_client_secret: '',
        dropbox_refresh_token: '',
        dropbox_folder: '',
    // NextCloud
    domain: '',
    next_cloud_user_name: '',
    next_cloud_password: '',
    nextcloud_folder_key: '',
    // Amazon S3
    aws_access_key: '',
    aws_secret_access_key: '',
    bucket_file_name: '',
    aws_folder_name: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const destinationOptions = [
    { value: 'ftp', label: 'FTP' },
    { value: 'sftp', label: 'SFTP' },
    { value: 'google_drive', label: 'Google Drive' },
    { value: 'dropbox', label: 'Dropbox' },
    { value: 'next_cloud', label: 'NextCloud' },
    { value: 'amazon_s3', label: 'Amazon S3' },
  ];

  useEffect(() => {
    if (editConfig) {
      // Merge with default values to ensure all fields are defined
      // Map backend field names to frontend field names
      setFormData({
        backup_destination: editConfig.backup_destination || editConfig.destination || '',
        backup_frequency: editConfig.backup_frequency || editConfig.frequency || 'daily',
        notify_user: editConfig.notify_user ?? false,
        auto_remove: editConfig.auto_remove ?? editConfig.auto_prune ?? false,
        days_to_remove: editConfig.days_to_remove ?? editConfig.days_to_keep ?? editConfig.keep_days ?? 30,
        // Local Storage
        backup_path: editConfig.backup_path || '',
        // FTP
        ftp_host: editConfig.ftp_host || '',
        ftp_port: editConfig.ftp_port || '21',
        ftp_user: editConfig.ftp_user || '',
        ftp_password: editConfig.ftp_password || '',
        ftp_path: editConfig.ftp_path || '',
        // SFTP
        sftp_host: editConfig.sftp_host || '',
        sftp_port: editConfig.sftp_port || '22',
        sftp_user: editConfig.sftp_user || '',
        sftp_password: editConfig.sftp_password || '',
        sftp_path: editConfig.sftp_path || '',
        // Google Drive
        gdrive_client_key: editConfig.gdrive_client_key || '',
        gdrive_client_secret: editConfig.gdrive_client_secret || '',
        gdrive_redirect_uri: editConfig.gdrive_redirect_uri || '',
        gdrive_access_token: editConfig.gdrive_access_token || '',
        gdrive_refresh_token: editConfig.gdrive_refresh_token || '',
        gdrive_token_validity: editConfig.gdrive_token_validity || '',
        google_drive_folder_key: editConfig.google_drive_folder_key || '',
        // Dropbox
        dropbox_client_key: editConfig.dropbox_client_key || '',
        dropbox_client_secret: editConfig.dropbox_client_secret || '',
        dropbox_refresh_token: editConfig.dropbox_refresh_token || '',
        dropbox_folder: editConfig.dropbox_folder || '',
        // NextCloud
        domain: editConfig.domain || '',
        next_cloud_user_name: editConfig.next_cloud_user_name || '',
        next_cloud_password: editConfig.next_cloud_password || '',
        nextcloud_folder_key: editConfig.nextcloud_folder_key || '',
        // Amazon S3
        aws_access_key: editConfig.aws_access_key || '',
        aws_secret_access_key: editConfig.aws_secret_access_key || '',
        bucket_file_name: editConfig.bucket_file_name || '',
        aws_folder_name: editConfig.aws_folder_name || '',
      });
    } else {
      // Reset to default values when creating new config
      setFormData({
        backup_destination: '',
        backup_frequency: 'daily',
        notify_user: false,
        auto_remove: false,
        days_to_remove: 30,
        backup_path: '',
        ftp_host: '',
        ftp_port: '21',
        ftp_user: '',
        ftp_password: '',
        ftp_path: '',
        sftp_host: '',
        sftp_port: '22',
        sftp_user: '',
        sftp_password: '',
        sftp_path: '',
        gdrive_client_key: '',
        gdrive_client_secret: '',
        gdrive_redirect_uri: '',
        gdrive_access_token: '',
        gdrive_refresh_token: '',
        gdrive_token_validity: '',
        google_drive_folder_key: '',
        dropbox_client_key: '',
        dropbox_client_secret: '',
        dropbox_refresh_token: '',
        dropbox_folder: '',
        domain: '',
        next_cloud_user_name: '',
        next_cloud_password: '',
        nextcloud_folder_key: '',
        aws_access_key: '',
        aws_secret_access_key: '',
        bucket_file_name: '',
        aws_folder_name: '',
      });
    }
  }, [editConfig]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper to ensure value is never undefined
  const getValue = (fieldName) => {
    return formData[fieldName] || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    // TODO: Implement test connection API call
    setTimeout(() => {
      setTestingConnection(false);
      showInfo('Test connection functionality coming soon');
    }, 1000);
  };

  const handleOAuthSetup = (provider) => {
    // TODO: Implement OAuth setup
    showInfo(`${provider} OAuth setup coming soon`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="rounded-lg max-w-4xl w-full my-8 transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
              {editConfig ? 'Edit Backup Configuration' : 'Create Backup Configuration'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--background)] transition-colors duration-300"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Backup Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Backup Destination *
                </label>
                <select
                  name="backup_destination"
                  value={formData.backup_destination || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <option value="">Select Destination</option>
                  {destinationOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Backup Frequency *
                </label>
                <select
                  name="backup_frequency"
                  value={formData.backup_frequency || 'daily'}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Storage-Specific Fields */}
            <div className="space-y-4">
              {/* Local Storage */}
              {formData.backup_destination === 'local' && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                    Backup Path
                  </label>
                  <input
                    type="text"
                    name="backup_path"
                    value={formData.backup_path || ''}
                    onChange={handleChange}
                    placeholder="/path/to/backup/directory"
                    className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                </div>
              )}

              {/* FTP */}
              {formData.backup_destination === 'ftp' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      FTP Host *
                    </label>
                    <input
                      type="text"
                      name="ftp_host"
                      value={formData.ftp_host || ''}
                      onChange={handleChange}
                      required
                      placeholder="ftp.example.com"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      FTP Port *
                    </label>
                    <input
                      type="text"
                      name="ftp_port"
                      value={formData.ftp_port || ''}
                      onChange={handleChange}
                      required
                      placeholder="21"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      FTP User *
                    </label>
                    <input
                      type="text"
                      name="ftp_user"
                      value={formData.ftp_user || ''}
                      onChange={handleChange}
                      required
                      placeholder="username"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      FTP Password *
                    </label>
                    <input
                      type="password"
                      name="ftp_password"
                      value={formData.ftp_password || ''}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      FTP Path
                    </label>
                    <input
                      type="text"
                      name="ftp_path"
                      value={formData.ftp_path || ''}
                      onChange={handleChange}
                      placeholder="/backups"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                    >
                      {testingConnection ? 'Testing...' : 'Test Connection'}
                    </button>
                  </div>
                </div>
              )}

              {/* SFTP */}
              {formData.backup_destination === 'sftp' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      SFTP Host *
                    </label>
                    <input
                      type="text"
                      name="sftp_host"
                      value={formData.sftp_host || ''}
                      onChange={handleChange}
                      required
                      placeholder="sftp.example.com"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      SFTP Port *
                    </label>
                    <input
                      type="text"
                      name="sftp_port"
                      value={formData.sftp_port || ''}
                      onChange={handleChange}
                      required
                      placeholder="22"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      SFTP User *
                    </label>
                    <input
                      type="text"
                      name="sftp_user"
                      value={formData.sftp_user || ''}
                      onChange={handleChange}
                      required
                      placeholder="username"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      SFTP Password *
                    </label>
                    <input
                      type="password"
                      name="sftp_password"
                      value={formData.sftp_password || ''}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      SFTP Path
                    </label>
                    <input
                      type="text"
                      name="sftp_path"
                      value={formData.sftp_path || ''}
                      onChange={handleChange}
                      placeholder="/backups"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                    >
                      {testingConnection ? 'Testing...' : 'Test Connection'}
                    </button>
                  </div>
                </div>
              )}

              {/* Google Drive */}
              {formData.backup_destination === 'google_drive' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Client ID *
                    </label>
                    <input
                      type="text"
                      name="gdrive_client_key"
                      value={formData.gdrive_client_key || ''}
                      onChange={handleChange}
                      required
                      placeholder="Google Drive Client ID"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Client Secret *
                    </label>
                    <input
                      type="password"
                      name="gdrive_client_secret"
                      value={formData.gdrive_client_secret || ''}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Redirect URI *
                    </label>
                    <input
                      type="text"
                      name="gdrive_redirect_uri"
                      value={formData.gdrive_redirect_uri || ''}
                      onChange={handleChange}
                      required
                      placeholder="http://localhost:8069/token/success"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Folder ID
                    </label>
                    <input
                      type="text"
                      name="google_drive_folder_key"
                      value={formData.google_drive_folder_key || ''}
                      onChange={handleChange}
                      placeholder="Google Drive Folder ID"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => handleOAuthSetup('Google Drive')}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                      style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                    >
                      Setup OAuth Token
                    </button>
                  </div>
                </div>
              )}

              {/* Dropbox */}
              {formData.backup_destination === 'dropbox' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Client ID *
                    </label>
                    <input
                      type="text"
                      name="dropbox_client_key"
                      value={formData.dropbox_client_key || ''}
                      onChange={handleChange}
                      required
                      placeholder="Dropbox Client ID"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Client Secret *
                    </label>
                    <input
                      type="password"
                      name="dropbox_client_secret"
                      value={formData.dropbox_client_secret || ''}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Folder Path
                    </label>
                    <input
                      type="text"
                      name="dropbox_folder"
                      value={formData.dropbox_folder || ''}
                      onChange={handleChange}
                      placeholder="/Backups"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => handleOAuthSetup('Dropbox')}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                      style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                    >
                      Setup OAuth Token
                    </button>
                  </div>
                </div>
              )}

              {/* NextCloud */}
              {formData.backup_destination === 'next_cloud' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      NextCloud Domain *
                    </label>
                    <input
                      type="text"
                      name="domain"
                      value={formData.domain || ''}
                      onChange={handleChange}
                      required
                      placeholder="https://nextcloud.example.com"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Username *
                    </label>
                    <input
                      type="text"
                      name="next_cloud_user_name"
                      value={formData.next_cloud_user_name || ''}
                      onChange={handleChange}
                      required
                      placeholder="username"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Password *
                    </label>
                    <input
                      type="password"
                      name="next_cloud_password"
                      value={formData.next_cloud_password || ''}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Folder Path
                    </label>
                    <input
                      type="text"
                      name="nextcloud_folder_key"
                      value={formData.nextcloud_folder_key || ''}
                      onChange={handleChange}
                      placeholder="/Backups"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                    >
                      {testingConnection ? 'Testing...' : 'Test Connection'}
                    </button>
                  </div>
                </div>
              )}

              {/* Amazon S3 */}
              {formData.backup_destination === 'amazon_s3' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Access Key *
                    </label>
                    <input
                      type="text"
                      name="aws_access_key"
                      value={formData.aws_access_key || ''}
                      onChange={handleChange}
                      required
                      placeholder="AWS Access Key"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Secret Access Key *
                    </label>
                    <input
                      type="password"
                      name="aws_secret_access_key"
                      value={formData.aws_secret_access_key || ''}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Bucket Name *
                    </label>
                    <input
                      type="text"
                      name="bucket_file_name"
                      value={formData.bucket_file_name || ''}
                      onChange={handleChange}
                      required
                      placeholder="my-backup-bucket"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Folder Name
                    </label>
                    <input
                      type="text"
                      name="aws_folder_name"
                      value={formData.aws_folder_name || ''}
                      onChange={handleChange}
                      placeholder="backups"
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                    >
                      {testingConnection ? 'Testing...' : 'Test Connection'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                Additional Options
              </h3>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="auto_remove"
                  id="auto_remove"
                  checked={!!formData.auto_remove}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--primary-color)' }}
                />
                <label htmlFor="auto_remove" className="text-sm" style={{ color: 'var(--text-color)' }}>
                  Automatically remove old backups
                </label>
              </div>

              {formData.auto_remove && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                    Remove After (Days)
                  </label>
                  <input
                    type="number"
                    name="days_to_remove"
                    value={formData.days_to_remove || 30}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="notify_user"
                  id="notify_user"
                  checked={!!formData.notify_user}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--primary-color)' }}
                />
                <label htmlFor="notify_user" className="text-sm" style={{ color: 'var(--text-color)' }}>
                  Send email notification on backup completion
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.backup_destination}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
              >
                {isLoading ? 'Saving...' : editConfig ? 'Update Configuration' : 'Create Configuration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BackupConfigModal;

