'use client';

import React, { useState } from 'react';

export function HealthcareAnalyticsSection() {
  const [activeTab, setActiveTab] = useState<'recovery' | 'triage' | 'uptime'>('recovery');
  

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


      
  const stats = [
    { label: 'Active Patients Served', value: '128,400+', change: '+18% this month' },
    { label: 'Avg. Consultation Speed', value: '12 Mins', change: '-35% wait time' },
    { label: 'EHR Encryption Standard', value: '256-Bit SSL', change: '100% HIPAA Compliant' },
    { label: 'Platform System Uptime', value: '99.98%', change: '24/7 Live Telemetry' },
  ];

  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full uppercase tracking-widest">
            📉📈 Real-Time Healthcare Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Jajircewa da Kwarewa Wajen Kula da Lafiyar Al'umma
          </h2>
          <p className="text-slate-400 text-sm">
            Tsarin APT Smart-Health yana taimakawa asibitoci wajen rage lokacin jiran marasa lafiya da adana bayanan magani cikin cikakken tsaro.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400 font-medium">{item.label}</p>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{item.value}</p>
              <span className="inline-block text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                {item.change}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Visual Chart Board */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📈</span> Monthly Clinical Operations Metrics
              </h3>
              <p className="text-xs text-slate-400">Live graphical distribution across hospitals & clinics network</p>
            </div>

            {/* Chart Toggle Buttons */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('recovery')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'recovery' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Patient Care Rate
              </button>
              <button
                onClick={() => setActiveTab('triage')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'triage' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Outpatient Queue
              </button>
            </div>
          </div>

          {/* SVG Visual Bars */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-8 px-2 border-b border-slate-800/80 pb-2">
            {[
              { month: 'Jan', val: 45, color: 'bg-cyan-500' },
              { month: 'Feb', val: 62, color: 'bg-cyan-500' },
              { month: 'Mar', val: 55, color: 'bg-cyan-500' },
              { month: 'Apr', val: 78, color: 'bg-cyan-500' },
              { month: 'May', val: 88, color: 'bg-cyan-500' },
              { month: 'Jun', val: 94, color: 'bg-emerald-500' },
              { month: 'Jul', val: 98, color: 'bg-emerald-400' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                  {activeTab === 'recovery' ? `${bar.val}%` : `${bar.val * 120} pts`}
                </span>
                <div
                  style={{ height: `${activeTab === 'recovery' ? bar.val : bar.val - 15}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 ${bar.color} opacity-80 group-hover:opacity-100 group-hover:scale-105 shadow-lg shadow-cyan-500/10`}
                />
                <span className="text-[10px] text-slate-500 font-bold">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Live Hospital Sync
            </span>
            <span className="font-mono text-[11px] text-slate-500">Updated Real-Time</span>
          </div>
        </div>
      </div>
    </section>
  );
      }
    
      
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


      export function TestimonialsSection() {
  const reviews = [
    {
      quote:
        'APT Smart-Health ya sauya yadda muke gudanar da marasa lafiya a asibitinmu. Yanzu komai yana tafiya cikin takaitaccen lokaci ba tare da bata lokaci a layi ba.',
      author: 'Dr. Kabir Usman',
      title: 'Chief Medical Director, Kano Specialist Hospital',
      avatar: '👨‍⚕️',
    },
    {
      quote:
        'Tsarin Telemedicine da E-Prescription dake ciki yana bamu damar duba marasa lafiya daga nesa cikin sauki da cike da tsaro.',
      author: 'Dr. Amina Aliyu',
      title: 'Consultant Gynecologist, City Care Clinic',
      avatar: '👩‍⚕️',
    },
    {
      quote:
        'Gudanar da harkar kudi da Paystack integration yana bamu cikakken rahoton abin da ke shigo wa kowace rana ba tare da kuskure ba.',
      author: 'Ibrahim Sani',
      title: 'Head of Health IT & Operations',
      avatar: '💻',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase">
            💬 What Healthcare Leaders Say
          </span>
          <h2 className="text-3xl font-black text-white">Shaidar Kwararrun Likitoci & Asibitoci</h2>
          <p className="text-slate-400 text-xs">
            A duba abin da likitoci da manajoji ke fada game da saukin da APT Smart-Health ya kawo a aikin yau da kullum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-cyan-500/50 transition duration-300"
            >
              <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                  <p className="text-[10px] text-cyan-400">{rev.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
              }
      

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} APT Smart-Health. Engineered for Modern Medicine.</p>
      </footer>
    </div>
  );
}
