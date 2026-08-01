'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PatientQueue {
  id: string;
  name: string;
  bp: string;
  temp: string;
  weight: string;
  doctor: string;
  status: 'In Queue' | 'With Doctor' | 'Completed';
  time: string;
}

export default function ClinicOutpatientPage() {
  // Initial sample queue data
  const [queue, setQueue] = useState<PatientQueue[]>([
    { id: 'APT-8902', name: 'Amina Ibrahim', bp: '118/79', temp: '36.5', weight: '65', doctor: 'Dr. Jamilu Sadiq', status: 'In Queue', time: '10:15 AM' },
    { id: 'APT-7710', name: 'Usman Bello', bp: '135/88', temp: '38.2', weight: '72', doctor: 'Dr. Kabir Usman', status: 'With Doctor', time: '10:30 AM' },
  ]);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Jamilu Sadiq (General Practitioner)');

  // Load saved dynamic queue from localStorage on initial render
  useEffect(() => {
    const savedQueue = localStorage.getItem('apt_clinic_queue');
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error("Failed to parse local queue");
      }
    }
  }, []);

  // Save to localStorage whenever queue state updates
  const updateQueueState = (newQueue: PatientQueue[]) => {
    setQueue(newQueue);
    localStorage.setItem('apt_clinic_queue', JSON.stringify(newQueue));
  };

  const handleSubmitVitals = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('Da fatan za a shigar da sunan haƙuri!');
      return;
    }

    const newPatient: PatientQueue = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientName,
      bp: bp || '120/80',
      temp: temp || '36.8',
      weight: weight || '70',
      doctor: selectedDoctor.split(' (')[0],
      status: 'In Queue',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update queue dynamically
    const updatedQueue = [newPatient, ...queue];
    updateQueueState(updatedQueue);

    alert(`Vitals recorded & ${patientName} queued for ${newPatient.doctor}!`);

    // Reset Form Input Fields
    setPatientName('');
    setBp('');
    setTemp('');
    setWeight('');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Clinic & Outpatient Desk</h1>
          <p className="text-xs text-slate-500">Triage, Patient Vitals Registration & Doctor Allocation Queue</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
        >
          ← Main Portal
        </Link>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Vitals Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">New Patient Triage & Vitals Entry</h2>
            <p className="text-[11px] text-slate-500">Record patient vital signs before assigning to a physician.</p>
          </div>

          <form onSubmit={handleSubmitVitals} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                PATIENT FULL NAME
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Mariya Shehu Ibrahim"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">BLOOD PRESSURE</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">TEMP (°C)</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  placeholder="36.8"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">WEIGHT (KG)</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                ASSIGN CONSULTING DOCTOR
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Dr. Jamilu Sadiq (General Practitioner)">Dr. Jamilu Sadiq (General Practitioner)</option>
                <option value="Dr. Kabir Usman (Cardiology)">Dr. Kabir Usman (Cardiology)</option>
                <option value="Dr. Zainab Aliyu (Pediatrician)">Dr. Zainab Aliyu (Pediatrician)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-700/20 transition"
            >
              Save Vitals & Send to Doctor Queue
            </button>
          </form>
        </div>

        {/* Dynamic Waiting Room Queue */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Waiting Room Queue</h2>
              <p className="text-[11px] text-slate-500">Live feed of active patients undergoing triage or waiting for doctor call</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
              {queue.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{item.id}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    BP: <span className="font-semibold text-slate-700">{item.bp}</span> | Temp:{' '}
                    <span className="font-semibold text-slate-700">{item.temp}°C</span> | Weight:{' '}
                    <span className="font-semibold text-slate-700">{item.weight}kg</span>
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium">Assigned to: {item.doctor}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'In Queue'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : item.status === 'With Doctor'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
      }
                
