'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DoctorConsolePage() {
  const [activeTab, setActiveTab] = useState<'consult' | 'video' | 'prescribe'>('video');
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Top Console Navigation Bar */}
      <header className="bg-slate-800/80 border-b border-slate-700/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-sky-600/30">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              Dr. Telemedicine Portal
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                ● Live & Online
              </span>
            </h1>
            <p className="text-xs text-slate-400">Dr. Jamilu Sadiq (General Medicine / Tele-Consultant)</p>
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
        
        {/* Left Column: Active Video Consultation Window (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Video Stream Container */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden shadow-2xl">
            
            {isVideoActive ? (
              <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                {/* Simulated Main Patient Video Stream */}
                <div className="text-center p-6 space-y-3">
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-sky-500 mx-auto flex items-center justify-center text-3xl font-bold text-sky-400 animate-pulse">
                    AI
                  </div>
                  <h3 className="text-lg font-bold text-white">Amina Ibrahim (Patient)</h3>
                  <p className="text-xs text-emerald-400 font-mono">Encrypted WebRTC Tele-Connection (720p HD)</p>
                </div>

                {/* Picture-in-Picture Doctor Preview Stream */}
                <div className="absolute top-4 right-4 w-32 h-24 sm:w-40 sm:h-28 bg-slate-800 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden flex items-center justify-center">
                  {camOff ? (
                    <span className="text-[10px] text-slate-400 font-bold">Camera Off</span>
                  ) : (
                    <div className="text-center">
                      <span className="text-xs text-sky-400 font-bold">Dr. Jamilu (Self)</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Idle Video Call Waiting Screen */
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto text-3xl border border-sky-500/20">
                  📹
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">No Active Consultation Call</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto">
                    Select a queued patient on the right panel to initiate an encrypted end-to-end video medical consultation.
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoActive(true)}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition"
                >
                  Start Waiting Session (Patient: Amina Ibrahim)
                </button>
              </div>
            )}

            {/* In-Call Action Control Bar */}
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

          {/* Quick Doctor Notes & Diagnosis Section */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Clinical Consultation Notes
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

        {/* Right Column: Queued Appointments & E-Prescription (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Patient Queue Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's Virtual Queue (3)
              </h3>
              <span className="text-[10px] bg-sky-500/20 text-sky-400 font-bold px-2 py-0.5 rounded-full">
                Telemedicine
              </span>
            </div>

            <div className="space-y-3">
              {/* Patient Item 1 (Active) */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-sky-500/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-white">Amina Ibrahim</p>
                  <p className="text-[10px] text-slate-400">APT-8902 • Routine Follow-up</p>
                </div>
                <button
                  onClick={() => setIsVideoActive(true)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold rounded-lg transition"
                >
                  Call Now
                </button>
              </div>

              {/* Patient Item 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-slate-300">Usman Bello</p>
                  <p className="text-[10px] text-slate-500">APT-7710 • Lab Result Review</p>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                  10:45 AM
                </span>
              </div>

              {/* Patient Item 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-slate-300">Fatima Abubakar</p>
                  <p className="text-[10px] text-slate-500">APT-9122 • General Checkup</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
                  11:30 AM
                </span>
              </div>
            </div>
          </div>

          {/* Quick E-Prescription Form Card */}
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
                onClick={() => alert('E-Prescription successfully sent to Patient EHR & Integrated Pharmacy!')}
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
                
