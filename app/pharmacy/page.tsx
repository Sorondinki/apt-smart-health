'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PharmacyDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔐 AUTHENTICATION GUARD
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // INCOMING PRESCRIPTIONS FROM DOCTORS
  const [pendingPrescriptions, setPendingPrescriptions] = useState([
    {
      id: 'RX-901',
      patientName: 'Amina Ibrahim',
      patientId: 'APT-8902',
      doctorName: 'Dr. Jamilu Sadiq',
      medication: 'Paracetamol 500mg',
      dosage: '2 tabs x 3 daily (5 Days)',
      unitPrice: 1500,
      status: 'Pending Valuation',
    },
    {
      id: 'RX-902',
      patientName: 'Usman Bello',
      patientId: 'APT-7710',
      doctorName: 'Dr. Jamilu Sadiq',
      medication: 'Amoxicillin 250mg',
      dosage: '1 cap x 2 daily (7 Days)',
      unitPrice: 3200,
      status: 'Pending Valuation',
    },
  ]);

  // DRUG INVENTORY LIST
  const [inventory] = useState([
    { id: 'DRG-01', name: 'Paracetamol 500mg', stock: 450, category: 'Analgesics', price: 1500 },
    { id: 'DRG-02', name: 'Amoxicillin 250mg', stock: 120, category: 'Antibiotics', price: 3200 },
    { id: 'DRG-03', name: 'Ciprofloxacin 500mg', stock: 85, category: 'Antibiotics', price: 4500 },
    { id: 'DRG-04', name: 'Ibuprofen 400mg', stock: 300, category: 'NSAIDs', price: 1800 },
  ]);

  const handleSendToFinance = (prescriptionId: string, patientName: string, amount: number) => {
    alert(`Bill of ₦${amount.toLocaleString()} for ${patientName} (${prescriptionId}) successfully generated and dispatched to Finance / Accounts section!`);
    setPendingPrescriptions(prev => prev.filter(item => item.id !== prescriptionId));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-emerald-600/30">
              💊
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                APT Pharmacy & Dispensary Module
              </h1>
              <p className="text-[10px] text-slate-400">Inventory & E-Prescription Fulfillment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              ← Hospital Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Incoming Doctor Orders</p>
            <h2 className="text-2xl font-black text-amber-400 mt-1">{pendingPrescriptions.length} Orders</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Inventory Items</p>
            <h2 className="text-2xl font-black text-sky-400 mt-1">{inventory.length} Products</h2>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Low Stock Alerts</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-1">0 Items</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pending Prescriptions Column */}
          <div className="lg:col-span-7 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Incoming E-Prescriptions from Doctors
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                Action Required
              </span>
            </div>

            {pendingPrescriptions.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-xs text-slate-500">
                No pending prescriptions to process.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPrescriptions.map(rx => (
                  <div key={rx.id} className="p-4 bg-slate-900 border border-slate-700/80 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                          {rx.id}
                        </span>
                        <h4 className="font-extrabold text-sm text-white mt-1">{rx.patientName} ({rx.patientId})</h4>
                        <p className="text-[11px] text-slate-400">Prescribed by {rx.doctorName}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        ₦{rx.unitPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1">
                      <p className="text-slate-200 font-bold">💊 {rx.medication}</p>
                      <p className="text-slate-400 text-[11px]">Dosage: {rx.dosage}</p>
                    </div>

                    <button
                      onClick={() => handleSendToFinance(rx.id, rx.patientName, rx.unitPrice)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>Send Bill to Finance Section</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pharmacy Drug Stock Column */}
          <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pharmacy Drug Stock & Catalog
            </h3>

            <input
              type="text"
              placeholder="Search medication..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 transition"
            />

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {inventory
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(item => (
                  <div key={item.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-200">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.category} • ₦{item.price.toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      In Stock: {item.stock}
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
           
