'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const ALLOWED_MD_EMAILS = [
  'sorondinkiseeme@gmail.com',
  'mariyashehuibrahim@gmail.com'
];

export default function StaffAndAgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Shiga ta Supabase Authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (error) {
      setErrorMessage(error.message || 'An samu kuskure wajen tabbatar da asusu.');
      setLoading(false);
      return;
    }

    // 2. Duba matsayin mai amfani (Role & Clearance) daga Supabase User Metadata
    const userRole = data.user?.user_metadata?.role || 'STAFF';

    // 3. Tura mutum shafin da ya dace
    if (ALLOWED_MD_EMAILS.includes(cleanEmail)) {
      router.push('/md-office');
    } else if (userRole === 'AGENT') {
      router.push('/agent');
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 font-black text-2xl mx-auto shadow-lg shadow-amber-500/10">
            🏢
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            APT Staff & Agent Portal
          </h1>
          <p className="text-xs text-slate-400">
            Secure Supabase Auth Gateway
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-bold text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleStaffLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Official Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mariyashehuibrahim@gmail.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Password *
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
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Tabbatarwa...' : '🔐 Shiga Portal (Supabase Secure) →'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Alpha Proficiency Technology • Powered by Supabase Auth
        </div>
      </div>
    </div>
  );
}
