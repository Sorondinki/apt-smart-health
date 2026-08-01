'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HospitalDashboardPage() {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patients, setPatients] = useState([
    { id: 'APT-8902', name: 'Amina Ibrahim', condition: 'Stable', lastVisit: 'Jul 30, 2026', doctor: 'Dr. Kabir Usman' },
    { id: 'APT-7710', name: 'Usman Bello', condition: 'Under Observation', lastVisit: 'Jul 31, 2026', doctor: 'Dr. Zainab Aliyu' },
    { id: 'APT-9122', name: 'Fatima Abubakar', condition: 'Routine Checkup', lastVisit: 'Jul 28, 2026', doctor: 'Dr. Jamilu Sadiq' },
  ]);

  const [formData, setFormData] = useState({ name: '', condition: 'Routine Checkup', doctor: 'Dr. Jamilu Sadiq' });

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newEntry = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      condition: formData.condition,
      lastVisit: 'Today',
      doctor: formData.doctor,
    };

    setPatients([newEntry, ...patients]);
    setFormData({ name: '', condition: 'Routine Checkup', doctor: 'Dr. Jamilu Sadiq' });
    setShowPatientModal(false);
    alert(`An yi wa ${formData.name} rijista lami lafiya kuma an damka shi zuwa wajen ${formData.doctor}!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-2xl flex items-center justify-center font-black text-slate-950 text-xl">
            A
          </div>
          <div>
            <h1 className="font-black text-white text-sm tracking-wider">APT Smart-Health</h1>
            <span className="text-[10px] text-cyan-400 font-bold uppercase">Hospital Admin</span>
          </div>
        </div>

        <nav className="space-y-2 text-xs font-bold">
          <Link href="/dashboard/" className="flex items-center gap-3 px-4 py-3 bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 rounded-2xl">
            <span>📊</span> Dashboard Overview
          </Link>
          <Link href="/dashboard/staff/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-2xl transition">
            <span>👨‍⚕️</span> Recruit & Staff Portal
          </Link>
          <Link href="/clinic/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-2xl transition">
            <span>🩺</span> Outpatient Clinic
          </Link>
          <Link href="/doctor/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-2xl transition">
            <span>👨‍⚕️</span> Doctor Console
          </Link>
          <Link href="/patient/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-2xl transition">
            <span>👤</span> Patient Self-Portal
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 space-y-8">
        {/* Top Command Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Hospital Command Center</h1>
            <p className="text-xs text-slate-400">Real-time stats, appointments, and financial telemetry</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/staff/"
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 text-xs font-bold text-slate-200 rounded-xl transition flex items-center gap-2"
            >
              <span>👨‍⚕️</span> Manage Staff
            </Link>
            <button
              onClick={() => setShowPatientModal(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition flex items-center gap-2"
            >
              <span>+</span> New Patient Entry
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Active Patients</p>
            <p className="text-2xl font-black text-white">{patients.length + 1245}</p>
            <span className="text-[10px] text-emerald-400 font-bold">+12% from last month</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Today's Appointments</p>
            <p className="text-2xl font-black text-white">38</p>
            <span className="text-[10px] text-cyan-400 font-bold">12 Consultations Pending</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Revenue</p>
            <p className="text-2xl font-black text-white">₦2,850,000</p>
            <span className="text-[10px] text-emerald-400 font-bold">+8.4% Paystack Auto-Billing</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Occupancy Rate</p>
            <p className="text-2xl font-black text-white">82%</p>
            <span className="text-[10px] text-amber-400 font-bold">18 Inpatient Beds Available</span>
          </div>
        </div>

        {/* Patient EHR Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recent Patient Records (EHR)</h2>
            <span className="text-xs font-bold text-cyan-400">Live Hospital Database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Condition / Status</th>
                  <th className="p-3">Assigned Physician</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {patients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{pat.id}</td>
                    <td className="p-3 font-bold text-white">{pat.name}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-slate-800 rounded-md text-[10px] font-bold border border-slate-700 text-emerald-400">
                        {pat.condition}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{pat.doctor}</td>
                    <td className="p-3">
                      <button className="text-cyan-400 hover:underline text-[11px] font-bold">View EHR File</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 🚀 MODAL FORM: NEW PATIENT ENTRY */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Register Walk-In Patient</h3>
                <p className="text-[11px] text-slate-400">Shigar da bayanan marar lafiya a take</p>
              </div>
              <button onClick={() => setShowPatientModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Mariya Shehu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Medical Condition / Reason</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                >
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Emergency Triage">Emergency Triage</option>
                  <option value="Under Observation">Under Observation</option>
                  <option value="Lab Test Request">Lab Test Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assign Doctor / Consultant</label>
                <select
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                >
                  <option value="Dr. Jamilu Sadiq">Dr. Jamilu Sadiq (General Practice)</option>
                  <option value="Dr. Kabir Usman">Dr. Kabir Usman (Cardiology)</option>
                  <option value="Dr. Zainab Aliyu">Dr. Zainab Aliyu (Pediatrics)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPatientModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl">
                  Save & Assign Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
              }
          
