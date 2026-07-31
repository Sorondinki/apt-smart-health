import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-lg leading-tight">
              APT <span className="text-cyan-600">Smart-Health</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Healthcare Network
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-cyan-600 transition-colors">Features</a>
          <a href="#security" className="hover:text-cyan-600 transition-colors">Security</a>
          <a href="#pricing" className="hover:text-cyan-600 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login.html"
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/register.html"
            className="px-4 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-lg shadow-cyan-600/20 transition-all transform hover:-translate-y-0.5"
          >
            Register Hospital
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          Self-Promoting Tech & Dynamic PWA Offline-Support
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          Transform Hospital Operations With <span className="text-cyan-600">APT Smart-Health</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect doctors, hospitals, and patients seamlessly in a secure ecosystem. Operate efficiently with or without internet connectivity **(Offline First)**.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/register.html"
            className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-xl shadow-cyan-600/25 transition-all text-center"
          >
            Start Free Trial (30 Days)
          </a>
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-center"
          >
            View Pricing & Plans
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-200/60">
          <div>
            <p className="text-3xl font-extrabold text-cyan-600">99.9%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Data Security (Encryption)</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-cyan-600">0s</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Offline Access Speed</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-800">HIPAA & NDPR</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Compliance Ready</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-500">24/7</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Dedicated Support</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-4 py-16 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-2">Powerful Features</h2>
            <p className="text-3xl font-bold text-slate-900">Everything Your Healthcare Facility Needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-4">📁</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Encrypted EHR</h3>
              <p className="text-sm text-slate-600">Secure patient records, lab results, and medical histories protected with AES-256 encryption.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center text-xl mb-4">📱</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">PWA Offline Capabilities</h3>
              <p className="text-sm text-slate-600">Install directly as a Mobile App. Access records and manage consultations even without internet.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-4">🎥</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Telemedicine & Video Calls</h3>
              <p className="text-sm text-slate-600">Conduct virtual doctor visits and fast consultations without physical hospital queues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-2">Flexible Pricing</h2>
          <p className="text-3xl font-bold text-slate-900">Choose the Right Plan for Your Practice</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xl">Individual Doctor</h3>
              <p className="text-xs text-slate-500 mt-1">For private practice physicians</p>
              <div className="my-6">
                <span className="text-4xl font-black text-slate-900">₦15,000</span>
                <span className="text-sm text-slate-500"> / month</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li>✓ Up to 100 Patient Consultations/mo</li>
                <li>✓ Digital Prescriptions</li>
                <li>✓ PWA Mobile Installation</li>
              </ul>
            </div>
            <a href="/register.html" className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl text-center block hover:bg-slate-800 transition-colors">
              Get Started
            </a>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-cyan-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider text-slate-950">
              Most Popular
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">Standard Hospital</h3>
              <p className="text-xs text-slate-400 mt-1">For medium healthcare facilities</p>
              <div className="my-6">
                <span className="text-4xl font-black text-white">₦50,000</span>
                <span className="text-sm text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li>✓ Unlimited EHR Patients</li>
                <li>✓ Up to 15 Doctors & Staff</li>
                <li>✓ Telemedicine & Video Calls</li>
                <li>✓ Automated Billing & Paystack Integration</li>
              </ul>
            </div>
            <a href="/register.html" className="w-full py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-center block hover:bg-cyan-400 transition-colors">
              Register Hospital
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 APT Smart-Health Network. All rights reserved.</p>
      </footer>
    </div>
  );
              }
      
