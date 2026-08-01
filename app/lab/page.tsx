'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LabRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  testRequested: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  resultText?: string;
  timestamp: string;
}

export default function LaboratoryConsolePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [callTarget, setCallTarget] = useState<'Doctor' | 'Patient' | 'Multi-Party (Doctor & Patient)'>('Doctor');
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Lab Requests State
  const [labRequests, setLabRequests] = useState<LabRequest[]>([
    {
      id: 'LAB-102',
      patientId: 'APT-8902',
      patientName: 'Amina Ibrahim',
      doctorName: 'Dr. Jamilu Sadiq',
      testRequested: 'Full Blood Count & Malaria Parasite',
      status: 'Pending',
      timestamp: '10:30 AM',
    },
    {
      id: 'LAB-101',
      patientId: 'APT-7710',
      patientName: 'Usman Bello',
      doctorName: 'Dr. Kabir Usman',
      testRequested: 'Typhoid Widal & Fasting Blood Sugar',
      status: 'Completed',
      resultText: 'Widal: 1:160 Positive, FBS: 110 mg/dL',
      timestamp: '09:15 AM',
    },
  ]);

  const [activeRequest, setActiveRequest] = useState<LabRequest>(labRequests[0]);
  const [testResultInput, setTestResultInput] = useState('');

  // 🔐 AUTHENTICATION CHECK
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync with Local Storage for Cross-Page Communication
  useEffect(() => {
    const savedLabRequests = localStorage.getItem('apt_lab_requests');
    if (savedLabRequests) {
      try {
        setLabRequests(JSON.parse(savedLabRequests));
      } catch (e) {
        console.error('Failed to parse lab requests');
      }
    }
  }, []);

  const saveAndSyncLabRequests = (updatedList: LabRequest[]) => {
    setLabRequests(updatedList);
    localStorage.setItem('apt_lab_requests', JSON.stringify(updatedList));
  };

  const handleDispatchResult = () => {
    if (!testResultInput.trim()) {
      alert('Please enter clinical lab findings before dispatching.');
      return;
    }

    const updatedList = labRequests.map((req) => {
      if (req.id === activeRequest.id) {
        return {
          ...req,
          status: 'Completed' as const,
          resultText: testResultInput,
        };
      }
      return req;
    });

    saveAndSyncLabRequests(updatedList);

    // Also update current active request state
    setActiveRequest((prev) => ({
      ...prev,
      status: 'Completed',
      resultText: testResultInput,
    }));

    alert(`Lab result successfully dispatched to ${activeRequest.doctorName} & saved to Patient EHR!`);
    setTestResultInput('');
  };

  const startVideoCall = (target: 'Doctor' | 'Patient' | 'Multi-Party (Doctor & Patient)') => {
    setCallTarget(target);
    setIsVideoActive(true);
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
      {/* Top Header Navigation */}
      <header className="bg-slate-800/80 border-b border-slate-700/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-extrabold text-xl shadow-lg shadow-purple-500/10">
            🔬
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              Laboratory Diagnostics Portal
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                ● Live Sync Active
              </span>
            </h1>
            <p className="text-xs text-slate-400">Pathology & Diagnostics Department</p>
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

      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Live Tele-consult / Multi-Party Video Console */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Encrypted Video Call Window */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden shadow-2xl">
            {isVideoActive ? (
              <div className="w-full h-full relative flex items-center justify-center bg-slate-900 p-6">
                <div className="text-center space-y-3">
                  <div className="relative w-24 h-24 rounded-full border-4 border-purple-500 mx-auto overflow-hidden shadow-2xl animate-pulse flex items-center justify-center bg-purple-900/40 text-3xl">
                    📹
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Active Tele-Consultation with: <span className="text-purple-400">{callTarget}</span>
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono">
                    Patient: {activeRequest.patientName} ({activeRequest.patientId})
                  </p>
                </div>

                {/* Picture-in-Picture Preview */}
                <div className="absolute top-4 right-4 w-36 h-24 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-center text-[10px] text-slate-400 font-bold p-2 text-center">
                  {camOff ? 'Camera Off' : 'Lab Tech Self Preview'}
                </div>
              </div>
            ) : (
              /* Waiting Screen & Call Dispatcher */
              <div className="text-center p-8 space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-2xl mx-auto">
                  📞
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Multi-Party Telemedicine Calling Desk
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mt-1 mx-auto">
                    Initiate instant video consultation with the consulting doctor, patient, or connect both simultaneously to discuss critical diagnostic findings.
                  </p>
                </div>

                {/* Call Dispatch Options */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => startVideoCall('Doctor')}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                  >
                    Call Doctor ({activeRequest.doctorName})
                  </button>
                  <button
                    onClick={() => startVideoCall('Patient')}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                  >
                    Call Patient ({activeRequest.patientName})
                  </button>
                  <button
                    onClick={() => startVideoCall('Multi-Party (Doctor & Patient)')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                  >
                    👥 3-Way Joint Call
                  </button>
                </div>
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
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                >
                  End Call
                </button>
              </div>
            )}
          </div>

          {/* Test Result Input & Dispatcher Form */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Enter & Dispatch Test Findings for {activeRequest.patientName} ({activeRequest.patientId})
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Ordered by: {activeRequest.doctorName}</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-xs text-slate-300">
              <span className="font-bold text-slate-400 uppercase text-[10px] block mb-0.5">Test Requested:</span>
              <p className="font-semibold text-white">{activeRequest.testRequested}</p>
            </div>

            <textarea
              rows={3}
              value={testResultInput}
              onChange={(e) => setTestResultInput(e.target.value)}
              placeholder="Enter detailed clinical findings, lab values, or pathology observations..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleDispatchResult}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition flex items-center gap-2"
              >
                <span>Dispatch Result to Doctor & EHR</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Lab Requests Queue */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Laboratory Orders Queue ({labRequests.length})
              </h3>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full">
                Diagnostics
              </span>
            </div>

            <div className="space-y-3">
              {labRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => {
                    setActiveRequest(req);
                    if (req.resultText) setTestResultInput(req.resultText);
                    else setTestResultInput('');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    activeRequest.id === req.id
                      ? 'bg-slate-900 border-purple-500/60 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-purple-400">{req.id}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        req.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white">{req.patientName}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{req.testRequested}</p>

                  {req.resultText && (
                    <div className="mt-2 p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-[10px] text-emerald-400">
                      <span className="font-bold text-slate-400">Result:</span> {req.resultText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
      }
          
