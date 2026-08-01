'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HospitalDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // 🔐 1. AUTH CHECK
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole') || 'HOSPITAL_ADMIN';
    setUserRole(role);

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // ⏳ 2. 1-MONTH SUBSCRIPTION CHECK (EXCLUDING SUPER ADMIN)
    if (role !== 'SUPER_ADMIN') {
      const regDateStr = localStorage.getItem('apt_reg_date');
      if (regDateStr) {
        const regDate = new Date(regDateStr);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - regDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If trial exceeds 30 days
        if (diffDays > 30) {
          setIsTrialExpired(true);
        }
      }
    }

    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col relative">
      
      {/* ⚠️ EXPIRED SUBSCRIPTION MODAL POPUP (BLOCKED ACCESS) */}
      {isTrialExpired && userRole !== 'SUPER_ADMIN' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-red-500/20">
              🔒
            </div>
            <h2 className="text-xl font-extrabold text-white">Free Trial Expired</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your 1-month free trial period for APT Smart-Health has ended. Please renew your subscription to continue using hospital services.
            </p>
            <div className="pt-2 space-y-2">
              <Link
                href="/subscription"
                className="block w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Renew Subscription Now →
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full py-2.5 bg-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-600/30">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                APT Health Operations Portal
                {userRole === 'SUPER_ADMIN' && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                    ★ SUPER ADMIN (UNLIMITED)
                  </span>
                )}
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
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
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

            <Link
              href="/lab/"
              className="p-4 bg-slate-900 border border-slate-700/80 rounded-2xl hover:border-purple-500 transition block"
            >
              <h4 className="font-bold text-sm text-white">🔬 Laboratory Diagnostics</h4>
              <p className="text-xs text-slate-400 mt-1">
                Dispatch lab test results directly to Doctor EHR and initiate joint video calls.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
