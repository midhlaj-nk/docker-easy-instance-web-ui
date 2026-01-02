"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

function Pricing() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const logos = [
    "/img/plane.webp",
    "/img/wordpress.png",
    "/img/ghost.png",
    "/img/jenkins.png",
    "/img/odoo.png",
    "/img/github.png",
    "/img/discourse.png",
    "/img/kuber.png",
    "/img/plane.png",
    "/img/nextcloud.png",
    "/img/googledrive.png",
    "/img/onedrive.png",
    "/img/docker.png",
    "/img/amazon.png",
    "/img/grafana.png",
    "/img/chatgpt.png",
  ];

  const marqueeLogos = [...logos, ...logos];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Fetch plans without authentication for public pricing page
        // Only show plans marked for website display
        const response = await fetch(`${API_BASE_URL}/api/v1/subscription-plans?show_in_website=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.data?.plans) {
          // Sort by sequence, then by name
          const sortedPlans = data.data.plans.sort((a, b) => {
            if (a.sequence !== b.sequence) {
              return a.sequence - b.sequence;
            }
            return a.name.localeCompare(b.name);
          });
          setPlans(sortedPlans);
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (price, currency = 'USD') => {
    if (!price && price !== 0) {
      return { number: '0', symbol: '$', currency: 'USD' };
    }

    // Format number with proper locale (handles thousands separators)
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    // Get currency symbol based on currency code
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

    // If currency is already a symbol (like "$"), use it directly
    // Otherwise, look it up in the map
    const symbol = currencySymbols[currency?.toUpperCase()] || currency || '$';

    return {
      number: formattedNumber,
      symbol: symbol,
      currency: currency || 'USD'
    };
  };

  const formatPeriod = (billingPeriod, billingPeriodType) => {
    const periodType = billingPeriodType || 'month';
    const period = billingPeriod || 1;

    if (period === 1) {
      const typeMap = {
        'day': 'Day',
        'week': 'Week',
        'month': 'Month',
        'year': 'Year'
      };
      return `/${typeMap[periodType] || 'Month'}`;
    }

    const typeMap = {
      'day': 'Days',
      'week': 'Weeks',
      'month': 'Months',
      'year': 'Years'
    };
    return `/${period} ${typeMap[periodType] || 'Months'}`;
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const handleSubscribe = (plan) => {
    // Redirect to login, then to subscriptions page
    router.push('/login?redirect=/subscriptions');
  };

  return (
    <div className="bg-white text-center">
      <div className="container-fluid cmpad py-10 lg:py-20">
        <h2 className="text-black dark:text-black text-4xl leading-tight font-medium mb-3">
          Select Plan For
          <span className="text-black dark:text-black text-[var(--primary-color)]"> Your </span> Business.
        </h2>
        <p className="text-black dark:text-black max-w-2xl mx-auto text-[#58586b] leading-relaxed mb-10">
          Choose the perfect plan for your Odoo deployment. From small business starters to enterprise-grade scaling, we have a solution for you.
        </p>
        <a
          href="/login"
          className="text-black dark:text-black w-52 px-10 py-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[#454685] transition duration-300"
        >
          View All Plans
        </a>
        <div className="pricing-container">
          {isLoading ? (
            <div className="text-black dark:text-black text-center py-8 text-[#58586b]">
              Loading plans...
            </div>
          ) : plans.length === 0 ? (
            <div className="text-black dark:text-black text-center py-8 text-[#58586b]">
              No plans available at the moment.
            </div>
          ) : (
            plans.map((plan) => {
              // Build features list from features_list or default features
              const features = plan.features_list && plan.features_list.length > 0
                ? plan.features_list
                : [
                  plan.enable_custom_addons ? 'Custom Addons' : null,
                  plan.max_users > 0 ? `${plan.max_users} Users` : 'Unlimited Users',
                  'Free Domain Mapping',
                  plan.enable_github_integration ? 'GitHub Integration' : null,
                  'Support Automated Renewal'
                ].filter(Boolean);

              const priceData = formatPrice(plan.price, plan.currency);
              const period = formatPeriod(plan.billing_period, plan.billing_period_type);
              const description = stripHtml(plan.description) || 'Premium plan with enhanced features and higher user capacity.';
              const isFeatured = plan.is_featured || plan.is_popular;

              return (
                <div key={plan.id} className={`pricing-card ${isFeatured ? 'featured' : ''}`}>
                  {isFeatured && (
                    <div className="save-badge">Best Value</div>
                  )}
                  <div className="price-container">
                    <div className="price">
                      <span className="price-currency">{priceData.symbol}</span>
                      <span className="price-amount">{priceData.number}</span>
                      <span className="price-period">{period}</span>
                    </div>
                  </div>
                  <h5 className="font-semibold text-[18px] mb-2">{plan.name}</h5>
                  <p className="plan-subtitle">{description}</p>

                  <ul className="features-list">
                    {features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <div className="feature-icon included">✓</div>
                        <span className="feature-text">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`cta-button ${isFeatured ? 'featured' : ''}`}
                    onClick={() => handleSubscribe(plan)}
                  >
                    Subscribe
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="text-black dark:text-black container-fluid cmpad py-10 lg:py-20">
        <h2 className="text-4xl leading-tight font-medium mb-3">
          Seamless Integrations For{" "}
          <span className="text-[var(--primary-color)]">Smarter</span>{" "}
          Operations.
        </h2>
        <p className="text-black dark:text-black max-w-2xl mx-auto text-[#58586b] leading-relaxed mb-3">
          Effortlessly connect with a variety of third party tools and services,
          enhancing functionality and streamlining workflows
        </p>

        <div className="slider overflow-hidden w-full">
          <div
            className="slide-track flex"
            style={{ animation: "scroll 80s linear infinite" }}
          >
            {marqueeLogos.map((logo, idx) => (
              <div className="slide" key={idx}>
                <img
                  src={logo}
                  alt={`logo ${idx % logos.length}`}
                  className="h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
