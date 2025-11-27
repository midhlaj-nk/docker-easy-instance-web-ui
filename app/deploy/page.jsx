'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '../components/AuthGuard';
import { useAuthStore } from '@/lib/store';
import { useInstancesStore } from '@/lib/store';
import logger from '@/lib/logger';
import { showWarning, showError } from '@/lib/swal';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8017';

function DeployPageContent() {
  const router = useRouter();
  const { user, token, isAuthenticated, isInitialized } = useAuthStore();
  const { selectedInstance } = useInstancesStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [helmCharts, setHelmCharts] = useState([]);
  const [existingDomains, setExistingDomains] = useState([]);
  const [subDomain, setSubDomain] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deploymentTasks, setDeploymentTasks] = useState([
    { id: 1, text: 'Allocating server space', status: 'pending' },
    { id: 2, text: 'Initializing the server', status: 'pending' },
    { id: 3, text: 'Installing the template', status: 'pending' },
    { id: 4, text: 'Configuring the server', status: 'pending' },
    { id: 5, text: 'Domain mapping', status: 'pending' },
  ]);

  const [formData, setFormData] = useState({
    instance: '',
    loginEmail: '',
    loginPassword: '',
    helmChartId: '',
    needCustomAddons: true,
  });

  const [validation, setValidation] = useState({
    instanceName: { isValid: true, message: '', isDuplicate: false },
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
  });
  const [touched, setTouched] = useState({ email: false, password: false });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [deployedInstanceUrl, setDeployedInstanceUrl] = useState('');

  // Add state for name availability checking
  const [nameAvailability, setNameAvailability] = useState({
    checking: false,
    available: null,
    message: '',
    fullDomain: ''
  });

  const steps = [
    { id: 1, title: 'Select Template', description: 'Choose your template' },
    { id: 2, title: 'Manage Options', description: 'Configure your instance' },
    { id: 3, title: 'Release Build', description: 'Deploy your project' },
  ];

  // Load initial data
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const controller = new AbortController();

    const loadInitialData = async () => {
      try {
        setIsLoading(true);

        // Fetch helm charts (templates) - use /api/v1/helm-charts (GET) instead of /public/api/helm-charts (POST only)
        const baseUrl = (API_BASE_URL || 'https://web.easyinstance.com').replace(/\/api\/?$/, '').replace(/\/$/, '');
        const helmChartsUrl = `${baseUrl}/api/v1/helm-charts`;

        logger.log('Fetching helm charts from:', helmChartsUrl);

        const helmResponse = await fetch(helmChartsUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (helmResponse.ok && isMounted) {
          let helmData;
          const contentType = helmResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            helmData = await helmResponse.json();
          } else {
            const textResponse = await helmResponse.text();
            throw new Error(`Server returned non-JSON response (${helmResponse.status}): ${textResponse.substring(0, 100)}`);
          }

          logger.log('Helm charts loaded:', helmData);

          if (helmData.success && helmData.data) {
            setHelmCharts(helmData.data || []);
          } else {
            logger.warn('Helm charts response format unexpected:', helmData);
            setHelmCharts(helmData.data || helmData || []);
          }
        } else if (isMounted) {
          let errorData = {};
          try {
            const contentType = helmResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              errorData = await helmResponse.json();
            }
          } catch (e) {
            // Ignore parsing errors
          }
          logger.error('Failed to fetch helm charts:', { status: helmResponse.status, error: errorData });
        }

        // Fetch existing domains if a selected instance exists
        if (selectedInstance?.id) {
          const baseUrl = (API_BASE_URL || 'https://web.easyinstance.com').replace(/\/api\/?$/, '').replace(/\/$/, '');
          const domainsUrl = `${baseUrl}/api/v1/instances/${selectedInstance.id}/domains`;
          const domainsResponse = await fetch(domainsUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });

          if (domainsResponse.ok && isMounted) {
            const domainsData = await domainsResponse.json();
            logger.log('Domains loaded:', domainsData);
            setExistingDomains(domainsData.data || []);
          }
        }

        // Fetch subdomain config from backend
        const configResponse = await fetch(`${API_BASE_URL}/api/v1/config/subdomain`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (configResponse.ok && isMounted) {
          const configData = await configResponse.json();
          logger.log('Subdomain config loaded:', configData);
          if (configData.success && configData.data?.subdomain) {
            setSubDomain(configData.data.subdomain);
          } else {
            logger.warn('No subdomain found in response:', configData);
          }
        } else {
          logger.error('Failed to fetch subdomain config:', configResponse.status);
        }

      } catch (error) {
        if (error.name === 'AbortError') return; // Ignore abort errors
        if (isMounted) {
          logger.error('Error loading initial data:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isAuthenticated, token, selectedInstance?.id]);

  // Function to check instance name availability
  const checkInstanceNameAvailability = async (instanceName) => {
    if (!instanceName || instanceName.length < 3) {
      setNameAvailability({
        checking: false,
        available: null,
        message: 'Instance name must be at least 3 characters',
        fullDomain: ''
      });
      return;
    }

    // Validate instance name format (lowercase letters, numbers, hyphens only)
    const validNameRegex = /^[a-z0-9-]+$/;
    if (!validNameRegex.test(instanceName)) {
      setNameAvailability({
        checking: false,
        available: false,
        message: 'Only lowercase letters, numbers, and hyphens allowed',
        fullDomain: ''
      });
      return;
    }

    setNameAvailability(prev => ({ ...prev, checking: true, message: 'Checking availability...' }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/check-availability?name=${instanceName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();
      logger.log('Name availability response:', data);

      if (response.ok && data.success) {
        const fullDomain = subDomain ? `https://${instanceName}.${subDomain}` : '';
        setNameAvailability({
          checking: false,
          available: data.data.available,
          message: data.data.available ? 'Instance name is available!' : 'Instance name is already taken.',
          fullDomain
        });

        // Update form validation
        setValidation(prev => ({
          ...prev,
          instanceName: {
            isValid: data.data.available,
            message: data.data.available ? '' : 'This instance name is already taken',
            isDuplicate: !data.data.available
          }
        }));
      } else {
        const errorMessage = data.error?.message || 'Error checking availability';
        logger.error('Name availability check failed:', errorMessage);
        setNameAvailability({
          checking: false,
          available: false,
          message: errorMessage,
          fullDomain: ''
        });
      }
    } catch (error) {
      logger.error('Name availability check error:', error);
      setNameAvailability({
        checking: false,
        available: false,
        message: 'Network error checking availability. Please try again.',
        fullDomain: ''
      });

      // Reset validation on error
      setValidation(prev => ({
        ...prev,
        instanceName: {
          isValid: false,
          message: 'Unable to verify availability',
          isDuplicate: false
        }
      }));
    }
  };

  // Debounced name check function
  const debouncedNameCheck = useRef(null);

  // Handle instance name input change
  const handleInstanceNameChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setFormData(prev => ({ ...prev, instance: value }));

    // Clear previous timeout
    if (debouncedNameCheck.current) {
      clearTimeout(debouncedNameCheck.current);
    }

    // Debounce the availability check
    debouncedNameCheck.current = setTimeout(() => {
      if (value.length >= 3) {
        checkInstanceNameAvailability(value);
      }
    }, 500);
  };

  // Validate instance name format
  const validateInstanceName = (value) => {
    const regex = /^[a-z0-9-]+$/;

    if (!value) {
      return { isValid: false, message: 'Instance name is required', isDuplicate: false };
    }

    if (!regex.test(value)) {
      return {
        isValid: false,
        message: 'Only lowercase letters, numbers, and hyphens allowed',
        isDuplicate: false
      };
    }

    if (value.length < 3) {
      return {
        isValid: false,
        message: 'Instance name must be at least 3 characters',
        isDuplicate: false
      };
    }

    return { isValid: true, message: '', isDuplicate: false };
  };

  // Validate email
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      return { isValid: false, message: 'Email is required' };
    }

    if (!emailRegex.test(value)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }

    return { isValid: true, message: '' };
  };

  // Validate password
  const validatePassword = (value) => {
    if (!value) {
      return { isValid: false, message: 'Password is required' };
    }

    if (value.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters' };
    }

    return { isValid: true, message: '' };
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setSelectedTemplateData(template);
    setFormData(prev => ({ ...prev, helmChartId: template.id }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change
    if (name === 'loginEmail') {
      setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'loginPassword') {
      setValidation(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  // Check if can proceed to next step
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== null;
      case 2:
        return (
          validation.instanceName.isValid &&
          validation.email.isValid &&
          validation.password.isValid &&
          formData.instance &&
          formData.loginEmail &&
          formData.loginPassword
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Handle next button
  const handleNext = async () => {
    if (currentStep === 1 && !selectedTemplate) {
      await showWarning('Please select a template version.');
      return;
    }

    if (currentStep === 2) {
      // Validate all fields before deploying
      const instanceValidation = validateInstanceName(formData.instance);
      const emailValidation = validateEmail(formData.loginEmail);
      const passwordValidation = validatePassword(formData.loginPassword);

      setValidation({
        instanceName: instanceValidation,
        email: emailValidation,
        password: passwordValidation,
      });

      if (!instanceValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid) {
        return;
      }

      // Start deployment
      handleDeploy();
      return;
    }

    if (canProceedToNext() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous button
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle deployment
  const handleDeploy = async () => {
    setCurrentStep(3);
    setIsDeploying(true);
    setDeployProgress(0);

    // Simulate progress bar animation
    const totalTime = 120000; // 2 minutes
    const intervalTime = 100;
    let elapsed = 0;
    const steps = 5;
    const stepInterval = totalTime / steps;

    const progressInterval = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min((elapsed / totalTime) * 100, 100);
      setDeployProgress(progress);

      // Update task status
      const currentTaskIndex = Math.floor(elapsed / stepInterval);
      if (currentTaskIndex < steps) {
        setDeploymentTasks(prev =>
          prev.map((task, index) => ({
            ...task,
            status: index < currentTaskIndex ? 'completed' :
              index === currentTaskIndex ? 'active' : 'pending'
          }))
        );
      }

      if (elapsed >= totalTime) {
        clearInterval(progressInterval);
        setDeploymentTasks(prev => prev.map(task => ({ ...task, status: 'completed' })));
      }
    }, intervalTime);

    try {
      // Prepare deployment data
      const deploymentData = {
        instance: formData.instance,
        login_email: formData.loginEmail,
        login_password: formData.loginPassword,
        helm_chart_id: formData.helmChartId,
        need_custom_addons: formData.needCustomAddons,
      };

      logger.log('Sending deployment data:', deploymentData);
      logger.log('Selected template data:', selectedTemplateData);

      // Create instance - direct backend call
      // Ensure API_BASE_URL doesn't already include /api or trailing slash
      const baseUrl = (API_BASE_URL || 'https://web.easyinstance.com').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const createUrl = `${baseUrl}/api/v1/instances/create`;

      logger.log('Creating instance - API_BASE_URL:', API_BASE_URL);
      logger.log('Creating instance - Final URL:', createUrl);

      const deployResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deploymentData),
      });

      if (deployResponse.ok) {
        const deployData = await deployResponse.json();
        logger.log('Deployment response:', deployData);

        // Use the instance_url from the backend response
        const instanceUrl = deployData.data?.instance_url || nameAvailability.fullDomain;
        setDeployedInstanceUrl(instanceUrl);

        // Wait for progress to complete
        setTimeout(() => {
          setIsDeploying(false);
          setCurrentStep(4);
        }, totalTime);
      } else {
        const errorData = await deployResponse.json().catch(() => ({}));
        logger.error('Deployment failed:', errorData);

        // Extract error message from backend response
        const errorMessage = errorData.error?.message || errorData.message || 'Deployment failed';
        throw new Error(errorMessage);
      }

    } catch (error) {
      logger.error('Deployment error:', error);
      clearInterval(progressInterval);
      setIsDeploying(false);

      // Show specific error message
      const errorMessage = error.message || 'Deployment failed. Please try again.';
      await showError(errorMessage);

      setCurrentStep(2);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h5 className='text-xl leading-tight font-semibold mb-1'>
              Select your template
            </h5>
            <p className='text-[#58586b] leading-relaxed text-sm mb-5'>
              Choose the Odoo version or application template you want to deploy.
            </p>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-5'>
              {isLoading ? (
                <div className='col-span-4 text-center py-8'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto'></div>
                  <p className='mt-4 text-gray-600'>Loading templates...</p>
                </div>
              ) : helmCharts.length > 0 ? (
                helmCharts.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedTemplate === template.id
                        ? 'border-[#5355ce] bg-[#5355ce0f]'
                        : 'border-gray-200 bg-white hover:border-[#5355ce]'
                      }`}
                    title={template.description || template.name}
                  >
                    {selectedTemplate === template.id && (
                      <div className='absolute -top-2 -right-2 w-6 h-6 bg-[#5355ce] rounded-full flex items-center justify-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='w-4 h-4 text-white'
                        >
                          <path d='M20 6 9 17l-5-5'></path>
                        </svg>
                      </div>
                    )}
                    <div className='text-center'>
                      {/* Show logo image for all templates */}
                      <img
                        src={`/img/${template.name.toLowerCase().replace(/\s+/g, '_')}.png`}
                        alt={template.name}
                        className='mx-auto w-full h-auto'
                        onError={(e) => {
                          // Fallback to generic logo if image not found
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback text logo */}
                      <div className='w-16 h-16 mx-auto items-center justify-center bg-gray-100 rounded-lg' style={{ display: 'none' }}>
                        <span className='text-2xl font-bold text-[#5355ce]'>
                          {template.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-span-4 text-center py-8'>
                  <p className='text-gray-600'>No templates available</p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h5 className='text-xl leading-tight font-semibold mb-3'>
              Configure your instance
            </h5>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Instance Name */}
              <div className='flex flex-col md:col-span-2'>
                <label className='text-[#333] text-xs mb-2 font-medium'>
                  Instance Name <span className='text-red-600'>*</span>
                </label>
                <div className='relative'>
                  <input
                    name='instance'
                    value={formData.instance}
                    onChange={handleInstanceNameChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md mb-1 transition duration-300 outline-0 ${nameAvailability.checking ? 'border-blue-400' :
                        nameAvailability.available ? 'border-green-500' :
                          !validation.instanceName.isValid ? 'border-red-500' :
                            'border-[#e5e7eb] focus:border-[var(--primary-color)]'
                      }`}
                    type='text'
                    autoComplete='off'
                    placeholder='Choose a name (lowercase letters only) eg: mycompany'
                    disabled={nameAvailability.checking}
                  />
                  {formData.instance && (
                    <div className='absolute right-3 top-2.5'>
                      {nameAvailability.checking ? (
                        <div className='animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent'></div>
                      ) : nameAvailability.available ? (
                        <svg className='w-5 h-5 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                        </svg>
                      ) : formData.instance.length >= 3 ? (
                        <svg className='w-5 h-5 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                        </svg>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Status messages */}
                {formData.instance && (
                  <div className='mt-1'>
                    {nameAvailability.checking ? (
                      <p className='text-blue-600 text-sm'>{nameAvailability.message}</p>
                    ) : nameAvailability.available ? (
                      <div>
                        <p className='text-green-600 text-sm font-medium mb-1'>
                          ✓ {nameAvailability.message}
                        </p>
                        {nameAvailability.fullDomain && (
                          <p className='text-gray-600 text-sm'>
                            Your instance will be available at: <span className='font-medium'>{nameAvailability.fullDomain}</span>
                          </p>
                        )}
                      </div>
                    ) : formData.instance.length >= 3 ? (
                      <p className='text-red-600 text-sm'>
                        ✗ {nameAvailability.message || validation.instanceName.message}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Login Email */}
              <div className='flex flex-col'>
                <label className='text-[#333] text-xs mb-2 font-medium'>
                  Login Email <span className='text-red-600'>*</span>
                </label>
                <input
                  name='loginEmail'
                  value={formData.loginEmail}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  className={`px-3 py-2 border rounded-md mb-1 transition duration-300 outline-0 ${validation.email.isValid
                      ? 'border-[#e5e7eb] focus:border-[var(--primary-color)]'
                      : 'border-red-500'
                    }`}
                  type='email'
                  autoComplete='off'
                  placeholder='admin@example.com'
                />
                {!validation.email.isValid && touched.email && (
                  <p className='text-red-500 text-xs'>{validation.email.message}</p>
                )}
              </div>

              {/* Login Password */}
              <div className='flex flex-col'>
                <label className='text-[#333] text-xs mb-2 font-medium'>
                  Login Password <span className='text-red-600'>*</span>
                </label>
                <div className='relative'>
                  <input
                    name='loginPassword'
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    className={`w-full px-3 py-2 pr-10 border rounded-md mb-1 transition duration-300 outline-0 ${validation.password.isValid
                        ? 'border-[#e5e7eb] focus:border-[var(--primary-color)]'
                        : 'border-red-500'
                      }`}
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='Enter admin password'
                  />
                  <button
                    type='button'
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className='absolute right-3 top-2 text-gray-500 hover:text-gray-700'
                  >
                    {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {!validation.password.isValid && touched.password && (
                  <p className='text-red-500 text-xs'>{validation.password.message}</p>
                )}
              </div>

              {/* Custom Addons */}
              <div className='flex items-center md:col-span-2'>
                <input
                  type='checkbox'
                  id='needCustomAddons'
                  checked={formData.needCustomAddons}
                  onChange={(e) => setFormData(prev => ({ ...prev, needCustomAddons: e.target.checked }))}
                  className='mr-2'
                />
                <label htmlFor='needCustomAddons' className='text-sm text-[#333]'>
                  Include custom addons support
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h5 className='text-xl leading-tight font-semibold mb-3'>
              Your instance is deploying!
            </h5>

            <div className='space-y-3 mb-6'>
              {deploymentTasks.map((task) => (
                <div key={task.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                  <div className='flex items-center'>
                    <div className='mr-3'>
                      {task.status === 'completed' ? (
                        <svg className='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                        </svg>
                      ) : task.status === 'active' ? (
                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--primary-color)]'></div>
                      ) : (
                        <div className='w-5 h-5 rounded-full border-2 border-gray-300'></div>
                      )}
                    </div>
                    <span className={`text-sm ${task.status === 'completed' ? 'text-gray-600 font-medium' : 'text-gray-500'}`}>
                      {task.text}
                    </span>
                  </div>
                  <span className='text-xs text-gray-400'>
                    {task.status === 'completed' ? '✔️' : task.status === 'active' ? '⏳' : '⏳'}
                  </span>
                </div>
              ))}
            </div>

            <div className='mb-6'>
              <div className='flex justify-between mb-2'>
                <span className='text-sm text-gray-600'>Overall Progress</span>
                <span className='text-sm font-medium text-[var(--primary-color)]'>
                  {Math.round(deployProgress)}%
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
                <div
                  className='bg-[var(--primary-color)] h-full transition-all duration-300 ease-linear'
                  style={{ width: `${deployProgress}%` }}
                ></div>
              </div>
            </div>

            <div className='text-center text-sm text-gray-600'>
              <p>Please wait while we set up your instance...</p>
              <p className='mt-2 text-xs'>This usually takes about 2 minutes.</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className='text-center py-8 pt-20'>
            <div className='success-icon mb-6'>
              <div className='w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center'>
                <svg
                  className='w-12 h-12 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='3'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>

            <h2 className='text-2xl font-bold text-gray-800 mb-4'>
              Successfully Deployed! 🎉
            </h2>

            <div className='text-gray-600 space-y-2 mb-8'>
              <p className='text-sm'>
                Your instance has been successfully deployed and is now ready to use!
              </p>
              <p className='text-sm font-medium'>Access your instance here:</p>
            </div>

            <div className='bg-gray-100 rounded-lg p-4 mb-8'>
              <p className='text-sm text-gray-600 mb-1'>Instance URL:</p>
              <a
                href={deployedInstanceUrl || nameAvailability.fullDomain}
                target='_blank'
                rel='noopener noreferrer'
                className='text-lg font-mono text-blue-600 hover:text-blue-800 break-all'
              >
                {deployedInstanceUrl || nameAvailability.fullDomain}
              </a>
            </div>



            <div className='flex justify-center gap-3'>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedTemplate(null);
                  setFormData({
                    instance: '',
                    loginEmail: '',
                    loginPassword: '',
                    helmChartId: '',
                    needCustomAddons: true,
                  });
                  setDeployProgress(0);
                  setDeploymentTasks(prev => prev.map(task => ({ ...task, status: 'pending' })));
                }}
                className='cursor-pointer text-[15px] text-center px-8 py-3 text-[#58586b] bg-[white] border-[#0000001a] border-2 rounded-full hover:bg-[#454685] hover:text-white transition duration-300'
              >
                Deploy Another Instance
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className='cursor-pointer text-[15px] text-center px-8 py-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[#454685] transition duration-300'
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated (after initialization)
  if (!isAuthenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4'></div>
          <p className='text-gray-600'>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#f4f5f8] h-screen'>
      {/* Header with Logo */}
      {/* <div className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center'>
            <img src="/logo/logo.svg" alt="easy instance" className="h-8" />
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className='flex justify-center items-center h-full py-8'>
        <div className='[box-shadow:10px_10px_20px_rgb(0_0_0_/_3%)] w-[1000px] mx-auto bg-white rounded-xl overflow-hidden'>
          <div className='flex flex-col justify-center gap-4 lg:min-h-[500px] p-6'>

            {/* Step Progress Bar */}
            {currentStep !== 4 && (
              <div className='mb-8'>
                <div className='loginstep flex items-center justify-between relative'>
                  {steps.map((step, index) => (
                    <div key={step.id} className='loginstepsec relative z-10'>
                      <div
                        className={`sec w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${currentStep >= step.id
                            ? 'bg-[var(--primary-color)] text-white'
                            : 'bg-gray-200 text-gray-600'
                          }`}
                      >
                        {step.id}
                      </div>
                      <p className='text-sm font-medium text-gray-700 text-center'>
                        {step.title}
                      </p>
                    </div>
                  ))}
                  {/* Connection lines */}
                  <div className='absolute top-5.5 left-0 right-0 h-[3px] bg-gray-200 -z-0' style={{ width: '100%', transform: 'translateY(-50%)' }}>
                    <div
                      className='h-full bg-[var(--primary-color)] transition-all duration-300'
                      style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className='flex-1 flex flex-col justify-between w-[90%] m-auto'>
              <div className=''>{renderStepContent()}</div>

              {/* Fixed Button Container */}
              <div className=' mt-6 pt-6'>
                <div className='flex justify-between items-center'>
                  {currentStep === 1 ? (
                    // Step 1: Only Next button
                    <div className='flex justify-end w-full'>
                      <button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className='cursor-pointer text-[15px] w-25 text-center px-3 py-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[#454685] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Next
                      </button>
                    </div>
                  ) : currentStep === 2 ? (
                    // Step 2: Prev and Deploy Now buttons
                    <>
                      <button
                        onClick={handlePrevious}
                        className='cursor-pointer text-[15px] w-35 text-center px-3 py-3 text-[#58586b] bg-[white] border-[#0000001a] border-2 rounded-full hover:bg-[#454685] hover:text-white transition duration-300'
                      >
                        Back
                      </button>

                      <button
                        onClick={handleDeploy}
                        disabled={!canProceedToNext()}
                        className='cursor-pointer text-[15px] w-35 text-center px-3 py-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[#454685] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Deploy Now
                      </button>
                    </>
                  ) : (
                    // Step 3: No buttons (deployment progress page)
                    <div className='w-full'></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeployPage() {
  return (
    <AuthGuard>
      <DeployPageContent />
    </AuthGuard>
  );
}
