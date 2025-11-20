'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import withInstanceGuard from '../components/withInstanceGuard';

const plans = [
  {
    name: 'Weekly Classic',
    price: '$14',
    billing: '/Week',
    description: 'Simple weekly access with essential features and limited users.',
    features: [
      '1 Custom Addons',
      '2 Users',
      'Free Domain Mapping',
      'GitHub Integration',
      'Support Automated Renewal',
    ],
  },
  {
    name: 'Weekly Premium',
    price: '$37',
    billing: '/Week',
    description: 'Premium weekly access with enhanced features and higher user capacity.',
    features: [
      '1 Custom Addons',
      '5 Users',
      'Free Domain Mapping',
      'GitHub Integration',
      'Support Automated Renewal',
    ],
  },
  {
    name: 'Monthly Classic',
    price: '$54',
    billing: '/Month',
    description: 'Cost-effective monthly plan with essential features and custom addons.',
    features: [
      '1 Custom Addons',
      '3 Users',
      'Free Domain Mapping',
      'GitHub Integration',
      'Support Automated Renewal',
    ],
  },
  {
    name: 'Monthly Premium',
    price: '$95',
    billing: '/Month',
    description: 'Power-packed monthly plan with full features and extended user support.',
    features: [
      '1 Custom Addons',
      '5 Users',
      'Free Domain Mapping',
      'GitHub Integration',
      'Support Automated Renewal',
    ],
  },
  {
    name: 'Yearly Classic',
    price: '$1300',
    billing: '/Year',
    description: 'Long-term value with core features and essential addon flexibility.',
    features: [
      '1 Custom Addons',
      '10 Users',
      'Free Domain Mapping',
      'GitHub Integration',
      'Support Automated Renewal',
    ],
  },
  {
    name: 'Yearly Premium',
    price: '$2600',
    billing: '/Year',
    description: 'Complete premium access yearly with max features and user scalability.',
    features: [
      '1 Custom Addons',
      '15 Users',
      'Free Domain Mapping',
      'GitHub Integration',
      'Support Automated Renewal',
    ],
  },
];

function SubscriptionsPage({ selectedInstance }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex mt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Subscription Plans</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {plans.map((plan, index) => (
                  <div key={index} className="rounded-lg p-6 flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}>
                    <div className="flex items-baseline mb-4">
                      <h2 className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>{plan.price}</h2>
                      <span className="ml-1" style={{ color: 'var(--text-secondary)' }}>{plan.billing}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>{plan.name}</h3>
                    <p className="mb-6 flex-grow text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className='mr-2' style={{ color: 'var(--success-color)' }}><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="px-6 py-3 rounded-lg font-medium transition-all duration-300" style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}>Subscribe</button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withInstanceGuard(SubscriptionsPage);
