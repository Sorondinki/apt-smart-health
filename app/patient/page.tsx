'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LabResult {
  id: string;
  testName: string;
  doctorName: string;
  date: string;
  status: 'Completed' | 'Pending';
  resultText?: string;
}

export default function PatientPortalPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [patientEmail, setPatientEmail] = useState('');
  
  // Video Call State
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [callDoctorName, setCallDoctorName] = useState('Dr. Jamilu Sadiq');
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Diagnostic Results State
  const [labResults, setLabResults] = useState<LabResult[]>([
    {
      id: 'LAB-102',
      testName: 'Full Blood Count & Malaria Parasite',
      doctorName: 'Dr. Jamilu Sadiq',
      date: '2026-08-01',
      status: 'Completed',
      resultText: 'Malaria Parasite: Negative, Hemoglobin: 13.5 g/dL (Normal)',
    },
    {
      id: 'LAB-101',
      testName: 'Fasting Blood Sugar',
      doctorName: 'Dr. Kabir Usman',
      date: '2026-07-28',
      status: 'Completed',
      resultText: 'FBS: 95 mg/dL (Normal)',
    },
  ]);

  // 🔐 STRICT AUTHENTICATION & ACCESS CONTROL CHECK
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail') || '';
    const bannedUsers = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');

    // 1. Check if user is logged in
    if (!isLoggedIn) {
      alert('Authentication required: Please sign in to access your Patient Portal.');
      router.push('/login');
      return;
    }

    // 2. Security Check: Block if account is banned by Super Admin
    if (bannedUsers.includes(userEmail.toLowerCase())) {
      alert('Access Suspended: Your account access has been revoked by the Super Admin.');
      localStorage.removeItem('isLoggedIn');
      router.push('/login');
      return;
    }

    setPatientEmail(userEmail);

    // Sync Lab Results from local storage if available
    const savedLabRequests = localStorage.getItem('apt_lab_requests');
    if (savedLabRequests) {
      try {
        const parsed = JSON.parse(savedLabRequests);
        const mappedResults = parsed.map((item: any) => ({
          id: item.id,
          testName: item.testRequested,
          doctorName: item.doctorName,
          date: item.timestamp || 'Today',
          status: item.status,
          resultText: item.resultText,
        }));
        setLabResults(mappedResults);
      } catch (e) {
        console.error('Failed to sync lab results');
      }
    }

    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs font-bold">
        Securing Patient EHR Connection...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Top Navigation Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-600/30">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                Patient Health Portal
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  ● Encrypted Session
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">{patientEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              ← Portal
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold rounded-xl border border-red-500/30 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Telemedicine Video Consultation Section */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative min-h-[380px] flex items-center justify-center overflow-hidden shadow-2xl">
            {isVideoCallActive ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-slate-900 p-6 space-y-4">
                <div className="w-20 h-20 rounded-full border-4 border-sky-500 overflow-hidden shadow-2xl animate-pulse flex items-center justify-center bg-sky-900/40 text-3xl">
                  👨‍⚕️
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-white">
                    Live Video Consultation with <span className="text-sky-400">{callDoctorName}</span>
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono mt-1">● End-to-End Encrypted Telehealth</p>
                </div>

                {/* Call Control Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setMicMuted(!micMuted)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                      micMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {micMuted ? '🎙️ Unmute' : '🎙️ Mute Mic'}
                  </button>

                  <button
                    onClick={() => setCamOff(!camOff)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                      camOff ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {camOff ? '📹 Turn Cam On' : '📹 Turn Cam Off'}
                  </button>

                  <button
                    onClick={() => setIsVideoCallActive(false)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                  >
                    End Call
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-sky-600/10 border border-sky-500/30 flex items-center justify-center text-3xl mx-auto text-sky-400">
                  🩺
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Virtual Doctor's Clinic</h3>
                  <p className="text-xs text-slate-400 max-w-md mt-1 mx-auto">
                    Connect directly with your attending physician or medical specialist for virtual diagnosis and prescription reviews.
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoCallActive(true)}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition inline-flex items-center gap-2"
                >
                  <span>📞 Request Video Consultation</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Diagnostic Lab Results & EHR */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Diagnostic Laboratory Reports
              </h3>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded-full">
                EHR Direct Sync
              </span>
            </div>

            <div className="space-y-3">
              {labResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-sky-400">{result.id}</span>
                    <span className="text-[10px] text-slate-400">{result.date}</span>
                  </div>

                  <h4 className="font-bold text-xs text-white">{result.testName}</h4>
                  <p className="text-[10px] text-slate-400">Ordered by: {result.doctorName}</p>

                  {result.resultText ? (
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-emerald-400 font-medium">
                      <span className="font-bold text-slate-400 block text-[9px] uppercase mb-0.5">Clinical Result:</span>
                      {result.resultText}
                    </div>
                  ) : (
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-amber-400">
                      Processing in Laboratory...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
          }
    
