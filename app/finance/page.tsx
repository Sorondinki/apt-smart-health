'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FinanceDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState(3); // Example trial state

  // PENDING PATIENT BILLS SENT FROM PHARMACY / DOCTORS / RECEPTION
  const [pendingBills, setPendingBills] = useState([
    {
      id: 'INV-1001',
      patientName: 'Amina Ibrahim',
      patientId: 'APT-8902',
      serviceType: 'Pharmacy Order',
      description: 'Paracetamol 500mg x 1 Pack',
      amount: 1500,
      status: 'Unpaid',
      date: '2026-08-01',
    },
    {
      id: 'INV-1002',
      patientName: 'Usman Bello',
      patientId: 'APT-7710',
      serviceType: 'Doctor Consultation',
      description: 'General OPD Consultation Fee',
      amount: 3000,
      status: 'Unpaid',
      date: '2026-08-01',
    },
    {
      id: 'INV-1003',
      patientName: 'Fatima Abubakar',
      patientId: 'APT-5501',
      serviceType: 'Online Private Consultation',
      description: 'Virtual Telemedicine Call (Tier 1)',
      amount: 5000,
      status: 'Unpaid',
      date: '2026-08-01',
    },
  ]);

  const [completedTransactions, setCompletedTransactions] = useState([
    { id: 'TX-900', patientName: 'Kabiru Sanusi', amount: 4500, type: 'Lab Test', date: '2026-08-01' },
    { id: 'TX-899', patientName: 'Zainab Dahiru', amount: 2000, type: 'Card Registration', date: '2026-08-01' },
  ]);

  // 🔐 AUTHENTICATION & SUBSCRIPTION CHECK GUARD
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
      return;
    }
    setIsAuthenticated(true);

    // Check Subscription status (Simulated with localStorage or state)
    const subStatus = localStorage.getItem('subscription_active');
    if (subStatus === 'expired') {
      setHasActiveSubscription(false);
    }
  }, []);

  const handleProcessPayment = (billId: string, amount: number, patientName: string) => {
    alert(`Payment of ₦${amount.toLocaleString()} received for ${patientName}. Receipt generated!`);
    setPendingBills(prev => prev.filter(bill => bill.id !== billId));
    setCompletedTransactions(prev => [
      { id: `TX-${Math.floor(100 + Math.random() * 900)}`, patientName, amount, type: 'Direct Billing', date: '2026-08-01' },
      ...prev,
    ]);
  };

  const handleActivateSubscription = (planName: string) => {
    alert(`Redirecting to Paystack gateway for ${planName} activation...`);
    localStorage.setItem('subscription_active', 'active');
    setHasActiveSubscription(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  // 🚫 BLOCKING MODAL IF FREE TRIAL / SUBSCRIPTION IS EXPIRED
  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900 border border-red-500/30 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-3xl">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Subscription / Free Trial Expired</h2>
            <p className="text-xs text-slate-400">
              Access to your APT Health Portal has been temporarily locked. Please select a subscription tier below to continue serving your patients and managing revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                Tier 1
              </span>
              <h4 className="font-bold text-sm text-white">Private Consultant Plan</h4>
              <p className="text-[11px] text-slate-400">For solo doctors offering direct online consultations.</p>
              <p className="text-base font-black text-white">₦15,000 <span className="text-[10px] text-slate-400">/ month</span></p>
              <button
                onClick={() => handleActivateSubscription('Tier 1 Private Consultant')}
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition"
              >
                Pay & Unlock
              </button>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Tier 2
              </span>
              <h4 className="font-bold text-sm text-white">Hospital / Clinic Pro</h4>
              <p className="text-[11px] text-slate-400">Full reception, pharmacy, lab, and staff access.</p>
              <p className="text-base font-black text-white">₦45,000 <span className="text-[10px] text-slate-400">/ month</span></p>
              <button
                onClick={() => handleActivateSubscription('Tier 2 Hospital Pro')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
              >
                Pay & Unlock
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = completedTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-amber-600/30">
              💳
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                APT Revenue & Cashier Billing Console
              </h1>
              <p className="text-[10px] text-slate-400">Payroll, Invoicing & Subscription Status</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              Trial Active: {trialDaysLeft} Days Remaining
            </span>
            <Link
              href="/dashboard/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* REVENUE OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Today's Collection</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-1">₦{totalRevenue.toLocaleString()}</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Pending Unpaid Invoices</p>
            <h2 className="text-2xl font-black text-amber-400 mt-1">{pendingBills.length} Bills</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Estimated Monthly Payroll</p>
            <h2 className="text-2xl font-black text-sky-400 mt-1">₦450,000</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Platform Subscription Tier</p>
            <h2 className="text-xl font-black text-purple-400 mt-1">Tier 2 Pro</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PENDING BILLS LIST */}
          <div className="lg:col-span-7 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Unpaid Invoices Sent to Cashier
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                Pending Cash/Transfer
              </span>
            </div>

            {pendingBills.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-xs text-slate-500">
                No pending bills awaiting payment.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingBills.map(bill => (
                  <div key={bill.id} className="p-4 bg-slate-900 border border-slate-700/80 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {bill.id}
                        </span>
                        <h4 className="font-extrabold text-sm text-white mt-1">{bill.patientName} ({bill.patientId})</h4>
                        <p className="text-[11px] text-slate-400">{bill.serviceType} • {bill.description}</p>
                      </div>
                      <span className="text-sm font-black text-emerald-400">
                        ₦{bill.amount.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleProcessPayment(bill.id, bill.amount, bill.patientName)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>Approve & Collect Payment (Cash / POS)</span>
                      <span>✓</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MONETIZATION & SUBSCRIPTION OPTIONS FOR SYSTEM OWNER */}
          <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monetization & Software Tiers
            </h3>

            <div className="space-y-3">
              {/* TIER 1 */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                    TIER 1: PRIVATE CONSULTANT
                  </span>
                  <span className="text-xs font-black text-white">₦15,000 / mo</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Designed for independent private doctors offering direct online calls/prescriptions without a physical hospital.
                </p>
              </div>

              {/* TIER 2 */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    TIER 2: CLINIC / SMALL HOSPITAL
                  </span>
                  <span className="text-xs font-black text-white">₦35,000 / mo</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Standalone registration, maximum 5 staff logins, pharmacy stock, and cashier module.
                </p>
              </div>

              {/* TIER 3 */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    TIER 3: FULL HOSPITAL ENTERPRISE
                  </span>
                  <span className="text-xs font-black text-white">₦75,000 / mo</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Unlimited staff logins, centralized reception files, lab integration, multi-doctor call queues, and automated monthly staff payroll.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
    }
              
