'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HospitalDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication Session Check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-600/30">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                APT Health Operations Portal
              </h1>
              <p className="text-[10px] text-slate-400">Hospital Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/doctor/"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Doctor Console →
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Active Telemedicine Calls</p>
            <h2 className="text-2xl font-black text-white mt-1">12</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Pending Consultations</p>
            <h2 className="text-2xl font-black text-amber-400 mt-1">8</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Available On-Duty Doctors</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-1">5</h2>
          </div>
        </div>

        {/* Quick Actions Navigation */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">
            Quick Navigation Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/doctor/"
              className="p-4 bg-slate-900 border border-slate-700/80 rounded-2xl hover:border-sky-500 transition block"
            >
              <h4 className="font-bold text-sm text-white">👨‍⚕️ Telemedicine Console</h4>
              <p className="text-xs text-slate-400 mt-1">
                Access active clinical video consultations, digital prescriptions, and patient records.
              </p>
            </Link>

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl opacity-75">
              <h4 className="font-bold text-sm text-slate-300">📊 Pharmacy Integration</h4>
              <p className="text-xs text-slate-500 mt-1">
                Manage incoming electronic prescriptions and drug inventory.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
            }
