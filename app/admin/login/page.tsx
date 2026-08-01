'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminMasterLogin() {
  const [masterPass, setMasterPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Domin tsaro: Idan har ka riga ka shiga, ya wuce dakai admin dashboard kai tsaye
  useEffect(() => {
    const isMasterAuth = localStorage.getItem('isMasterAuthenticated');
    if (isMasterAuth === 'true') {
      router.push('/admin'); // ko /dashboard/
    }
  }, [router]);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Single Master Password
    const MASTER_ACCESS_CODE = 'Tukur@Apt2027';

    setTimeout(() => {
      if (masterPass.trim() === MASTER_ACCESS_CODE) {
        // Ajiye session
        localStorage.setItem('isMasterAuthenticated', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', 'sorondinkiseeme@gmail.com'); // standard admin email fallback
        
        // Tura ka zuwa Super Admin Command Center
        router.push('/admin');
      } else {
        setErrorMessage('Invalid Master Access Code!');
        setIsLoading(false);
      }
    }, 400); // Dan takaitaccen jinkiri na smooth transition
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[380px] bg-white rounded-xl p-8 text-center shadow-2xl space-y-5">
        
        {/* Header Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            APT Control Center
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter Master Password to Access System
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-800 text-xs font-semibold py-2.5 px-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthenticate} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="••••••••••••"
              value={masterPass}
              onChange={(e) => setMasterPass(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-slate-800 text-base font-medium outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm rounded-lg transition shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Authenticating Access...' : 'Authenticate Access'}
          </button>
        </form>

      </div>
    </div>
  );
      }
  
