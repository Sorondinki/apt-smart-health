'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AptAgentPortalPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentEmail, setAgentEmail] = useState('');

  const [activeCall, setActiveCall] = useState<boolean>(false);
  const [callType, setCallType] = useState<'INDIVIDUAL' | 'HQ_CONFERENCE'>('HQ_CONFERENCE');

  // 🔐 AGENT SECURITY GUARD
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail') || '';
    const bannedUsers = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');

    if (!isLoggedIn) {
      alert('Authentication required: Sign in to access APT Agent Portal.');
      router.push('/apt-login');
      return;
    }

    if (bannedUsers.includes(userEmail.toLowerCase())) {
      alert('Access Suspended: Your agent access has been revoked.');
      localStorage.removeItem('isLoggedIn');
      router.push('/apt-login');
      return;
    }

    setAgentEmail(userEmail);
    setIsAuthenticated(true);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-600/30">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                APT Official Field Agent Portal
              </h1>
              <p className="text-[10px] text-slate-400">{agentEmail}</p>
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

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
          <h2 className="text-lg font-bold text-white">APT Headquarters & Field Communications</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Connect directly with MD Office or participate in field coordination conference calls.
          </p>

          {!activeCall ? (
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => setActiveCall(true)}
                className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                🌐 Join HQ Video Conference
              </button>
            </div>
          ) : (
            <div className="p-6 bg-slate-900 border border-sky-500/30 rounded-2xl space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-sky-600/20 border border-sky-500/40 rounded-full flex items-center justify-center mx-auto text-2xl animate-pulse">
                🎙️
              </div>
              <h3 className="font-bold text-sm text-white">Live Conference with MD Office & Field Staff</h3>
              <button
                onClick={() => setActiveCall(false)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition"
              >
                Leave Call
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
