'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Inpatient {
  id: string;
  patientName: string;
  bedNumber: string;
  ward: string;
  assignedDoctor: string;
  bp: string;
  temp: string;
  pulse: string;
  medicationStatus: 'DUE' | 'ADMINISTERED' | 'PENDING';
}

export default function NursingStationPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nurseEmail, setNurseEmail] = useState('');

  // Active Selected Ward
  const [activeWard, setActiveWard] = useState<'MALE_WARD' | 'FEMALE_WARD' | 'PEDIATRICS' | 'ICU'>('MALE_WARD');

  // Inpatients List State
  const [patients, setPatients] = useState<Inpatient[]>([
    {
      id: 'ADM-101',
      patientName: 'Musa Abdullahi',
      bedNumber: 'Bed 04',
      ward: 'MALE_WARD',
      assignedDoctor: 'Dr. Aminu Kano',
      bp: '120/80 mmHg',
      temp: '36.8 °C',
      pulse: '72 bpm',
      medicationStatus: 'DUE',
    },
    {
      id: 'ADM-102',
      patientName: 'Ibrahim Garba',
      bedNumber: 'Bed 09',
      ward: 'MALE_WARD',
      assignedDoctor: 'Dr. Jamilu Sadiq',
      bp: '135/90 mmHg',
      temp: '38.1 °C',
      pulse: '88 bpm',
      medicationStatus: 'ADMINISTERED',
    },
    {
      id: 'ADM-201',
      patientName: 'Zainab Bello',
      bedNumber: 'Bed 02',
      ward: 'FEMALE_WARD',
      assignedDoctor: 'Dr. Aisha Zaria',
      bp: '118/75 mmHg',
      temp: '36.5 °C',
      pulse: '70 bpm',
      medicationStatus: 'PENDING',
    },
  ]);

  // Vitals Update Modal
  const [selectedPatient, setSelectedPatient] = useState<Inpatient | null>(null);
  const [vitalsInput, setVitalsInput] = useState({ bp: '', temp: '', pulse: '' });

  // 🔐 NURSE AUTH SECURITY GUARD
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail') || '';

    if (!isLoggedIn) {
      alert('Authentication required: Please login to enter Nursing Station.');
      router.push('/apt-login');
      return;
    }

    setNurseEmail(userEmail);
    setIsAuthenticated(true);
  }, [router]);

  const handleUpdateVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? {
              ...p,
              bp: vitalsInput.bp || p.bp,
              temp: vitalsInput.temp || p.temp,
              pulse: vitalsInput.pulse || p.pulse,
            }
          : p
      )
    );

    setSelectedPatient(null);
  };

  const markMedicationDone = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, medicationStatus: 'ADMINISTERED' } : p))
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs font-bold">
        Connecting to Central Nursing Station Database...
      </div>
    );
  }

  const filteredPatients = patients.filter((p) => p.ward === activeWard);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* Header Bar */}
      <header className="border-b border-rose-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-rose-600/30">
              🩺
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-rose-400 tracking-tight flex items-center gap-2">
                APT Central Nursing Station
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  WARD & INPATIENT COMMAND
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">{nurseEmail}</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/apt-login');
            }}
            className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold rounded-xl border border-red-500/30 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Ward Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'MALE_WARD', label: '🛏️ Male Ward' },
            { id: 'FEMALE_WARD', label: '👩‍🛏️ Female Ward' },
            { id: 'PEDIATRICS', label: '👶 Pediatrics Ward' },
            { id: 'ICU', label: '🚨 Intensive Care Unit (ICU)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveWard(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeWard === tab.id
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inpatients Monitor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              No admitted patients currently recorded in this ward.
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative">
                
                {/* Bed & Name Header */}
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-mono font-bold text-[10px]">
                      {patient.bedNumber}
                    </span>
                    <h3 className="font-extrabold text-base text-white mt-1.5">{patient.patientName}</h3>
                    <p className="text-[10px] text-slate-400">Doctor in Charge: {patient.assignedDoctor}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{patient.id}</span>
                </div>

                {/* Vitals Summary */}
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Blood Press.</p>
                    <p className="text-xs font-bold text-sky-400 mt-0.5">{patient.bp}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Temp</p>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">{patient.temp}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Pulse</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">{patient.pulse}</p>
                  </div>
                </div>

                {/* Medication Status Bar */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] font-bold text-slate-400">Medication Dose:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      patient.medicationStatus === 'ADMINISTERED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {patient.medicationStatus === 'ADMINISTERED' ? '✓ Administered' : '● Dose Due'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setVitalsInput({ bp: patient.bp, temp: patient.temp, pulse: patient.pulse });
                    }}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
                  >
                    📝 Update Vitals
                  </button>

                  <button
                    onClick={() => markMedicationDone(patient.id)}
                    disabled={patient.medicationStatus === 'ADMINISTERED'}
                    className="py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-600/20"
                  >
                    💊 Give Meds
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </main>

      {/* MODAL: UPDATE VITALS */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">
              Update Patient Vitals — <span className="text-rose-400">{selectedPatient.patientName}</span>
            </h3>

            <form onSubmit={handleUpdateVitals} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure (BP)</label>
                <input
                  type="text"
                  placeholder="e.g. 120/80 mmHg"
                  value={vitalsInput.bp}
                  onChange={(e) => setVitalsInput({ ...vitalsInput, bp: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Body Temperature</label>
                <input
                  type="text"
                  placeholder="e.g. 36.8 °C"
                  value={vitalsInput.temp}
                  onChange={(e) => setVitalsInput({ ...vitalsInput, temp: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Pulse Rate</label>
                <input
                  type="text"
                  placeholder="e.g. 72 bpm"
                  value={vitalsInput.pulse}
                  onChange={(e) => setVitalsInput({ ...vitalsInput, pulse: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
    }
                
