'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DoctorConsolePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // 🔐 AUTHENTICATION & SESSION CHECK GUARD
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // DOCTOR PROFILE DATA
  const doctorProfile = {
    name: 'Dr. Jamilu Sadiq',
    specialty: 'General Medicine / Tele-Consultant',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
  };

  // PATIENT QUEUE DATA
  const [patientsQueue, setPatientsQueue] = useState([
    {
      id: 'APT-8902',
      name: 'Amina Ibrahim',
      reason: 'Routine Follow-up',
      status: 'Ready Now',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'APT-7710',
      name: 'Usman Bello',
      reason: 'Lab Result Review',
      time: '10:45 AM',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'APT-9122',
      name: 'Fatima Abubakar',
      reason: 'General Checkup',
      time: '11:30 AM',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
  ]);

  const [activePatient, setActivePatient] = useState(patientsQueue[0]);

  // Prevent UI flickers before session check completes
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
      <header className="bg-slate-800/80 border-b border-slate-700/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Doctor DP Image */}
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-sky-500/60 bg-slate-950 flex-shrink-0 shadow-lg shadow-sky-500/20">
            <img
              src={doctorProfile.avatarUrl}
              alt={doctorProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              {doctorProfile.name}
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                ● Live & Online
              </span>
            </h1>
            <p className="text-xs text-slate-400">{doctorProfile.specialty}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-xl transition text-slate-200"
          >
            ← Hospital Dashboard
          </Link>
        </div>
      </header>

      {/* Main Consultation Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Active Video Consultation Window */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden shadow-2xl">
            {isVideoActive ? (
              <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                {/* Active Patient Video Window */}
                <div className="text-center p-6 space-y-3">
                  <div className="relative w-28 h-28 rounded-full border-4 border-sky-500 mx-auto overflow-hidden shadow-2xl animate-pulse">
                    <img
                      src={activePatient.avatarUrl}
                      alt={activePatient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white">{activePatient.name} (Patient)</h3>
                  <p className="text-xs text-emerald-400 font-mono">Encrypted WebRTC Tele-Connection (720p HD)</p>
                </div>

                {/* Doctor Picture-in-Picture Preview */}
                <div className="absolute top-4 right-4 w-32 h-24 sm:w-40 sm:h-28 bg-slate-800 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden flex items-center justify-center">
                  {camOff ? (
                    <span className="text-[10px] text-slate-400 font-bold">Camera Off</span>
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={doctorProfile.avatarUrl}
                        alt={doctorProfile.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-slate-950/80 text-sky-400 text-[9px] px-1.5 py-0.5 rounded font-bold">
                        Dr. Jamilu (Self)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Idle Call Waiting Screen */
              <div className="text-center p-8 space-y-4">
                <div className="relative w-20 h-20 rounded-3xl overflow-hidden border border-sky-500/40 mx-auto shadow-lg">
                  <img
                    src={activePatient.avatarUrl}
                    alt={activePatient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Start Consultation with {activePatient.name}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto">
                    Reason: {activePatient.reason} ({activePatient.id})
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoActive(true)}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition"
                >
                  Start Encrypted Call Now
                </button>
              </div>
            )}

            {/* Video Call Controls */}
            {isVideoActive && (
              <div className="absolute bottom-4 inset-x-0 mx-auto w-fit bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700/80 flex items-center gap-4 shadow-2xl">
                <button
                  onClick={() => setMicMuted(!micMuted)}
                  className={`p-3 rounded-xl text-xs font-bold transition ${
                    micMuted ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {micMuted ? '🎙️ Unmute' : '🎙️ Mute'}
                </button>

                <button
                  onClick={() => setCamOff(!camOff)}
                  className={`p-3 rounded-xl text-xs font-bold transition ${
                    camOff ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {camOff ? '📹 Turn Cam On' : '📹 Turn Cam Off'}
                </button>

                <button
                  onClick={() => setIsVideoActive(false)}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition"
                >
                  End Call
                </button>
              </div>
            )}
          </div>

          {/* Consultation Notes Section */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Clinical Consultation Notes for {activePatient.name}
            </h3>
            <textarea
              rows={3}
              placeholder="Type patient symptoms, clinical observations, or vitals observed during the video call..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            />
            <div className="flex justify-end">
              <button className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition">
                Save Note to Patient EHR
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Patients Queue & Prescription */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's Virtual Queue ({patientsQueue.length})
              </h3>
              <span className="text-[10px] bg-sky-500/20 text-sky-400 font-bold px-2 py-0.5 rounded-full">
                Telemedicine
              </span>
            </div>

            <div className="space-y-3">
              {patientsQueue.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => setActivePatient(pat)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    activePatient.id === pat.id
                      ? 'bg-slate-900 border-sky-500/60 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                      <img
                        src={pat.avatarUrl}
                        alt={pat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{pat.name}</p>
                      <p className="text-[10px] text-slate-400">{pat.id} • {pat.reason}</p>
                    </div>
                  </div>

                  {pat.status ? (
                    <button
                      onClick={() => {
                        setActivePatient(pat);
                        setIsVideoActive(true);
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold rounded-lg transition"
                    >
                      Call Now
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                      {pat.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* E-Prescription Form Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Generate Digital E-Prescription
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol 500mg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    placeholder="2 tablets x 3 daily"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="5 Days"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>

              <button
                onClick={() => alert(`E-Prescription successfully sent for ${activePatient.name} to Patient EHR & Integrated Pharmacy!`)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
              >
                Send Prescription to Pharmacy
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
            }
            
