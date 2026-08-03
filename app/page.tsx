'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'recovery' | 'triage'>('recovery');
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const adCards = [
    {
      id: 1,
      tag: 'DIAGNOSTICS & IMAGING',
      title: 'Kano Modern Diagnostic & MRI Center',
      desc: 'Enjoy a 20% discount on all CT-Scan, MRI, and Ultrasound tests for patients utilizing the APT Smart-Health Network.',
      features: ['24/7 Fast Result Delivery', '100% Digital Scan Transfer', 'Specialist Doctor Verification'],
      icon: '🔬',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      btnText: 'Book Diagnostic Test',
    },
    {
      id: 2,
      tag: 'PHARMACEUTICAL SUPPLIES',
      title: 'Pharmaplus Bulk Medicine Distributor',
      desc: 'Source original bulk pharmaceutical supplies and essential hospital consumables directly from certified manufacturers.',
      features: ['NAFDAC Certified Products', 'Cold-Chain Delivery System', 'Flexible Payment Terms'],
      icon: '💊',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      btnText: 'Order Medical Supplies',
    },
    {
      id: 3,
      tag: 'HEALTH INSURANCE & HMO',
      title: 'Northern Care HMO Coverage',
      desc: 'Affordable health insurance plans for families and corporate organizations with seamless coverage across network hospitals.',
      features: ['Zero Cash Outpatient Triage', 'Maternity & Child Care', 'Instant Code Generation'],
      icon: '🛡️',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      btnText: 'Get HMO Coverage',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % adCards.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [adCards.length]);

  const reviews = [
    {
      quote: "APT Smart-Health has completely transformed how we manage patient workflows in our hospital. Operations are now exceptionally fast and accurate.",
      author: "Dr. Kabir Usman",
      title: "Chief Medical Director, Kano Specialist Hospital",
      avatar: "👨‍⚕️"
    },
    {
      quote: "The Telemedicine and E-Prescription functionality allows us to conduct remote patient consultations with complete security and reliability.",
      author: "Dr. Amina Aliyu",
      title: "Consultant Gynecologist, City Care Clinic",
      avatar: "👩‍⚕️"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-lg">
              A
            </div>
            <div>
              <span className="font-black text-white tracking-wider text-sm block">APT Smart-Health</span>
              <span className="text-[9px] text-cyan-400 font-semibold tracking-widest block uppercase">Healthcare Network</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Link to Subscription Page */}
            <Link className="text-xs text-slate-300 hover:text-cyan-400 font-bold px-3 py-2 transition flex items-center gap-1" href="/subscription">
              <span>💳</span> Pricing & Subscription
            </Link>
            <Link className="text-xs text-slate-300 hover:text-white font-bold px-3 py-2" href="/login">
              Sign In
            </Link>
            <Link className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-cyan-500/20" href="/register">
              Register Facility
            </Link>
          </div>
        </div>
      </nav>

      {/* Top Sponsored Spotlight */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/20 py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded uppercase tracking-wider">
              PROMO SPOTLIGHT
            </span>
            <p className="text-xs font-bold text-slate-200">
              🌟 <span className="text-cyan-400">Kano Diagnostic Center:</span> Get Free Blood Sugar & BP Triage on all clinic visits this week!
            </p>
          </div>
          <Link className="text-[11px] font-black text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-lg bg-cyan-500/10 transition" href="/advertise">
            Place Your Featured Ad Here →
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 text-center max-w-4xl mx-auto px-6 space-y-6">
        <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full uppercase">
          Unified Health Infrastructure Platform
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Next-Gen Ecosystem for <span className="text-cyan-400">Hospitals, Clinics & Doctors</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Integrated EHR, Outpatient Triage, Telemedicine Video Consultations, and Financial Telemetry—built for modern medical care delivery.
        </p>

        {/* Action Buttons & Portal Links */}
        <div className="pt-2 flex items-center justify-center gap-4">
          <Link
            href="/subscription"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition transform hover:scale-105 flex items-center gap-2"
          >
            <span>💎 Choose Subscription Plan</span>
          </Link>
        </div>

        {/* Dynamic Navigation Portals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
          <Link className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-2xl text-center space-y-1 transition group" href="/dashboard">
            <div className="text-2xl group-hover:scale-110 transition">🏥</div>
            <div className="text-xs font-bold text-white">Hospital Admin</div>
          </Link>
          <Link className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-2xl text-center space-y-1 transition group" href="/clinic">
            <div className="text-2xl group-hover:scale-110 transition">🩺</div>
            <div className="text-xs font-bold text-white">Outpatient Clinic</div>
          </Link>
          <Link className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-2xl text-center space-y-1 transition group" href="/doctor">
            <div className="text-2xl group-hover:scale-110 transition">👨‍⚕️</div>
            <div className="text-xs font-bold text-white">Doctor Console</div>
          </Link>
          <Link className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-2xl text-center space-y-1 transition group" href="/patient">
            <div className="text-2xl group-hover:scale-110 transition">👤</div>
            <div className="text-xs font-bold text-white">Patient Portal</div>
          </Link>
        </div>
      </section>

      {/* Operational Intelligence */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">📉📈 Operational Intelligence</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Commitment to Community Health & Recovery</h2>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-white">Monthly Patient Recovery & Triage Performance</h3>
              <div className="flex bg-slate-900 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setActiveTab('recovery')}
                  className={`px-3 py-1 rounded-lg font-bold ${activeTab === 'recovery' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                >
                  Recovery Rate (%)
                </button>
                <button
                  onClick={() => setActiveTab('triage')}
                  className={`px-3 py-1 rounded-lg font-bold ${activeTab === 'triage' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                >
                  Efficiency Index
                </button>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-4 pt-4">
              {[
                { month: 'Jan', val: 65 },
                { month: 'Feb', val: 78 },
                { month: 'Mar', val: 82 },
                { month: 'Apr', val: 88 },
                { month: 'May', val: 94 },
                { month: 'Jun', val: 99 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono text-cyan-400">{bar.val}%</span>
                  <div
                    style={{ height: `${activeTab === 'recovery' ? bar.val : bar.val - 10}%` }}
                    className="w-full bg-cyan-500/80 hover:bg-cyan-400 rounded-t-lg transition-all duration-300"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Auto-sliding Ads Carousel */}
      <section className="py-16 max-w-6xl mx-auto px-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              📢 Sponsored Healthcare Spotlights
            </span>
            <h3 className="text-xl font-black text-white mt-2">Verified Medical Partners & Products</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentAdIndex((prev) => (prev === 0 ? adCards.length - 1 : prev - 1))}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 flex items-center justify-center text-xs font-bold"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentAdIndex((prev) => (prev + 1) % adCards.length)}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 flex items-center justify-center text-xs font-bold"
            >
              →
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${adCards[currentAdIndex].badgeColor}`}>
                {adCards[currentAdIndex].tag}
              </span>
              <h4 className="text-2xl font-black text-white">{adCards[currentAdIndex].title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{adCards[currentAdIndex].desc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                {adCards[currentAdIndex].features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-emerald-400">✓</span> {feat}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition">
                  {adCards[currentAdIndex].btnText} →
                </button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center bg-slate-950 border border-slate-800/80 rounded-2xl p-8 text-7xl shadow-inner">
              {adCards[currentAdIndex].icon}
            </div>
          </div>

          <div className="flex justify-center gap-1.5 pt-6">
            {adCards.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentAdIndex(dotIdx)}
                className={`h-1.5 rounded-full transition-all ${dotIdx === currentAdIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-800'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">💬 Testimonials</span>
            <h2 className="text-2xl font-black text-white">Endorsements from Medical Experts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev, idx) => (
              <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <p className="text-xs text-slate-300 italic leading-relaxed">"{rev.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                  <div className="text-2xl">{rev.avatar}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{rev.author}</h4>
                    <p className="text-[10px] text-cyan-400">{rev.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-600">
        © 2026 APT Smart-Health. Engineered by Alpha Proficiencies Technology.
      </footer>
    </main>
  );
        }
                
