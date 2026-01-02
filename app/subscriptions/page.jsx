'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';
// SubscriptionModal no longer needed - subscriptions redirect directly to invoice portal
// import SubscriptionModal from '../components/SubscriptionModal';
import { useAuthStore } from '@/lib/store';
import { showDeleteConfirm } from '@/lib/swal';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

// Currency symbol mapping
const getCurrencySymbol = (currency = 'USD') => {
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'INR': '₹',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'CHF',
    'CNY': '¥',
    'SGD': 'S$',
    'MXN': 'MX$',
    'BRL': 'R$',
    'ZAR': 'R',
    'KRW': '₩',
    'THB': '฿',
  };
  return currencySymbols[currency?.toUpperCase()] || currency || '$';
};

// Format price with currency symbol
const formatPriceWithCurrency = (price, currency = 'USD') => {
  if (!price && price !== 0) return '0';
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${getCurrencySymbol(currency)}${formattedNumber}`;
};

function SubscriptionsPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [deletingSubscriptionId, setDeletingSubscriptionId] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchSubscriptions = async () => {
    if (!selectedInstance || !token) return;

    try {
      const subsResponse = await fetch(`${API_BASE_URL}/api/v1/instances/${selectedInstance.id}/subscriptions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const subsData = await subsResponse.json();
      if (subsData.data?.subscriptions) {
        setSubscriptions(subsData.data.subscriptions);
        // Find current active subscription (only if payment is completed)
        const active = subsData.data.subscriptions.find(
          sub => (sub.state === 'active' || sub.state === 'scheduled') && sub.payment_status === 'paid'
        );
        console.log(active)
        setCurrentSubscription(active || null);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  useEffect(() => {
    if (!selectedInstance || !token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch subscription plans
        const plansResponse = await fetch(`${API_BASE_URL}/api/v1/subscription-plans`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const plansData = await plansResponse.json();
        if (plansData.data?.plans) {
          setPlans(plansData.data.plans);
        }

        // Fetch instance subscriptions
        await fetchSubscriptions();
      } catch (err) {
        setError(err.message);
        console.error('Error fetching subscription data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedInstance, token]);

  const [isUpdatingAutoRenew, setIsUpdatingAutoRenew] = useState(false);

  const handleAutoRenewToggle = async () => {
  setIsUpdatingAutoRenew(true);
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/instances/subscriptions/auto-renew`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: currentSubscription.id, // or appropriate ID field
          auto_renew: !currentSubscription.auto_renew
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update auto-renew setting');
      }

      const data = await response.json();
      
      // Update your state with the new subscription data
      setCurrentSubscription(prev => ({
        ...prev,
        auto_renew: !prev.auto_renew
      }));
      
    } catch (error) {
      console.error('Error updating auto-renew:', error);
      alert('Failed to update auto-renew setting. Please try again.');
    } finally {
      setIsUpdatingAutoRenew(false);
    }
  };


  const handleSubscribe = async (plan) => {
  if (!selectedInstance || !token) {
    setError('Please select an instance and ensure you are logged in');
    return;
  }

  setIsCreatingSubscription(true);
  setError(null);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/instances/${selectedInstance.id}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: plan.id,
          return_url: `${window.location.origin}/subscriptions`,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create subscription');
    }

    if (!result.data?.invoice_portal_url) {
      throw new Error('Invoice portal URL not received');
    }

    // Redirect to Odoo payment portal (same tab)
    window.location.href = result.data.invoice_portal_url;
    // window.open(result.data.invoice_portal_url, '_blank');

  } catch (err) {
    setError(err.message || 'Failed to create subscription');
    setIsCreatingSubscription(false);
  }
};





  const handleDeleteSubscription = async (subscriptionId) => {
    if (!selectedInstance || !token) {
      setError('Please select an instance and ensure you are logged in');
      return;
    }

    // Confirm deletion
    const result = await showDeleteConfirm(
      'Are you sure you want to delete this subscription? The associated invoice will also be deleted.',
      'Delete Subscription'
    );
    if (!result.isConfirmed) {
      return;
    }

    setDeletingSubscriptionId(subscriptionId);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/instances/${selectedInstance.id}/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete subscription');
      }

      // Refresh subscriptions list
      await fetchSubscriptions();
    } catch (err) {
      setError(err.message || 'Failed to delete subscription');
      console.error('Error deleting subscription:', err);
    } finally {
      setDeletingSubscriptionId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTrialStatus = () => {
    if (!currentSubscription || !currentSubscription.is_trial) return null;

    const daysRemaining = getDaysRemaining(currentSubscription.trial_end_date);
    if (daysRemaining === null) return null;

    if (daysRemaining < 0) {
      return { status: 'expired', message: 'Trial has expired', days: 0 };
    } else if (daysRemaining <= 3) {
      return { status: 'warning', message: `Trial expires in ${daysRemaining} day(s)`, days: daysRemaining };
    } else {
      return { status: 'active', message: `${daysRemaining} days remaining`, days: daysRemaining };
    }
  };

  const [billingPeriod, setBillingPeriod] = useState('month');

  useEffect(() => {
    if (plans.length > 0 && !plans.some(p => p.billing_period_type === billingPeriod)) {
      setBillingPeriod(plans[0].billing_period_type);
    }
  }, [plans]);

  const trialStatus = getTrialStatus();
  return (
  <div className="dashboard-theme">
    <div className="bg-[var(--background)] transition-colors duration-300 min-h-screen font-sans">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
              Subscription Management
            </h1>

              {/* Current Subscription Details - Only show when payment is completed */}
              {currentSubscription && currentSubscription.payment_status === 'paid' && (
                <div className="mb-6 p-6 rounded-lg" style={{
                  backgroundColor: 'var(--background-secondary)',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    Subscription Details
                  </h2>

                  <div className="space-y-4">
                    {/* Plan Info */}
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium mr-3"
                        style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
                        ACTIVE
                      </span>
                      <span className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                        {currentSubscription.plan_name}
                      </span>
                    </div>

                    {/* Subscription Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Start Date:</strong> {formatDate(currentSubscription.start_date)}
                        </p>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                          <strong>End Date:</strong> {formatDate(currentSubscription.end_date)}
                        </p>
                        {currentSubscription.next_billing_date && (
                          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                            <strong>Next Billing:</strong> {formatDate(currentSubscription.next_billing_date)}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Amount:</strong> {formatPriceWithCurrency(currentSubscription.amount_total, currentSubscription.currency)}
                        </p>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Payment Status:</strong> <span className="font-medium text-green-600">
                            PAID
                          </span>
                        </p>
                        {currentSubscription.auto_renew !== undefined && (
                          <p className="text-sm mb-1 flex items-center" style={{ color: 'var(--text-secondary)' }}>
                            <strong>Auto Renew:</strong> 
                            <button
                              onClick={handleAutoRenewToggle}
                              disabled={isUpdatingAutoRenew}
                              className="ml-2 relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none"
                              style={{
                                backgroundColor: currentSubscription.auto_renew ? '#10b981' : '#d1d5db',
                                opacity: isUpdatingAutoRenew ? 0.5 : 1,
                                cursor: isUpdatingAutoRenew ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <span
                                className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform"
                                style={{
                                  transform: currentSubscription.auto_renew ? 'translateX(1.1rem)' : 'translateX(0.15rem)'
                                }}
                              />
                            </button>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Resource Limits */}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                        Resource Limits
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>CPU:</span>
                          <span className="ml-2 font-medium" style={{ color: 'var(--text-color)' }}>
                            {currentSubscription.applied_cpu_limit} cores
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Memory:</span>
                          <span className="ml-2 font-medium" style={{ color: 'var(--text-color)' }}>
                            {currentSubscription.applied_memory_limit}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Storage:</span>
                          <span className="ml-2 font-medium" style={{ color: 'var(--text-color)' }}>
                            {currentSubscription.applied_storage_limit_gb} GB
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Users:</span>
                          <span className="ml-2 font-medium" style={{ color: 'var(--text-color)' }}>
                            {currentSubscription.applied_max_users === 0 ? 'Unlimited' : currentSubscription.applied_max_users}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Information */}
                    {currentSubscription.invoice_id && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                          Invoice Information
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                              <strong>Invoice:</strong> {currentSubscription.invoice_name || `#${currentSubscription.invoice_id}`}
                            </p>
                            <p className="text-xs" style={{ color: '#10b981' }}>
                              ✓ Invoice has been sent to your email
                            </p>
                          </div>
                          {currentSubscription.invoice_portal_url && (
                            <a
                              href={currentSubscription.invoice_portal_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:opacity-90"
                              style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                            >
                              View Invoice
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pending Payment Subscription */}
              {subscriptions.find(sub => sub.state === 'pending_payment' || (sub.state === 'active' && sub.payment_status !== 'paid')) && (
                <div className="mb-6 p-6 rounded-lg border-2" style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: '#fbbf24',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    Pending Payment
                  </h2>
                  {subscriptions
                    .filter(sub => sub.state === 'pending_payment' || (sub.state === 'active' && sub.payment_status !== 'paid'))
                    .map((sub) => (
                      <div key={sub.id} className="mb-4 pb-4 border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center mb-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium mr-3"
                            style={{ backgroundColor: '#fbbf24', color: '#ffffff' }}>
                            PENDING PAYMENT
                          </span>
                          <span style={{ color: 'var(--text-color)' }}>
                            {sub.plan_name}
                          </span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Amount:</strong> {formatPriceWithCurrency(sub.amount_total, sub.currency)}
                        </p>
                        {sub.invoice_id && (
                          <div className="mt-3">
                            <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                              <strong>Invoice:</strong> {sub.invoice_name || `#${sub.invoice_id}`}
                            </p>
                            <p className="text-xs mb-2" style={{ color: '#3b82f6' }}>
                              ℹ️ Invoice has been sent to your email. Please complete the payment to activate your subscription.
                            </p>
                            <div className="flex gap-2">
                              {sub.invoice_portal_url && (
                                <a
                                  href={sub.invoice_portal_url}
                                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:opacity-90"
                                  style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                                >
                                  Complete Payment
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteSubscription(sub.id)}
                                disabled={deletingSubscriptionId === sub.id}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                              >
                                {deletingSubscriptionId === sub.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* No Active Subscription Message */}
              {!currentSubscription && !subscriptions.find(sub => sub.state === 'pending_payment' || (sub.state === 'active' && sub.payment_status !== 'paid')) && (
                <div className="mb-6 p-6 rounded-lg border-2 border-dashed" style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                      No Active Subscription
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Subscribe to a plan to start using this instance.
                    </p>
                  </div>
                </div>
              )}

              {/* Subscription Plans - Only show if no active paid subscription */}
              {!currentSubscription && (
                <>
                  {/* Dynamic Billing Period Tabs */}
                  {(() => {
                    const availableBillingTypes = [...new Set(plans.map(p => p.billing_period_type))];
                    const billingTypeLabels = {
                      'day': 'Daily billing',
                      'week': 'Weekly billing',
                      'month': 'Monthly billing',
                      'year': 'Yearly billing'
                    };
                    
                    return availableBillingTypes.length > 1 && (
                      <div className="flex justify-center mb-8">
                        <div className="inline-flex rounded-xl p-1.5 shadow-sm" 
                          style={{ 
                            backgroundColor: 'var(--background-secondary)',
                            border: '1px solid var(--border-color, #e5e7eb)'
                          }}>
                          {availableBillingTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setBillingPeriod(type)}
                              className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 relative"
                              style={{
                                backgroundColor: billingPeriod === type ? '#2196f3' : 'transparent',
                                color: billingPeriod === type ? '#ffffff' : 'var(--text-secondary)',
                                boxShadow: billingPeriod === type ? '0 4px 12px rgba(33, 150, 243, 0.4)' : 'none',
                                transform: billingPeriod === type ? 'translateY(-1px)' : 'none'
                              }}
                            >
                              {billingTypeLabels[type] || type}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                    Available Plans
                  </h2>

                  {isLoading ? (
                    <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent mb-4"></div>
                      <p className="text-lg">Loading subscription plans...</p>
                    </div>
                  ) : error ? (
                    <div className="mb-6 p-6 rounded-xl bg-red-50 border-2 border-red-200 shadow-sm">
                      <p className="font-bold text-red-800 text-lg mb-2">⚠️ Error</p>
                      <p className="text-red-700">{error}</p>
                    </div>
                  ) : plans.length === 0 ? (
                    <div className="text-center py-16 rounded-xl" 
                      style={{ 
                        backgroundColor: 'var(--background-secondary)',
                        border: '2px dashed var(--border-color, #e5e7eb)'
                      }}>
                      <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                        No subscription plans available at the moment.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {plans
                        .filter(plan => plan.billing_period_type === billingPeriod)
                        .map((plan) => (
                        <div
                          key={plan.id}
                          className="rounded-xl p-6 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
                          style={{
                            backgroundColor: 'var(--background-secondary)',
                            boxShadow: 'var(--card-shadow)',
                            border: plan.is_featured ? '3px solid #2196f3' : '1px solid var(--border-color, #e5e7eb)'
                          }}
                        >
                          {/* Gradient overlay for featured plans */}
                          {plan.is_featured && (
                            <div 
                              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                            />
                          )}

                          {plan.is_featured && (
                            <div className="mb-3">
                              <span className="px-3 py-1.5 rounded-full text-xs font-bold shadow-md"
                                style={{ 
                                  backgroundColor: '#2196f3', 
                                  color: '#ffffff',
                                  letterSpacing: '0.5px'
                                }}>
                                ⭐ FEATURED
                              </span>
                            </div>
                          )}

                          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
                            {plan.name}
                          </h3>

                          <div className="flex items-baseline mb-4">
                            <span className="text-lg font-medium mr-1" style={{ color: 'var(--text-secondary)' }}>
                              {getCurrencySymbol(plan.currency)}
                            </span>
                            <h2 className="text-4xl font-extrabold" style={{ color: 'var(--text-color)' }}>
                              {new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(plan.price)}
                            </h2>
                            <span className="ml-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                              /{plan.billing_period === 1 ? '' : plan.billing_period}{plan.billing_period_type === 'month' ? 'mo' : plan.billing_period_type === 'year' ? 'yr' : plan.billing_period_type}
                            </span>
                          </div>

                          {plan.description && (
                            <p 
                              className="mb-6 flex-grow text-sm leading-relaxed" 
                              style={{ 
                                color: 'var(--text-secondary)', 
                                whiteSpace: 'pre-line',
                                minHeight: '60px'
                              }}
                            >
                              {plan.description.replace(/<[^>]*>/g, '')}
                            </p>
                          )}

                          <div className="mb-6 space-y-3 text-sm p-4 rounded-lg" 
                            style={{ backgroundColor: 'var(--background, #f9fafb)' }}>
                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                              <span className="text-green-500 font-bold">✓</span>
                              <span><strong className="font-semibold">CPU:</strong> {plan.cpu_limit} cores</span>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                              <span className="text-green-500 font-bold">✓</span>
                              <span><strong className="font-semibold">Memory:</strong> {plan.memory_limit}</span>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                              <span className="text-green-500 font-bold">✓</span>
                              <span><strong className="font-semibold">Storage:</strong> {plan.storage_limit_gb} GB</span>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                              <span className="text-green-500 font-bold">✓</span>
                              <span><strong className="font-semibold">Users:</strong> {plan.max_users === 0 ? 'Unlimited' : `Up to ${plan.max_users}`}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleSubscribe(plan)}
                            disabled={isLoading || isCreatingSubscription}
                            className="w-full px-6 py-3.5 rounded-lg font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            style={{ 
                              backgroundColor: plan.is_featured ? '#2196f3' : 'var(--primary-color)', 
                              color: '#ffffff',
                              letterSpacing: '0.3px'
                            }}
                          >
                            {currentSubscription && !currentSubscription.is_trial ? 'Upgrade' : 'Subscribe'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Subscription Modal - No longer used for subscription creation
          Kept for potential future use (e.g., manual payment entry)
      */}
    </div>
  );
}

export default withInstanceGuard(SubscriptionsPage);
