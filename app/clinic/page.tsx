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
  status: 'In Queue' | 'With Doctor' | 'Lab Pending' | 'Completed';
  time: string;
  labResult?: string;
}

export default function ClinicOutpatientPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initial sample queue data
  const [queue, setQueue] = useState<PatientQueue[]>([
    {
      id: 'APT-8902',
      name: 'Amina Ibrahim',
      bp: '118/79',
      temp: '36.5',
      weight: '65',
      doctor: 'Dr. Jamilu Sadiq',
      status: 'In Queue',
      time: '10:15 AM',
      labResult: 'Pending Lab Request',
    },
    {
      id: 'APT-7710',
      name: 'Usman Bello',
      bp: '135/88',
      temp: '38.2',
      weight: '72',
      doctor: 'Dr. Kabir Usman',
      status: 'With Doctor',
      time: '10:30 AM',
      labResult: 'MP: Positive (++), Widal: 1:80',
    },
  ]);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Jamilu Sadiq (General Practitioner)');

  // Lab Entry State
  const [activeLabPatientId, setActiveLabPatientId] = useState<string | null>(null);
  const [labResultText, setLabResultText] = useState('');

  // Authentication Guard
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Load saved dynamic queue from localStorage
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
      alert('Please enter patient full name!');
      return;
    }

    const assignedDoc = selectedDoctor.split(' (')[0];
    const newPatient: PatientQueue = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientName,
      bp: bp || '120/80',
      temp: temp || '36.8',
      weight: weight || '70',
      doctor: assignedDoc,
      status: 'In Queue',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      labResult: 'No Lab Request Issued',
    };

    const updatedQueue = [newPatient, ...queue];
    updateQueueState(updatedQueue);

    alert(`Vitals recorded! ${patientName} queued directly for ${assignedDoc}.`);

    setPatientName('');
    setBp('');
    setTemp('');
    setWeight('');
  };

  const handleUpdateLabResult = (patientId: string) => {
    if (!labResultText.trim()) {
      alert('Please enter the lab result text before submitting.');
      return;
    }

    const updatedQueue = queue.map((patient) => {
      if (patient.id === patientId) {
        return {
          ...patient,
          labResult: labResultText,
          status: 'With Doctor' as const,
        };
      }
      return patient;
    });

    updateQueueState(updatedQueue);
    alert(`Lab result updated for patient ${patientId} and routed to Doctor's console!`);
    setActiveLabPatientId(null);
    setLabResultText('');
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
      {/* Top Console Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-emerald-600/30">
              🏥
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Standalone Private Clinic Management Portal
              </h1>
              <p className="text-[10px] text-slate-400">Direct Patient Registration, Triage & Doctor Dispatch</p>
            </div>
          </div>

          <Link
            href="/dashboard/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Patient Vitals & Direct Registration Form */}
        <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Direct Registration & Triage Vitals
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Optimized for small private clinics. Quickly capture patient vitals and send directly to the consulting physician.
            </p>
          </div>

          <form onSubmit={handleSubmitVitals} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Patient Full Name
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Mariya Shehu Ibrahim"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Blood Pressure</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Temp (°C)</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  placeholder="36.8"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Weight (KG)</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Assign Consulting Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="Dr. Jamilu Sadiq (General Practitioner)">Dr. Jamilu Sadiq (General Practitioner)</option>
                <option value="Dr. Kabir Usman (Cardiology)">Dr. Kabir Usman (Cardiology)</option>
                <option value="Dr. Zainab Aliyu (Pediatrician)">Dr. Zainab Aliyu (Pediatrician)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <span>Save Vitals & Send to Doctor Queue</span>
              <span>→</span>
            </button>
          </form>
        </div>

        {/* Dynamic Waiting Room Queue & In-Clinic Lab Dispatch */}
        <div className="lg:col-span-7 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Clinic Waiting Queue & Results
              </h2>
              <p className="text-xs text-slate-400">Live feed of active patients in consultation queue</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-black">
              {queue.length} Patients Active
            </span>
          </div>

          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900 space-y-3 transition hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {item.id}
                      </span>
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400">
                      BP: <span className="font-semibold text-slate-200">{item.bp}</span> | Temp:{' '}
                      <span className="font-semibold text-slate-200">{item.temp}°C</span> | Weight:{' '}
                      <span className="font-semibold text-slate-200">{item.weight}kg</span>
                    </p>
                    <p className="text-[11px] text-sky-400 font-medium">Assigned Doctor: {item.doctor}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'In Queue'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : item.status === 'With Doctor'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                  </div>
                </div>

                {/* Lab Result Preview / Inline Laboratory Entry for Clinic Staff */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-400">
                    <span className="font-bold text-purple-400">🔬 Lab Record:</span>{' '}
                    <span className="text-slate-300">{item.labResult || 'No Lab Result'}</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveLabPatientId(activeLabPatientId === item.id ? null : item.id);
                      setLabResultText(item.labResult !== 'Pending Lab Request' && item.labResult !== 'No Lab Request Issued' ? item.labResult || '' : '');
                    }}
                    className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-bold rounded-lg transition"
                  >
                    {activeLabPatientId === item.id ? 'Close Lab Form' : '✏️ Update Lab Result'}
                  </button>
                </div>

                {/* Inline Lab Input Box */}
                {activeLabPatientId === item.id && (
                  <div className="p-3 bg-slate-950 border border-purple-500/40 rounded-xl space-y-2 mt-2">
                    <label className="block text-[10px] font-bold uppercase text-purple-400">
                      Enter Lab Diagnostic Findings for {item.name}
                    </label>
                    <input
                      type="text"
                      value={labResultText}
                      onChange={(e) => setLabResultText(e.target.value)}
                      placeholder="e.g. Typhoid Widal: 1:160, Malaria Parasite: ++ Positive"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleUpdateLabResult(item.id)}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded-lg shadow transition"
                      >
                        Send Lab Result to Doctor Console
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
    }
    
