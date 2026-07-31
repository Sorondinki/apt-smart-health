'use client';

import React, { useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'appointments' | 'analytics'>('overview');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base leading-tight">
                APT <span className="text-cyan-400">Smart-Health</span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Hospital Admin</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'overview' ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/30' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              📊 <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'patients' ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/30' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              👥 <span>Patient Records (EHR)</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'appointments' ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/30' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              📅 <span>Appointments Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'analytics' ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/30' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              💰 <span>Revenue Analytics</span>
            </button>
          </nav>
        </div>

        {/* User Profile / Logout */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/30">
              DR
            </div>
            <div>
              <p className="font-bold text-white">Dr. Jamilu Sadiq</p>
              <p className="text-slate-400 text-[10px]">Chief Medical Admin</p>
            </div>
          </div>
          <a href="/login.html" className="text-rose-400 hover:text-rose-300 font-semibold">Exit</a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Hospital Command Center</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time stats, appointments, and financial telemetry.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Offline Sync Ready
            </span>
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md transition-all">
              + New Patient Entry
            </button>
          </div>
        </header>

        {/* Dynamic Dashboard Views */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Active Patients</span>
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-lg">👥</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900">1,248</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-2">↑ +12% from last month</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Today's Appointments</span>
                  <span className="p-2 bg-purple-50 text-purple-600 rounded-lg text-lg">📅</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900">38</h3>
                <p className="text-xs text-purple-600 font-semibold mt-2">12 Consultations Pending</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Monthly Revenue</span>
                  <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-lg">₦</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900">₦2,850,000</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-2">↑ +8.4% Paystack Auto-Billing</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Occupancy Rate</span>
                  <span className="p-2 bg-amber-50 text-amber-600 rounded-lg text-lg">🏥</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900">82%</h3>
                <p className="text-xs text-amber-600 font-semibold mt-2">18 Inpatient Beds Available</p>
              </div>
            </div>

            {/* Split Section: Patients & Appointments */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Patient Records Quick Table */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 text-base">Recent Patient Records (EHR)</h3>
                  <button onClick={() => setActiveTab('patients')} className="text-xs font-bold text-cyan-600 hover:underline">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                        <th className="pb-3">Patient ID</th>
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Condition / Status</th>
                        <th className="pb-3">Last Visit</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-3 font-bold text-slate-700">APT-8902</td>
                        <td className="py-3 font-bold text-slate-900">Amina Ibrahim</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold">Stable</span></td>
                        <td className="py-3 text-slate-500">Jul 30, 2026</td>
                        <td className="py-3 text-right"><button className="text-cyan-600 font-bold hover:underline">EHR File</button></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-700">APT-7710</td>
                        <td className="py-3 font-bold text-slate-900">Usman Bello</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-bold">Under Observation</span></td>
                        <td className="py-3 text-slate-500">Jul 31, 2026</td>
                        <td className="py-3 text-right"><button className="text-cyan-600 font-bold hover:underline">EHR File</button></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-700">APT-9122</td>
                        <td className="py-3 font-bold text-slate-900">Fatima Abubakar</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold">Routine Checkup</span></td>
                        <td className="py-3 text-slate-500">Jul 28, 2026</td>
                        <td className="py-3 text-right"><button className="text-cyan-600 font-bold hover:underline">EHR File</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Today's Appointments Schedule */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base mb-4">Appointments Calendar</h3>
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Dr. Kabir Usman (Cardiology)</p>
                      <p className="text-[11px] text-slate-500">Patient: Alhaji Musa Sani</p>
                    </div>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-lg">10:30 AM</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Dr. Zainab Aliyu (Pediatrics)</p>
                      <p className="text-[11px] text-slate-500">Patient: Hauwa Farouk</p>
                    </div>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-lg">02:00 PM</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Telemedicine Consult</p>
                      <p className="text-[11px] text-slate-500">Patient: Abubakar Garba</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg">04:15 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab View */}
        {activeTab === 'patients' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Patient EHR Records Database</h3>
            <p className="text-xs text-slate-500 mb-6">Encrypted Electronic Health Records stored securely in compliant database.</p>
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              [ Comprehensive Dynamic Patient Record Grid Active ]
            </div>
          </div>
        )}

        {/* Appointments Tab View */}
        {activeTab === 'appointments' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Hospital Appointments Calendar</h3>
            <p className="text-xs text-slate-500 mb-6">Manage doctor schedules, outpatient bookings, and telemedicine sessions.</p>
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              [ Interactive Calendar Schedule Module Active ]
            </div>
          </div>
        )}

        {/* Revenue Analytics Tab View */}
        {activeTab === 'analytics' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Financial & Revenue Analytics</h3>
            <p className="text-xs text-slate-500 mb-6">Automated billing breakdown via Paystack and Flutterwave gateways.</p>
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              [ Financial Revenue Telemetry & Reports Active ]
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
