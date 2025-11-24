'use client';
import React, { useState } from 'react';

const SubscriptionModal = ({ isOpen, onClose, plan, instanceId, token, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('manual'); // 'manual', 'stripe', 'paypal'
  const [paymentData, setPaymentData] = useState({
    payment_reference: '',
  });
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

  const handleClose = () => {
    setPaymentMethod('manual');
    setPaymentData({ payment_reference: '' });
    setError(null);
    onClose();
  };

  // Complete subscription flow: Create -> Pay -> Activate in one step
  const handleQuickSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create subscription
      const createResponse = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: plan.id,
          state: 'pending_payment',
        }),
      });

      const createData = await createResponse.json();
      if (!createResponse.ok && !createData.data) {
        throw new Error(createData.message || 'Failed to create subscription');
      }

      const subId = createData.data?.id;
      if (!subId) {
        throw new Error('Subscription ID not returned');
      }

      // Step 2: Mark as paid (manual payment)
      const updateResponse = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/subscriptions/${subId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: 'paid',
          amount_paid: plan.price,
          payment_reference: paymentData.payment_reference || `MANUAL-${Date.now()}`,
        }),
      });

      if (!updateResponse.ok) {
        const updateData = await updateResponse.json();
        throw new Error(updateData.message || 'Failed to update payment');
      }

      // Step 3: Activate subscription
      const activateResponse = await fetch(`${API_BASE_URL}/api/v1/instances/${instanceId}/subscriptions/${subId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const activateData = await activateResponse.json();
      if (!activateResponse.ok) {
        throw new Error(activateData.message || 'Failed to activate subscription');
      }

      // Success!
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (err) {
      setError(err.message);
      console.error('Error in subscription flow:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="rounded-lg max-w-2xl w-full my-8 transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
              Subscribe to Plan
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-[var(--background)] transition-colors duration-300"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>


          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
              {error}
            </div>
          )}

          {/* Complete Subscription Flow */}
          <div className="space-y-4">
            {/* Plan Details */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                {plan.name}
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
                  {plan.currency} {plan.price}
                </span>
                <span className="ml-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  /{plan.billing_period} {plan.billing_period_type}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div style={{ color: 'var(--text-secondary)' }}>
                  <strong>CPU:</strong> {plan.cpu_limit} cores
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <strong>Memory:</strong> {plan.memory_limit}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <strong>Storage:</strong> {plan.storage_limit_gb} GB
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <strong>Users:</strong> {plan.max_users === 0 ? 'Unlimited' : plan.max_users}
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-color)' }}>
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 rounded-lg cursor-pointer border-2 transition-colors" 
                  style={{ 
                    borderColor: paymentMethod === 'manual' ? 'var(--primary-color)' : 'var(--border-color)',
                    backgroundColor: paymentMethod === 'manual' ? 'var(--background)' : 'transparent'
                  }}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="manual"
                    checked={paymentMethod === 'manual'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                    style={{ accentColor: 'var(--primary-color)' }}
                  />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-color)' }}>Manual Payment</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Mark as paid manually (for testing or offline payments)
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 rounded-lg cursor-pointer border-2 transition-colors opacity-50" 
                  style={{ 
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'transparent'
                  }}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-color)' }}>Credit Card (Stripe)</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Coming soon
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 rounded-lg cursor-pointer border-2 transition-colors opacity-50" 
                  style={{ 
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'transparent'
                  }}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-color)' }}>PayPal</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Coming soon
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Reference (for manual) */}
            {paymentMethod === 'manual' && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Payment Reference (Optional)
                </label>
                <input
                  type="text"
                  value={paymentData.payment_reference}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_reference: e.target.value })}
                  placeholder="Transaction ID, Invoice #, etc."
                  className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                  }}
                />
              </div>
            )}

            {/* Total Amount */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--text-color)' }}>Total Amount:</span>
                <span className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>
                  {plan.currency} {plan.price}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleQuickSubscribe}
                disabled={isLoading || paymentMethod !== 'manual'}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
              >
                {isLoading ? 'Processing...' : 'Subscribe & Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;

