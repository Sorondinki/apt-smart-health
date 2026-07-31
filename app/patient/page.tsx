'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PatientPortalPage() {
  const [inCall, setInCall] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header Bar */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-600/30">
            P
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight">
              Patient Care Portal
            </h1>
            <p className="text-xs text-slate-400">Welcome, Amina Ibrahim (APT-8902)</p>
          </div>
        </div>

        <Link
          href="/"
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-xl transition text-slate-200"
        >
          Exit Portal
        </Link>
      </header>

      {/* Main Body */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Virtual Call Join Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-800 to-indigo-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold rounded-full uppercase">
              Scheduled Tele-Consultation
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Video Call with Dr. Jamilu Sadiq</h2>
            <p className="text-xs text-slate-300">General Consultation & Prescription Review</p>
          </div>

          <button
            onClick={() => setInCall(!inCall)}
            className={`px-8 py-4 font-bold text-sm rounded-2xl shadow-xl transition ${
              inCall
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {inCall ? 'End Video Call' : '🎥 Join Live Video Call'}
          </button>
        </div>

        {/* Video Call Simulation Box */}
        {inCall && (
          <div className="bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 text-center min-h-[350px] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center text-3xl font-bold text-indigo-400 animate-pulse">
              DR
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Connected to Dr. Jamilu Sadiq</h3>
              <p className="text-xs text-emerald-400 font-mono mt-1">● End-to-End Encrypted HD Session</p>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Speak directly to your consultant. Your doctor is reviewing your EHR records in real-time.
            </p>
          </div>
        )}

        {/* Patient Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Prescriptions */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Prescriptions (E-Pharmacy)
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-white">Paracetamol 500mg</p>
                  <p className="text-xs text-slate-400">2 tablets x 3 daily (5 Days)</p>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-lg">
                  Ready at Pharmacy
                </span>
              </div>
            </div>
          </div>

          {/* Consultation History */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Health Records (EHR)
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-white">Routine Checkup</p>
                  <p className="text-xs text-slate-400">Blood Pressure & Vitals Normal</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">July 30, 2026</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
      }
