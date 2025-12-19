"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://web.easyinstance.com";

function page() {
  
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
        const response = await fetch(
          `${API_BASE_URL}/api/v1/subscription-plans?show_in_website=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
        console.error("Error fetching subscription plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (price, currency = "USD") => {
    if (!price && price !== 0) {
      return { number: "0", symbol: "$", currency: "USD" };
    }

    // Format number with proper locale (handles thousands separators)
    const formattedNumber = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    // Get currency symbol based on currency code
    const currencySymbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      INR: "₹",
      CAD: "C$",
      AUD: "A$",
      CHF: "CHF",
      CNY: "¥",
      SGD: "S$",
      MXN: "MX$",
      BRL: "R$",
      ZAR: "R",
      KRW: "₩",
      THB: "฿",
    };

    // If currency is already a symbol (like "$"), use it directly
    // Otherwise, look it up in the map
    const symbol = currencySymbols[currency?.toUpperCase()] || currency || "$";

    return {
      number: formattedNumber,
      symbol: symbol,
      currency: currency || "USD",
    };
  };

  const formatPeriod = (billingPeriod, billingPeriodType) => {
    const periodType = billingPeriodType || "month";
    const period = billingPeriod || 1;

    if (period === 1) {
      const typeMap = {
        day: "Day",
        week: "Week",
        month: "Month",
        year: "Year",
      };
      return `/${typeMap[periodType] || "Month"}`;
    }

    const typeMap = {
      day: "Days",
      week: "Weeks",
      month: "Months",
      year: "Years",
    };
    return `/${period} ${typeMap[periodType] || "Months"}`;
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const handleSubscribe = (plan) => {
    // Redirect to login, then to subscriptions page
    router.push("/login?redirect=/subscriptions");
  };
  return (
    <div>
      <Header />
      <div className="pt-32 pb-10">
        <div className="container-fluid cmpad">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl leading-tight text-center font-semibold mb-3">
              Pricing <span className="text-[var(--primary-color)]">Plans</span>
            </h2>
            <p className="max-w-2xl text-center mx-auto text-[#58586b] leading-relaxed">
              Empower your business with flexible pricing designed to scale with
              you. Our plans combine fast Odoo setup and reliable cloud
              infrastructure
            </p>
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
            />
          </div>

          <div className="bg-white p-4 sm:p-6 md:p-10 rounded-lg mb-5">
            <div className="pricing-container inner">
              {isLoading ? (
                <div className="text-center py-8 text-[#58586b]">
                  Loading plans...
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8 text-[#58586b]">
                  No plans available at the moment.
                </div>
              ) : (
                plans.map((plan) => {
                  // Build features list from features_list or default features
                  const features =
                    plan.features_list && plan.features_list.length > 0
                      ? plan.features_list
                      : [
                          plan.enable_custom_addons ? "Custom Addons" : null,
                          plan.max_users > 0
                            ? `${plan.max_users} Users`
                            : "Unlimited Users",
                          "Free Domain Mapping",
                          plan.enable_github_integration
                            ? "GitHub Integration"
                            : null,
                          "Support Automated Renewal",
                        ].filter(Boolean);

                  const priceData = formatPrice(plan.price, plan.currency);
                  const period = formatPeriod(
                    plan.billing_period,
                    plan.billing_period_type
                  );
                  const description =
                    stripHtml(plan.description) ||
                    "Premium plan with enhanced features and higher user capacity.";
                  const isFeatured = plan.is_featured || plan.is_popular;

                  return (
                    <div
                      key={plan.id}
                      className={`pricing-card ${isFeatured ? "featured" : ""}`}
                    >
                      {isFeatured && (
                        <div className="save-badge">Best Value</div>
                      )}
                      <div className="price-container">
                        <div className="price">
                          <span className="price-currency">
                            {priceData.symbol}
                          </span>
                          <span className="price-amount">
                            {priceData.number}
                          </span>
                          <span className="price-period">{period}</span>
                        </div>
                      </div>
                      <h5 className="font-semibold text-[18px] mb-2">
                        {plan.name}
                      </h5>
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
                        className={`cta-button ${isFeatured ? "featured" : ""}`}
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
