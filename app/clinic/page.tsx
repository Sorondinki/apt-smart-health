'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ClinicPortalPage() {
  const [patientName, setPatientName] = useState('');
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [weight, setWeight] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Jamilu Sadiq');

  const handleTriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Vitals recorded & ${patientName} queued for ${assignedDoctor}!`);
    setPatientName('');
    setBp('');
    setTemp('');
    setWeight('');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-black text-white text-xl shadow-md">
            C
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight">
              APT Outpatient & Clinic Desk
            </h1>
            <p className="text-xs text-slate-500">Triage, Vitals Check & Patient Routing</p>
          </div>
        </div>

        <Link
          href="/dashboard/"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition text-white"
        >
          ← Main Dashboard
        </Link>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Vitals Intake Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-lg border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900">New Patient Triage & Vitals Entry</h2>
            <p className="text-xs text-slate-500 mt-0.5">Record patient vital signs before assigning to a physician.</p>
          </div>

          <form onSubmit={handleTriageSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Patient Full Name
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Bello Garba"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  required
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80 mmHg"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Temp (°C)
                </label>
                <input
                  type="text"
                  required
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  placeholder="36.8 °C"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70 kg"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Assign Consulting Doctor
              </label>
              <select
                value={assignedDoctor}
                onChange={(e) => setAssignedDoctor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-600 outline-none bg-white"
              >
                <option value="Dr. Jamilu Sadiq">Dr. Jamilu Sadiq (General Practitioner)</option>
                <option value="Dr. Zainab Aliyu">Dr. Zainab Aliyu (Pediatrics)</option>
                <option value="Dr. Kabir Usman">Dr. Kabir Usman (Cardiology)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition text-sm"
            >
              Save Vitals & Send to Doctor Queue
            </button>
          </form>
        </div>

        {/* Right Column: Outpatient Queue (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-lg border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-black text-slate-900">Waiting Room Queue</h2>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-1 rounded-full">
              4 Waiting
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900">Amina Ibrahim</p>
                <p className="text-xs text-slate-500">BP: 118/79 | Temp: 36.5°C</p>
                <p className="text-[10px] text-teal-600 font-bold mt-1">Assigned to: Dr. Jamilu Sadiq</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg">
                In Queue
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900">Usman Bello</p>
                <p className="text-xs text-slate-500">BP: 135/88 | Temp: 38.2°C</p>
                <p className="text-[10px] text-teal-600 font-bold mt-1">Assigned to: Dr. Kabir Usman</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg">
                With Doctor
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
                  }
                  
