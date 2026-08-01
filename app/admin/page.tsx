'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HospitalAccount {
  id: string;
  name: string;
  email: string;
  regDate: string;
  status: 'Active' | 'Trial Expired' | 'Suspended';
  plan: 'Free Trial' | 'Pro Monthly' | 'Enterprise';
}

export default function SuperAdminConsolePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState('');

  // Strict Super Admin Verification
  const SUPER_ADMIN_EMAIL = 'sorondinkiseeme@gmail.com'; // Saka ainihin email dinka a nan

  // Managed Hospitals List State
  const [hospitals, setHospitals] = useState<HospitalAccount[]>([
    {
      id: 'HOSP-001',
      name: 'Aminu Kano Teaching Hospital',
      email: 'info@akth.gov.ng',
      regDate: '2026-07-01',
      status: 'Active',
      plan: 'Pro Monthly',
    },
    {
      id: 'HOSP-002',
      name: 'City Care Medical Center',
      email: 'admin@citycare.com',
      regDate: '2026-06-10',
      status: 'Trial Expired',
      plan: 'Free Trial',
    },
  ]);

  const [banInputEmail, setBanInputEmail] = useState('');
  const [bannedList, setBannedList] = useState<string[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail') || '';

    setCurrentAdminEmail(email);

    // 🔒 Strictly verify if the user is Super Admin
    if (!isLoggedIn || email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert('Unauthorized Access: Super Admin credentials required.');
      router.push('/login');
      return;
    }

    // Load Banned Users
    const savedBanned = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');
    setBannedList(savedBanned);

    setIsAuthenticated(true);
  }, [router]);

  const handleBlockUser = (emailToBlock: string) => {
    if (!emailToBlock) return;
    const cleanEmail = emailToBlock.trim().toLowerCase();
    
    if (bannedList.includes(cleanEmail)) return;

    const updatedBanned = [...bannedList, cleanEmail];
    setBannedList(updatedBanned);
    localStorage.setItem('apt_banned_users', JSON.stringify(updatedBanned));

    // Update status in local table list
    setHospitals((prev) =>
      prev.map((h) => (h.email.toLowerCase() === cleanEmail ? { ...h, status: 'Suspended' } : h))
    );

    alert(`Account ${cleanEmail} has been REVOKED and BLOCKED successfully!`);
    setBanInputEmail('');
  };

  const handleRestoreAccess = (emailToRestore: string) => {
    const updatedBanned = bannedList.filter((e) => e !== emailToRestore);
    setBannedList(updatedBanned);
    localStorage.setItem('apt_banned_users', JSON.stringify(updatedBanned));

    setHospitals((prev) =>
      prev.map((h) => (h.email.toLowerCase() === emailToRestore ? { ...h, status: 'Active' } : h))
    );

    alert(`Access restored for ${emailToRestore}.`);
  };

  const handleExtendTrial = (hospitalId: string) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === hospitalId ? { ...h, status: 'Active', plan: 'Pro Monthly' } : h))
    );
    alert('Hospital trial extended to full active subscription!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs font-bold">
        Verifying Super Admin clearance...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Navigation Header */}
      <header className="border-b border-purple-900/40 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-purple-600/30">
              👑
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                APT Super Admin Control Center
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  FULL ACCESS
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">Owner: {currentAdminEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              Hospital Dashboard →
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                router.push('/login');
              }}
              className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold rounded-xl border border-red-500/30 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Console Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        
        {/* System Quick Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-5 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Registered Hospitals</p>
            <h2 className="text-3xl font-black text-white mt-1">24</h2>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-5 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Telemedicine Sessions</p>
            <h2 className="text-3xl font-black text-emerald-400 mt-1">18</h2>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-5 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Trials Expiring Soon</p>
            <h2 className="text-3xl font-black text-amber-400 mt-1">5</h2>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-5 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended / Banned Accounts</p>
            <h2 className="text-3xl font-black text-red-400 mt-1">{bannedList.length}</h2>
          </div>
        </div>

        {/* Revoke & Ban Direct Action Panel */}
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                Instant Account Ban & Access Revocation
              </h3>
              <p className="text-xs text-slate-400">
                Type any user/hospital email to instantly kick them out and terminate their access across all modules.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBlockUser(banInputEmail);
            }}
            className="flex gap-3 max-w-lg"
          >
            <input
              type="email"
              required
              value={banInputEmail}
              onChange={(e) => setBanInputEmail(e.target.value)}
              placeholder="e.g. suspicious@hospital.com"
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white outline-none focus:border-purple-500 transition"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Revoke & Ban
            </button>
          </form>

          {/* Blocked Accounts List */}
          {bannedList.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-[10px] font-bold text-red-400 uppercase mb-2">Banned Account Emails:</h4>
              <div className="flex flex-wrap gap-2">
                {bannedList.map((email) => (
                  <div
                    key={email}
                    className="px-3 py-1.5 bg-slate-950 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-3"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => handleRestoreAccess(email)}
                      className="text-slate-400 hover:text-white font-bold text-xs"
                      title="Restore Access"
                    >
                      Unblock ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Registered Hospitals Management Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white tracking-wide">
              Registered Medical Centers & Accounts
            </h3>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full font-bold">
              Full Governance
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Hospital ID / Name</th>
                  <th className="p-3.5">Email Address</th>
                  <th className="p-3.5">Registration Date</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {hospitals.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white">
                      {h.name}
                      <span className="block text-[10px] font-mono text-purple-400">{h.id}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{h.email}</td>
                    <td className="p-3.5 text-slate-400">{h.regDate}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[10px]">
                        {h.plan}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          h.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : h.status === 'Trial Expired'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleExtendTrial(h.id)}
                        className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white rounded-lg text-[10px] font-bold transition"
                      >
                        Grant Full Access
                      </button>
                      <button
                        onClick={() => handleBlockUser(h.email)}
                        className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white rounded-lg text-[10px] font-bold transition"
                      >
                        Ban Account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
      }
        
