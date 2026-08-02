'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HospitalEntity {
  id: string;
  name: string;
  city: string;
  status: 'Online' | 'In Call' | 'Offline';
  type: 'Hospital';
}

interface AgentEntity {
  id: string;
  name: string;
  region: string;
  status: 'Online' | 'In Call' | 'Offline';
  type: 'Agent';
}

export default function ManagingDirectorOfficePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mdEmail, setMdEmail] = useState('');

  // Call States
  const [activeCallType, setActiveCallType] = useState<'NONE' | 'INDIVIDUAL' | 'CONFERENCE'>('NONE');
  const [targetEntity, setTargetEntity] = useState<HospitalEntity | AgentEntity | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Hardcoded MD Security Email
  const MD_SUPER_EMAIL = 'sorondinkiseeme@gmail.com';

  // Hospitals Directory
  const [hospitals] = useState<HospitalEntity[]>([
    { id: 'HOSP-101', name: 'Aminu Kano Teaching Hospital', city: 'Kano', status: 'Online', type: 'Hospital' },
    { id: 'HOSP-102', name: 'Nassarawa Specialist Hospital', city: 'Kano', status: 'Online', type: 'Hospital' },
    { id: 'HOSP-103', name: 'National Hospital Abuja', city: 'Abuja', status: 'In Call', type: 'Hospital' },
  ]);

  // APT Official Agents Directory
  const [agents] = useState<AgentEntity[]>([
    { id: 'AGT-001', name: 'Engr. Jamilu Sadiq (Sorondinki)', region: 'Headquarters', status: 'Online', type: 'Agent' },
    { id: 'AGT-002', name: 'Ahmad Kano Field Agent', region: 'Kano Zone', status: 'Online', type: 'Agent' },
    { id: 'AGT-003', name: 'Usman Kaduna Rep', region: 'Kaduna Zone', status: 'Offline', type: 'Agent' },
  ]);

  // 🔐 STRICT SECURITY CHECK FOR MD OFFICE
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail') || '';
    const bannedUsers = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');

    if (!isLoggedIn) {
      alert('Security Alert: Authentication required to enter MD Executive Office.');
      router.push('/apt-login');
      return;
    }

    if (bannedUsers.includes(userEmail.toLowerCase())) {
      alert('Access Denied: Your credentials have been revoked.');
      localStorage.removeItem('isLoggedIn');
      router.push('/apt-login');
      return;
    }

    // Verify if email is MD
    if (userEmail.toLowerCase() !== MD_SUPER_EMAIL.toLowerCase()) {
      alert('Unauthorized Access: Managing Director Clearance Required.');
      router.push('/dashboard');
      return;
    }

    setMdEmail(userEmail);
    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/apt-login');
  };

  const startIndividualCall = (entity: HospitalEntity | AgentEntity) => {
    setTargetEntity(entity);
    setActiveCallType('INDIVIDUAL');
  };

  const startExecutiveConference = () => {
    setTargetEntity(null);
    setActiveCallType('CONFERENCE');
  };

  const endCall = () => {
    setActiveCallType('NONE');
    setTargetEntity(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs font-bold">
        Verifying MD Executive Cryptographic Clearance...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Executive Gold/Purple Header */}
      <header className="border-b border-amber-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              👑
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-amber-400 tracking-tight flex items-center gap-2">
                Managing Director Executive Office
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  ★ MD FULL COMMAND
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">{mdEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/"
              className="px-3.5 py-2 bg-purple-900/40 hover:bg-purple-800 text-purple-200 text-xs font-bold rounded-xl border border-purple-500/40 transition"
            >
              Super Admin Console →
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

      {/* Main Command Room */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: MD Video Conference & Individual Hotline */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 relative min-h-[440px] flex items-center justify-center overflow-hidden shadow-2xl">
            
            {activeCallType === 'INDIVIDUAL' && targetEntity && (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-slate-950 p-6 space-y-4 rounded-2xl border border-amber-500/20">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500 overflow-hidden shadow-2xl animate-pulse flex items-center justify-center bg-amber-500/10 text-3xl">
                  {targetEntity.type === 'Hospital' ? '🏥' : '💼'}
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-white">
                    MD Priority Line: <span className="text-amber-400">{targetEntity.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {targetEntity.type === 'Hospital' ? (targetEntity as HospitalEntity).city : (targetEntity as AgentEntity).region}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-1">● Encrypted Direct Executive Hotline</p>
                </div>

                {/* Call Controls */}
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
                    {camOff ? '📹 Cam On' : '📹 Cam Off'}
                  </button>

                  <button
                    onClick={endCall}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                  >
                    Disconnect Line
                  </button>
                </div>
              </div>
            )}

            {activeCallType === 'CONFERENCE' && (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-slate-950 p-6 space-y-4 rounded-2xl border border-amber-500/20">
                <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-3xl text-amber-400">
                  🌐
                </div>
                <div className="text-center">
                  <h3 className="text-base font-extrabold text-white">
                    APT National Executive Video Conference
                  </h3>
                  <p className="text-xs text-amber-300">MD • Regional Agents • Partner Hospital Directors</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                    6 Active Executive Nodes
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full max-w-sm pt-2">
                  <div className="bg-slate-900 p-2 rounded-xl border border-amber-500/30 text-center text-[9px] text-amber-300 font-bold">
                    👑 MD (Engr. Jamilu)
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center text-[9px] text-slate-300">
                    🏥 AKTH Kano
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center text-[9px] text-slate-300">
                    💼 Agent Ahmad
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setMicMuted(!micMuted)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                      micMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {micMuted ? '🎙️ Unmute' : '🎙️ Mute'}
                  </button>
                  <button
                    onClick={() => setCamOff(!camOff)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                      camOff ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {camOff ? '📹 Cam On' : '📹 Cam Off'}
                  </button>
                  <button
                    onClick={endCall}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                  >
                    End Conference
                  </button>
                </div>
              </div>
            )}

            {activeCallType === 'NONE' && (
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto text-amber-400">
                  📞
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Executive Telecom Portal</h3>
                  <p className="text-xs text-slate-400 max-w-md mt-1 mx-auto">
                    Initiate direct hotline calls with partner hospitals and field agents, or launch the APT National Executive Conference.
                  </p>
                </div>
                <button
                  onClick={startExecutiveConference}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition inline-flex items-center gap-2"
                >
                  <span>🌐 Launch Executive National Conference</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Hospital & Agents Directory */}
        <div className="lg:col-span-5 space-y-5">
          {/* Hospitals Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span>🏥 Partner Hospitals Hotline</span>
            </h3>
            <div className="space-y-2">
              {hospitals.map((h) => (
                <div key={h.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{h.name}</h4>
                    <p className="text-[10px] text-slate-400">{h.city}</p>
                  </div>
                  <button
                    onClick={() => startIndividualCall(h)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-xl transition"
                  >
                    Hotline Call
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Official Agents Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <span>💼 APT Field Agents Directory</span>
            </h3>
            <div className="space-y-2">
              {agents.map((a) => (
                <div key={a.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{a.name}</h4>
                    <p className="text-[10px] text-slate-400">{a.region}</p>
                  </div>
                  <button
                    onClick={() => startIndividualCall(a)}
                    disabled={a.status === 'Offline'}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-[10px] rounded-xl transition"
                  >
                    Direct Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
  }
          
