import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

function page() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Header />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
              Powerful Features for <span className="text-[var(--primary-color)]">Modern Teams</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Everything you need to deploy, manage, and scale your Odoo instances with confidence.
              Simple enough for beginners, powerful enough for experts.
            </p>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Features" }]} />
          </div>

          {/* Feature 1: Smart Dashboard */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 transition-all hover:shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
                  Centralized Control
                </span>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Manage Everything from a Single Dashboard
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  Your command center for Odoo. View all your instances, check their status, and perform quick actions like start, stop, or restart—all from one intuitive interface.
                </p>
                <a href="/login" className="inline-flex items-center text-[var(--primary-color)] font-semibold hover:underline">
                  Go to Dashboard <span className="ml-2">→</span>
                </a>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <img
                  src="/img/dashboard_view.png"
                  alt="Smart Dashboard Interface"
                  className="rounded-2xl shadow-xl w-full max-w-lg object-cover border border-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Feature 2: Live Metrics */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 transition-all hover:shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-purple-50 text-purple-600 text-sm font-semibold mb-4">
                Observability
              </span>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Instant Visibility into Performance
              </h2>
              <p className="text-gray-600 text-lg">
                Track every metric that matters. From CPU spikes to memory usage, get the granular data you need to optimize your infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="/img/soft1.jpg"
                  alt="Performance Metrics"
                  className="w-full h-64 object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                  <p className="text-white font-medium text-xl">Visualize performance instantly</p>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="/img/soft2.jpg"
                  alt="Resource Usage"
                  className="w-full h-64 object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                  <p className="text-white font-medium text-xl">Data-driven decisions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Scaling & Infrastructure */}
          <div className="bg-[#1e1e2e] rounded-3xl p-8 md:p-16 text-white mb-8 overflow-hidden relative shadow-2xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[var(--primary-color)] opacity-10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600 opacity-10 blur-3xl rounded-full"></div>

            <div className="relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Scale without limits</h2>
                <p className="text-gray-400 max-w-xl mx-auto text-lg">
                  Unlock your potential with infrastructure that grows with you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Vertical Scaling */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300 backdrop-blur-sm">
                  <div className="h-48 mb-6 rounded-xl overflow-hidden bg-gray-800/50">
                    <img src="/img/vertical_scaling.png" alt="Vertical Scaling" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Vertical Scaling</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Need more power? Upgrade CPU and RAM allocation instantly from the dashboard without migration.
                  </p>
                </div>
                {/* Global Infra */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300 backdrop-blur-sm">
                  <div className="h-48 mb-6 rounded-xl overflow-hidden bg-gray-800/50">
                    <img src="/img/global_infrastructure.png" alt="Global Infrastructure" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Global Infrastructure</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Minimize latency by deploying your Odoo instances in regions closest to your users.
                  </p>
                </div>
                {/* Reliability */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300 backdrop-blur-sm">
                  <div className="h-48 mb-6 rounded-xl overflow-hidden bg-gray-800/50">
                    <img src="/img/uptime_guarantee.png" alt="Uptime Guarantee" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">99.9% Uptime</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Our redundant infrastructure and automated failover systems ensure your mission-critical ERP is always online.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Developer Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Git Integration */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md">
              <div className="mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-green-50 text-green-600 text-sm font-semibold mb-3">
                  Workflow
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Seamless Git Integration</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Connect your GitHub repositories and deploy custom addons with ease. Manage branches, track commits, and streamline your development workflow directly from the dashboard.
                </p>
              </div>
              <div className="mt-auto rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                <img src="/img/f1.jpg" alt="Git Integration" className="w-full h-56 object-cover hover:scale-105 transition duration-500" />
              </div>
            </div>

            {/* Log Viewer */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md">
              <div className="mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold mb-3">
                  Debugging
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Log Viewer</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Monitor your Odoo logs in real-time. Filter, search, and analyze logs to troubleshoot errors and optimize performance instantly.
                </p>
              </div>
              <div className="mt-auto rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                <img src="/img/f3.jpg" alt="Log Viewer" className="w-full h-56 object-cover hover:scale-105 transition duration-500" />
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
