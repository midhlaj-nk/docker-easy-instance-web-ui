'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';
import { useDomainsStore } from '@/lib/store';
import logger from '@/lib/logger';

function DomainManagementPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [showApexModal, setShowApexModal] = useState(false);
  const [apexDomainData, setApexDomainData] = useState({
    hostname: '',
    enableSSL: false,
    sslCert: null,
    sslKey: null,
    certExpiry: '',
  });
  const [subDomain, setSubDomain] = useState('easyinstance.com');
  const [showHowToModal, setShowHowToModal] = useState(false);

  const { domains, isLoading, error, fetchDomains, createDomain, deleteDomain, clearError } = useDomainsStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (selectedInstance?.id) {
      fetchDomains(selectedInstance.id).catch(err => {
        logger.error('Failed to fetch domains:', err);
      });
    }
  }, [selectedInstance?.id]);

  // Get subdomain from configuration (you might need to fetch this from your config)
  useEffect(() => {
    // This should be fetched from your configuration
    setSubDomain('easyinstance.com');
  }, []);

  const handleAddCustomDomain = async () => {
    if (!customDomain.trim()) {
      alert('Please enter a domain name');
      return;
    }

    // Validate subdomain like in Odoo
    if (!customDomain.includes(subDomain)) {
      alert(`Please add "${subDomain}" as part of the domain.`);
      return;
    }

    // Check if domain already exists
    const existingDomain = domains.find(d => d.name === customDomain);
    if (existingDomain) {
      alert('Domain must be unique!');
      return;
    }

    const result = await createDomain(selectedInstance.id, {
      name: customDomain,
      is_default_domain: false,
      is_apex_domain: false,
    });

    if (result.success) {
      setCustomDomain('');
      alert('Domain created successfully!');
    } else {
      alert(`Failed to add domain: ${result.error}`);
    }
  };

  const handleAddApexDomain = async () => {
    if (!apexDomainData.hostname.trim()) {
      alert('Please enter a hostname');
      return;
    }

    if (apexDomainData.enableSSL && (!apexDomainData.sslCert || !apexDomainData.sslKey)) {
      alert('Please provide both SSL certificate and key');
      return;
    }

    const result = await createDomain(selectedInstance.id, {
      name: apexDomainData.hostname,
      is_default_domain: false,
      is_apex_domain: true,
      enable_ssl: apexDomainData.enableSSL,
      ssl_certificate: apexDomainData.sslCert,
      ssl_key: apexDomainData.sslKey,
      cert_expiry: apexDomainData.certExpiry,
    });

    if (result.success) {
      setShowApexModal(false);
      setApexDomainData({
        hostname: '',
        enableSSL: false,
        sslCert: null,
        sslKey: null,
        certExpiry: '',
      });
      alert('Apex domain created successfully!');
    } else {
      alert(`Failed to add apex domain: ${result.error}`);
    }
  };

  const handleDeleteDomain = async (domainId, domainName) => {
    if (domains.length === 1) {
      alert('Warning: Only one domain cannot be deleted!');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete this domain?`);
    if (!confirmed) return;

    const result = await deleteDomain(selectedInstance.id, domainId);
    if (!result.success) {
      alert(`Failed to delete domain: ${result.error}`);
    }
  };

  const handleFileRead = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 part
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSSLCertChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await handleFileRead(file);
      setApexDomainData({ ...apexDomainData, sslCert: base64 });
    }
  };

  const handleSSLKeyChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await handleFileRead(file);
      setApexDomainData({ ...apexDomainData, sslKey: base64 });
    }
  };

  const handleSSLToggle = () => {
    setApexDomainData({ ...apexDomainData, enableSSL: !apexDomainData.enableSSL });
  };

  return (
    <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex mt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:pl-[17rem]">
          <div className="p-6 ">
            <div className="rounded-lg bg-white p-8 lg:h-[calc(100vh_-_115px)] flex">
              <section>
                {/* Custom Domains Section */}
                <div className="mb-5" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="mb-4">
                    <h5 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                      Custom Domains
                    </h5>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Associate a domain with your instance.
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      You can use <span className="font-mono">*.{subDomain}</span> or your own domain.
                      Note that with your own domain, you have to configure the DNS entries accordingly.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <form>
                      <div className="mb-3">
                        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          <span className="font-mono">*.{subDomain}</span>
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customDomain}
                            onChange={(e) => setCustomDomain(e.target.value)}
                            placeholder={`your-domain.${subDomain}`}
                            className="flex-1 px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                            style={{
                              backgroundColor: 'var(--input-bg)',
                              color: 'var(--text-color)',
                              border: '1px solid var(--border-color)',
                            }}
                          />
                          <button
                            onClick={handleAddCustomDomain}
                            disabled={isLoading || !customDomain.trim()}
                            className="cursor-pointer text-sm px-6 py-3 rounded-md font-medium transition-all duration-300 bg-[var(--primary-color)] text-white hover:bg-[#454685] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Domain
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Warning Alert */}
                    {domains.length === 1 && (
                      <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                        Warning: Only one domain cannot be deleted!
                      </div>
                    )}

                    {/* Domains List */}
                    <div className="space-y-2">
                      {domains.filter(d => !d.is_apex_domain).map((domain) => (
                        <div
                          key={domain.id}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}
                        >
                          <span className="font-medium" style={{ color: 'var(--text-color)' }}>
                            {domain.name}
                            {domain.is_default_domain && (
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: 'var(--primary-color)20', color: 'var(--primary-color)' }}>
                                Default
                              </span>
                            )}
                          </span>
                          {!domain.is_default_domain && (
                            <button
                              onClick={() => handleDeleteDomain(domain.id, domain.name)}
                              disabled={isLoading}
                              className="p-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                              style={{ color: 'var(--error-color)', border: '1px solid var(--error-color)' }}
                            >
                              🗑
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apex Domains Section */}
                <div className="mb-5 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="mb-4">
                    <h5 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                      Apex Domains
                    </h5>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Associate a domain with your instance.
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Note that with your own domain, you have to configure the DNS entries accordingly.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <form>
                      <div className="mb-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowApexModal(true)}
                            className="cursor-pointer text-sm px-6 py-3 rounded-md font-medium transition-all duration-300 bg-[var(--primary-color)] text-white hover:bg-[#454685] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Domain
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Warning Alert */}
                    {domains.filter(d => d.is_apex_domain).length === 1 && (
                      <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                        Warning: Only one domain cannot be deleted!
                      </div>
                    )}

                    {/* Apex Domains List */}
                    <div className="space-y-2">
                      {domains.filter(d => d.is_apex_domain).map((domain) => (
                        <div
                          key={domain.id}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}
                        >
                          <span className="font-medium" style={{ color: 'var(--text-color)' }}>
                            {domain.name}
                            {domain.enable_ssl && (
                              <span className="ml-2">🔒 SSL Enabled</span>
                            )}
                          </span>
                          <button
                            onClick={() => handleDeleteDomain(domain.id, domain.name)}
                            disabled={isLoading}
                            className="p-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                            style={{ color: 'var(--error-color)', border: '1px solid var(--error-color)' }}
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => setShowHowToModal(true)}
                        className="text-sm underline transition-colors duration-300"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        How to set up my domain?
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Apex Domain Modal */}
      {showApexModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg p-6 max-w-lg w-full my-8 transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>
                Add Domain
              </h3>
              <button
                onClick={() => setShowApexModal(false)}
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: 'var(--text-color)' }}
              >
                ×
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Host Name
                </label>
                <input
                  type="text"
                  value={apexDomainData.hostname}
                  onChange={(e) => setApexDomainData({ ...apexDomainData, hostname: e.target.value })}
                  placeholder="Enter host name"
                  className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={apexDomainData.enableSSL}
                    onChange={handleSSLToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                  Enable SSL
                </span>
              </div>

              {apexDomainData.enableSSL && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                        Upload SSL Certificate
                      </label>
                      <input
                        type="file"
                        accept=".crt,.pem"
                        onChange={handleSSLCertChange}
                        className="w-full px-4 py-2 rounded-lg transition-colors duration-300"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-color)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                        Upload SSL Private Key
                      </label>
                      <input
                        type="file"
                        accept=".key,.pem"
                        onChange={handleSSLKeyChange}
                        className="w-full px-4 py-2 rounded-lg transition-colors duration-300"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-color)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                      Certificate Expiry Date
                    </label>
                    <input
                      type="date"
                      value={apexDomainData.certExpiry}
                      onChange={(e) => setApexDomainData({ ...apexDomainData, certExpiry: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                </>
              )}
            </form>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApexModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
              >
                Close
              </button>
              <button
                onClick={handleAddApexDomain}
                disabled={isLoading || !apexDomainData.hostname.trim()}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How To Modal */}
      {showHowToModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg p-6 max-w-lg w-full my-8 transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>
                Domain Configuration
              </h3>
              <button
                onClick={() => setShowHowToModal(false)}
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: 'var(--text-color)' }}
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <p className="mb-2" style={{ color: 'var(--text-color)' }}>
                Perform the following operations in your domain manager:
              </p>
              <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li>
                  Create a CNAME record www.yourdomain.com pointing to{' '}
                  <span className="font-mono">{selectedInstance?.instance_url}</span> and IP address
                </li>
                <li>
                  If you want to use the naked domain (e.g. yourdomain.com), you need to redirect yourdomain.com to www.yourdomain.com.
                </li>
              </ul>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowHowToModal(false)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withInstanceGuard(DomainManagementPage);