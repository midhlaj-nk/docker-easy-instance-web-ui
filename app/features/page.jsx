import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

function page() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Header />

      <div className="pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* HERO */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
              Powerful Features for <span className="text-[var(--primary-color)]">Modern Teams</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Everything you need to deploy, manage, and scale your Odoo instances with confidence.
              Simple enough for beginners, powerful enough for experts.
            </p>

            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Our Features" }
              ]}
            />
          </div>
        </div>

        {/* SMART DASHBOARD — FULL WIDTH (NO NEGATIVES) */}
        <div className="relative w-full bg-gray-100 py-14 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="order-2 lg:order-1 lg:pl-10">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
                Centralized Control
              </span>

              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Manage Everything from a Single Dashboard
              </h2>

              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Your command center for Odoo. View all your instances, check their status,
                and perform quick actions like start, stop, or restart—all from one intuitive interface.
              </p>

              <a
                href="/login"
                className="inline-flex items-center text-[var(--primary-color)] font-semibold hover:underline"
              >
                Go to Dashboard <span className="ml-2">→</span>
              </a>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <img
                src="/img/dashboard_view.png"
                className="rounded-2xl shadow-xl w-full max-w-lg object-cover border border-gray-200"
              />
            </div>
          </div>
        </div>


        {/* SCALING + INFRASTRUCTURE */}
        <div className="relative rounded-3xl p-8 md:p-14 mt-20 overflow-hidden">

          {/* blurred accents */}
          <div className="absolute bottom-0 left-0 w-72 h-72 opacity-10 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Scale without limits</h2>
              <p className="text-black text-xl md:text-2xl font-semibold max-w-xl mx-auto">
                Unlock your potential with infrastructure that grows with you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Vertical Scaling */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                <div className="h-48 mb-6 overflow-hidden rounded-xl bg-gray-100">
                  <img src="/img/vertical_scaling.png" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-2">Vertical Scaling</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Upgrade CPU and RAM instantly from the dashboard.
                </p>
              </div>

              {/* Global Infrastructure */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                <div className="h-48 mb-6 overflow-hidden rounded-xl bg-gray-100">
                  <img src="/img/global_infrastructure.png" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-2">Global Infrastructure</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Deploy instances close to your users to reduce latency.
                </p>
              </div>

              {/* Uptime */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                <div className="h-48 mb-6 overflow-hidden rounded-xl bg-gray-100">
                  <img src="/img/uptime_guarantee.png" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-2">99.9% Uptime</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Redundant failover ensures your ERP stays online.
                </p>
              </div>

            </div>
          </div>
        </div>


        {/* OBSERVABILITY + WORKFLOW — FULL WIDTH (CLEAN, NO NEGATIVES) */}
        <div className="relative w-full bg-[#f3f4f6] py-20 px-6 md:px-12 mt-20">
          <div className="max-w-6xl mx-auto">

            {/* OBSERVABILITY */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
                Observability
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Instant Visibility into Performance
              </h2>
              <p className="text-gray-600 text-lg">
                Track every metric that matters—CPU, Memory, Disk I/O & more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

              <div className="relative group overflow-hidden rounded-3xl shadow-lg bg-black">
                <img src="/img/soft1.jpg"
                     className="w-full h-72 object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <p className="text-white text-xl">Visualize performance instantly</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-3xl shadow-lg bg-black">
                <img src="/img/soft2.jpg"
                     className="w-full h-72 object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <p className="text-white text-xl">Data-driven decisions</p>
                </div>
              </div>

            </div>


            {/* WORKFLOW + DEBUGGING */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Workflow */}
              <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition">
                <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm mb-4">
                  Workflow
                </span>

                <h3 className="text-2xl font-bold mb-3">Seamless Git Integration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect GitHub repos, deploy addons, manage commits & branches.
                </p>

                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  <img src="/img/f1.jpg"
                       className="w-full h-60 object-cover transition hover:scale-105" />
                </div>
              </div>

              {/* Debugging */}
              <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition">
                <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-700 text-sm mb-4">
                  Debugging
                </span>

                <h3 className="text-2xl font-bold mb-3">Real-Time Log Viewer</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor logs in real-time. Search, filter and debug instantly.
                </p>

                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  <img src="/img/f3.jpg"
                       className="w-full h-60 object-cover transition hover:scale-105" />
                </div>
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