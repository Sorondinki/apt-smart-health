'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<'hospital' | 'clinic' | 'doctor' | 'patient'>('hospital');

  const portalLinks = {
    hospital: { title: 'Hospital Admin Command', path: '/dashboard/', desc: 'Full HMS, EHR, Beds & Financial Analytics' },
    clinic: { title: 'Clinic & Outpatient Desk', path: '/clinic/', desc: 'Triage, Vitals Entry & Outpatient Queue' },
    doctor: { title: 'Doctor Telemedicine Console', path: '/doctor/', desc: 'Live Video Consultation & E-Prescribing' },
    patient: { title: 'Patient Care Portal', path: '/patient/', desc: 'Book Appointments & Join Video Calls' },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-cyan-500/20">
              A
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white block leading-none">
                APT <span className="text-cyan-400">Smart-Health</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Healthcare Management Network
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login/"
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register/"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/25 transition"
            >
              Register Facility
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Unified Health Infrastructure Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Next-Gen Ecosystem for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">Hospitals, Clinics & Doctors</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Integrated EHR, Outpatient Triage, Telemedicine Video Consultations, and Financial Telemetry—built for modern medical care delivery.
        </p>
      </section>

      {/* PORTAL ACCESS SELECTOR (Babban Shafin Shiga Dashboard) */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Select Your Portal Access</h2>
            <p className="text-xs text-slate-400">Choose your role to launch your dedicated operational workspace</p>
          </div>

          {/* Role Switching Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'hospital', label: '🏥 Hospital Admin' },
              { id: 'clinic', label: '🩺 Outpatient Clinic' },
              { id: 'doctor', label: '👨‍⚕️ Doctor Console' },
              { id: 'patient', label: '👤 Patient Portal' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition border ${
                  selectedRole === role.id
                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-600/30'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* Active Portal Direct Launch Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">Selected Module</span>
              <h3 className="text-lg font-bold text-white">{portalLinks[selectedRole].title}</h3>
              <p className="text-xs text-slate-400">{portalLinks[selectedRole].desc}</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/login/"
                className="flex-1 sm:flex-none text-center px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
              >
                Login
              </Link>
              <Link
                href={portalLinks[selectedRole].path}
                className="flex-1 sm:flex-none text-center px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition"
              >
                Open Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl font-bold border border-cyan-500/20">
            🏥
          </div>
          <h3 className="text-lg font-bold text-white">Hospital Management</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manage bed occupancy, inpatient admissions, automated billing telemetry, and administrative oversight seamlessly.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-2xl font-bold border border-sky-500/20">
            📹
          </div>
          <h3 className="text-lg font-bold text-white">HD Telemedicine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Encrypted video consultations between private practitioners and remote patients with live note-taking and e-prescribing.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl font-bold border border-blue-500/20">
            🩺
          </div>
          <h3 className="text-lg font-bold text-white">Outpatient Triage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rapid vitals entry (BP, Temperature, Weight) at clinic desks with automated patient queuing to consulting doctors.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} APT Smart-Health. Engineered for Modern Medicine.</p>
      </footer>
    </div>
  );
}
