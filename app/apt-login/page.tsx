'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffAndAgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Duba ko an toshe ma'aikacin (Banned Users Check)
    const bannedUsers = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');
    if (bannedUsers.includes(cleanEmail)) {
      setErrorMessage('An dakatar da amfani da wannan asusun! Tuntubi MD Office.');
      return;
    }

    // 2. Samo jerin ma'aikata daga tsarin rajista
    const savedAccounts = JSON.parse(localStorage.getItem('apt_registered_accounts') || '[]');
    const staffAccount = savedAccounts.find(
      (acc: any) => acc.email.toLowerCase() === cleanEmail
    );

    // 3. Tabbatar da ingancin ma'aikaci
    if (staffAccount) {
      // Tabbatar cewa Ma'aikaci ne (MD Staff ko Agent kaɗai)
      if (staffAccount.type !== 'MD Staff' && staffAccount.type !== 'APT Field Agent') {
        setErrorMessage('Wannan kofar shiga ma\'aikatan MD Office da Field Agents ce kadai!');
        return;
      }

      // Tabbatar da Password
      if (staffAccount.password && staffAccount.password !== cleanPassword) {
        setErrorMessage('Password din da ka shigar ba daidai ba ne!');
        return;
      }

      // Tabbatar ko asusun yana raye (Active)
      if (staffAccount.status === 'Suspended') {
        setErrorMessage('Asusunka yana kulle (Suspended). Tuntubi MD Office.');
        return;
      }

      // Adana bayanan shiga (Session Persistence)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', staffAccount.email);
      localStorage.setItem('userRole', staffAccount.type);

      // Karkatar da ma'aikaci zuwa ofishinsa na gaskiya
      if (staffAccount.type === 'MD Staff') {
        localStorage.setItem('isMasterAuthenticated', 'true');
        router.push('/md-office/');
      } else if (staffAccount.type === 'APT Field Agent') {
        router.push('/agent/');
      }
      return;
    }

    // 4. Fallback na gwaji ciki da gida (Testing Shortcuts)
    if (cleanEmail.includes('md') || cleanEmail.includes('sorondinki')) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isMasterAuthenticated', 'true');
      localStorage.setItem('userEmail', cleanEmail);
      localStorage.setItem('userRole', 'MD Staff');
      router.push('/md-office/');
    } else if (cleanEmail.includes('agent')) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', cleanEmail);
      localStorage.setItem('userRole', 'APT Field Agent');
      router.push('/agent/');
    } else {
      setErrorMessage('Babu ma\'aikaci da ke da wannan Email din a tsarinmu.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 font-black text-2xl mx-auto shadow-lg shadow-amber-500/10">
            🏢
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            APT Staff & Agent Portal
          </h1>
          <p className="text-xs text-slate-400">
            Kofar Shiga MD Office Staff & Official Field Agents
          </p>
        </div>

        {/* ERROR MESSAGE DISPLAY */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* FORM SECTION */}
        <form onSubmit={handleStaffLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Official Staff Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. staff@apt.ng ko agent@apt.ng"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Staff Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xl transition flex items-center justify-center gap-2"
          >
            🔐 Shiga Office / Portal →
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Alpha Proficiency Technology • Official Internal Gateway
        </div>
      </div>
    </div>
  );
}
