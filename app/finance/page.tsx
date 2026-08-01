'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HospitalFinanceDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔐 AUTHENTICATION GUARD
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // PENDING BILLS FROM PHARMACY / LAB / RECEPTION
  const [pendingBills, setPendingBills] = useState([
    {
      id: 'INV-1001',
      patientName: 'Amina Ibrahim',
      patientId: 'APT-8902',
      serviceType: 'Pharmacy Order',
      description: 'Paracetamol 500mg x 1 Pack',
      amount: 1500,
      status: 'Unpaid',
    },
    {
      id: 'INV-1002',
      patientName: 'Usman Bello',
      patientId: 'APT-7710',
      serviceType: 'Doctor Consultation',
      description: 'General OPD Consultation Fee',
      amount: 3000,
      status: 'Unpaid',
    },
  ]);

  const [completedTransactions, setCompletedTransactions] = useState([
    { id: 'TX-900', patientName: 'Kabiru Sanusi', amount: 4500, type: 'Lab Test', paymentMethod: 'POS' },
    { id: 'TX-899', patientName: 'Zainab Dahiru', amount: 2000, type: 'Card Registration', paymentMethod: 'Cash' },
  ]);

  const handleProcessPayment = (billId: string, amount: number, patientName: string) => {
    alert(`Payment of ₦${amount.toLocaleString()} processed for ${patientName}! Official Receipt Printed.`);
    setPendingBills(prev => prev.filter(bill => bill.id !== billId));
    setCompletedTransactions(prev => [
      { id: `TX-${Math.floor(100 + Math.random() * 900)}`, patientName, amount, type: 'Direct Billing', paymentMethod: 'Cash' },
      ...prev,
    ]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  const totalRevenue = completedTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-amber-600/30">
              💳
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Hospital Accounts & Cashier Portal
              </h1>
              <p className="text-[10px] text-slate-400">Patient Billing & Internal Hospital Revenue</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Today's Revenue Collected</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-1">₦{totalRevenue.toLocaleString()}</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Unpaid Invoices Pending</p>
            <h2 className="text-2xl font-black text-amber-400 mt-1">{pendingBills.length} Bills</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Completed Payments</p>
            <h2 className="text-2xl font-black text-sky-400 mt-1">{completedTransactions.length} Receipts</h2>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pending Bills Column */}
          <div className="lg:col-span-7 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Patient Bills (Cashier Queue)
            </h3>

            {pendingBills.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-xs text-slate-500">
                No pending invoices awaiting payment at the cashier counter.
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
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>Collect Payment & Issue Receipt (Cash / POS)</span>
                      <span>✓</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Paid Transactions History */}
          <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Completed Receipts
            </h3>

            <div className="space-y-2">
              {completedTransactions.map(tx => (
                <div key={tx.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-200">{tx.patientName}</p>
                    <p className="text-[10px] text-slate-400">{tx.type} • {tx.paymentMethod}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-400">
                    +₦{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
      }
                        
