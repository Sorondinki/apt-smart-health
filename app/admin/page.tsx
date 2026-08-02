'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type EntityType = 'Hospital' | 'Clinic' | 'Private Consultant' | 'MD Staff' | 'APT Field Agent';

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  type: EntityType;
  phone: string;
  location: string;
  regDate: string;
  status: 'Active' | 'Trial Expired' | 'Suspended';
  plan: 'Free Trial' | 'Pro Monthly' | 'Enterprise' | 'Official Internal';
}

export default function SuperAdminConsolePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState('');

  // -------------------------------------------------------------
  // STATE 1: MANUAL SUBSCRIPTION & BANK APPROVALS
  // -------------------------------------------------------------
  const [targetEmail, setTargetEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'consultant' | 'basic' | 'pro' | 'enterprise'>('pro');
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);

  const [transferRequests, setTransferRequests] = useState<any[]>([
    {
      id: 'TR-1029',
      facilityName: 'Ruhul Iman Specialist Hospital',
      email: 'ruhuliman@gmail.com',
      amount: 45000,
      plan: 'Hospital Pro',
      proofUrl: '#',
      date: '2026-08-02',
      status: 'pending',
    },
    {
      id: 'TR-1028',
      facilityName: 'Kano Clinic & Lab',
      email: 'kanoclinic@yahoo.com',
      amount: 25000,
      plan: 'Clinic Basic',
      proofUrl: '#',
      date: '2026-08-01',
      status: 'pending',
    },
  ]);

  const pendingCount = transferRequests.filter((r) => r.status === 'pending').length;

  // -------------------------------------------------------------
  // STATE 2: ENTITY REGISTRATION & GOVERNANCE
  // -------------------------------------------------------------
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState(''); // An kara state din password anan
  const [newType, setNewType] = useState<EntityType>('Hospital');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPlan, setNewPlan] = useState<'Free Trial' | 'Pro Monthly' | 'Enterprise' | 'Official Internal'>('Pro Monthly');

  const [banInputEmail, setBanInputEmail] = useState('');
  const [bannedList, setBannedList] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const [accounts, setAccounts] = useState<RegisteredAccount[]>([
    {
      id: 'HOSP-001',
      name: 'Aminu Kano Teaching Hospital',
      email: 'info@akth.gov.ng',
      type: 'Hospital',
      phone: '+234 803 123 4567',
      location: 'Kano, Nigeria',
      regDate: '2026-07-01',
      status: 'Active',
      plan: 'Enterprise',
    },
    {
      id: 'CLINIC-002',
      name: 'City Care Medical Center',
      email: 'admin@citycare.com',
      type: 'Clinic',
      phone: '+234 802 987 6543',
      location: 'Abuja, Nigeria',
      regDate: '2026-06-10',
      status: 'Trial Expired',
      plan: 'Free Trial',
    },
    {
      id: 'CONSULT-003',
      name: 'Dr. Usman Specialist Clinic',
      email: 'drusman@consultant.ng',
      type: 'Private Consultant',
      phone: '+234 805 555 1212',
      location: 'Kaduna, Nigeria',
      regDate: '2026-07-15',
      status: 'Active',
      plan: 'Pro Monthly',
    },
    {
      id: 'MD-001',
      name: 'Engr. Jamilu Abubakar Sadiq (Sorondinki)',
      email: 'sorondinkiseeme@gmail.com',
      type: 'MD Staff',
      phone: '+234 800 000 0000',
      location: 'APT HQ Kano',
      regDate: '2026-01-01',
      status: 'Active',
      plan: 'Official Internal',
    },
    {
      id: 'AGENT-101',
      name: 'Ahmad Field Operations Lead',
      email: 'ahmad.agent@apt.ng',
      type: 'APT Field Agent',
      phone: '+234 809 111 2222',
      location: 'Kano Zone',
      regDate: '2026-05-20',
      status: 'Active',
      plan: 'Official Internal',
    },
  ]);

  // -------------------------------------------------------------
  // INITIALIZATION & SINGLE AUTH GUARD
  // -------------------------------------------------------------
  useEffect(() => {
    const isMasterAuth = localStorage.getItem('isMasterAuthenticated');
    const email = localStorage.getItem('userEmail') || 'sorondinkiseeme@gmail.com';

    setCurrentAdminEmail(email);

    if (isMasterAuth !== 'true') {
      router.push('/admin/login');
      return;
    }

    // Load Manual Subscriptions
    const savedSubs = JSON.parse(localStorage.getItem('apt_manual_subscriptions') || '[]');
    setActiveSubscriptions(savedSubs);

    // Load Banned List
    const savedBanned = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');
    setBannedList(savedBanned);

    // Sync Accounts
    const savedAccounts = localStorage.getItem('apt_registered_accounts');
    if (savedAccounts) {
      try {
        setAccounts(JSON.parse(savedAccounts));
      } catch (e) {
        console.error('Failed to parse saved accounts.');
      }
    }

    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isMasterAuthenticated');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/admin/login');
  };

  const persistAccounts = (updatedList: RegisteredAccount[]) => {
    setAccounts(updatedList);
    localStorage.setItem('apt_registered_accounts', JSON.stringify(updatedList));
  };

  // -------------------------------------------------------------
  // HANDLERS: MANUAL SUBSCRIPTION & BANK APPROVALS
  // -------------------------------------------------------------
  const handleManualSubscriptionTopUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetEmail.trim()) {
      alert("Tabbatar ka shigar da Email din ma'aikata ko asibiti!");
      return;
    }

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + Number(durationMonths));

    const newSubRecord = {
      id: 'SUB-' + Date.now(),
      email: targetEmail.toLowerCase().trim(),
      plan: selectedPlan,
      durationMonths: Number(durationMonths),
      startDate: startDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      status: 'Active',
      activatedBy: 'Super Admin (Manual Direct Cash/Transfer)',
    };

    const updatedSubs = [
      newSubRecord,
      ...activeSubscriptions.filter((s) => s.email !== targetEmail.toLowerCase().trim()),
    ];
    setActiveSubscriptions(updatedSubs);
    localStorage.setItem('apt_manual_subscriptions', JSON.stringify(updatedSubs));

    localStorage.setItem(
      `sub_status_${targetEmail.toLowerCase().trim()}`,
      JSON.stringify({
        isActive: true,
        plan: selectedPlan,
        expiryDate: expiryDate.toISOString().split('T')[0],
      })
    );

    alert(
      `✅ Subscription Top-Up Successful!\n\nEmail: ${targetEmail}\nPlan: ${selectedPlan.toUpperCase()}\nValid Until: ${expiryDate.toDateString()}`
    );

    setTargetEmail('');
  };

  const handleApproveTransfer = (req: any) => {
    if (confirm(`Kana da tabbas kake son amincewa da biyan ₦${req.amount.toLocaleString()} na ${req.facilityName}?`)) {
      setTransferRequests(transferRequests.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r)));
      setTargetEmail(req.email);
      alert(`✅ Request Approved! An shigar da email din (${req.email}) a cikin tsarin Manual Top-Up.`);
    }
  };

  const handleRejectTransfer = (id: string) => {
    if (confirm('Kana da tabbas kake son REJECT din wannan buƙatar biyan kuɗin?')) {
      setTransferRequests(transferRequests.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: ENTITY REGISTRATION & GOVERNANCE
  // -------------------------------------------------------------
  const handleRegisterEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      alert('Tabbatar an cika suna, email da kuma password!');
      return;
    }

    const cleanEmail = newEmail.trim().toLowerCase();

    if (accounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
      alert('An account with this email address is already registered!');
      return;
    }

    // Ajiyewa ko adana bayanin password a localstorage domin amfani dashi wajen Login nan gaba
    localStorage.setItem(`user_pwd_${cleanEmail}`, newPassword);

    const prefix =
      newType === 'Hospital'
        ? 'HOSP'
        : newType === 'Clinic'
        ? 'CLINIC'
        : newType === 'Private Consultant'
        ? 'CONSULT'
        : newType === 'MD Staff'
        ? 'MD'
        : 'AGENT';

    const newAccount: RegisteredAccount = {
      id: `${prefix}-${Math.floor(100 + Math.random() * 900)}`,
      name: newName.trim(),
      email: cleanEmail,
      type: newType,
      phone: newPhone.trim() || 'N/A',
      location: newLocation.trim() || 'Kano, Nigeria',
      regDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      plan: newType === 'MD Staff' || newType === 'APT Field Agent' ? 'Official Internal' : newPlan,
    };

    const updated = [newAccount, ...accounts];
    persistAccounts(updated);

    alert(`Successfully registered ${newAccount.name} (${newAccount.type})!`);

    setNewName('');
    setNewEmail('');
    setNewPassword(''); // Sanya shi koma babu komai bayan yin register
    setNewPhone('');
    setNewLocation('');
    setNewType('Hospital');
  };

  const handleBlockUser = (emailToBlock: string) => {
    if (!emailToBlock) return;
    const cleanEmail = emailToBlock.trim().toLowerCase();

    let updatedBanned = [...bannedList];
    if (!updatedBanned.includes(cleanEmail)) {
      updatedBanned.push(cleanEmail);
      setBannedList(updatedBanned);
      localStorage.setItem('apt_banned_users', JSON.stringify(updatedBanned));
    }

    const updatedAccounts = accounts.map((acc) =>
      acc.email.toLowerCase() === cleanEmail ? { ...acc, status: 'Suspended' as const } : acc
    );
    persistAccounts(updatedAccounts);

    alert(`Account ${cleanEmail} has been SUSPENDED and BLOCKED!`);
    setBanInputEmail('');
  };

  const handleRestoreAccess = (emailToRestore: string) => {
    const cleanEmail = emailToRestore.trim().toLowerCase();
    const updatedBanned = bannedList.filter((e) => e !== cleanEmail);
    setBannedList(updatedBanned);
    localStorage.setItem('apt_banned_users', JSON.stringify(updatedBanned));

    const updatedAccounts = accounts.map((acc) =>
      acc.email.toLowerCase() === cleanEmail ? { ...acc, status: 'Active' as const } : acc
    );
    persistAccounts(updatedAccounts);

    alert(`Access restored for ${cleanEmail}.`);
  };

  const handleGrantAccess = (accountId: string) => {
    const updatedAccounts = accounts.map((acc) =>
      acc.id === accountId ? { ...acc, status: 'Active' as const, plan: 'Pro Monthly' as const } : acc
    );
    persistAccounts(updatedAccounts);
    alert('Subscription status granted and activated!');
  };

  const handleDeleteAccount = (accountId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete account: ${email}?`)) return;

    const updatedAccounts = accounts.filter((acc) => acc.id !== accountId);
    persistAccounts(updatedAccounts);

    const updatedBanned = bannedList.filter((e) => e !== email.toLowerCase());
    setBannedList(updatedBanned);
    localStorage.setItem('apt_banned_users', JSON.stringify(updatedBanned));

    alert('Account permanently deleted.');
  };

  const filteredAccounts = accounts.filter((acc) => {
    if (filterType === 'ALL') return true;
    return acc.type === filterType;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs font-bold">
        Verifying Super Admin clearance...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col space-y-8 pb-12">
        {/* ======================================================== */}
      {/* HEADER SECTION                                           */}
      {/* ======================================================== */}
      <header className="border-b border-purple-900/40 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-purple-600/30 shrink-0">
              👑
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2 truncate">
                APT Super Admin Command Center
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  FULL ACCESS
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 truncate">Managing Director: {currentAdminEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/md-office/"
              className="px-2.5 sm:px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[11px] sm:text-xs font-bold rounded-xl border border-amber-500/30 transition"
            >
              👑 MD Office →
            </Link>
            <Link
              href="/dashboard/"
              className="hidden md:inline-block px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              Hospital Portal →
            </Link>
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-[11px] sm:text-xs font-bold rounded-xl border border-red-500/30 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 space-y-8">
        
        {/* METRICS DASHBOARD CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Hospitals & Clinics</p>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {accounts.filter((a) => a.type === 'Hospital' || a.type === 'Clinic').length}
            </h2>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Private Consultants</p>
            <h2 className="text-xl sm:text-2xl font-black text-sky-400 mt-1">
              {accounts.filter((a) => a.type === 'Private Consultant').length}
            </h2>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase">MD Staff Office</p>
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {accounts.filter((a) => a.type === 'MD Staff').length}
            </h2>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase">APT Field Agents</p>
            <h2 className="text-xl sm:text-2xl font-black text-purple-400 mt-1">
              {accounts.filter((a) => a.type === 'APT Field Agent').length}
            </h2>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Suspended / Banned</p>
            <h2 className="text-xl sm:text-2xl font-black text-red-400 mt-1">{bannedList.length}</h2>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: INCOMING BANK TRANSFER APPROVALS              */}
        {/* ======================================================== */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl flex items-center justify-center font-black text-xl shrink-0">
                🏦
              </div>
              <div>
                <h3 className="text-base font-black text-white">Incoming Bank Transfer Approvals</h3>
                <p className="text-xs text-slate-400">Tabbatar da sanarwar biyan kudi ta Bank Transfer daga asibitoci.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-2xl">
              <span className="relative flex h-2.5 w-2.5">
                {pendingCount > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${pendingCount > 0 ? 'bg-amber-500' : 'bg-slate-600'}`}></span>
              </span>
              <span className="text-[10px] font-bold text-slate-300">
                Pending: <strong className="text-amber-400">{pendingCount}</strong>
              </span>
            </div>
          </div>

          {transferRequests.filter((r) => r.status === 'pending').length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">Babu wata buƙatar Bank Transfer da ke jiran amincewa a yanzu.</p>
          ) : (
            <div className="space-y-3">
              {transferRequests
                .filter((r) => r.status === 'pending')
                .map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{req.facilityName}</span>
                        <span className="text-[10px] bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded font-mono">{req.plan}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{req.email}</p>
                      <p className="text-xs font-bold text-emerald-400">
                        Amount: ₦{req.amount.toLocaleString()} <span className="text-slate-500 font-normal">({req.date})</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <a
                        href={req.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        🖼️ Proof
                      </a>
                      <button
                        onClick={() => handleApproveTransfer(req)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg transition flex-1 sm:flex-none"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRejectTransfer(req.id)}
                        className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-xl transition flex-1 sm:flex-none"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: MANUAL SUBSCRIPTION TOP-UP & EXTENSION CARD  */}
        {/* ======================================================== */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center font-black text-xl shrink-0">
                💳
              </div>
              <div>
                <h3 className="text-base font-black text-white">Manual Subscription Top-Up & Extension</h3>
                <p className="text-xs text-slate-400">
                  Yiwa asibiti ko likita Top-Up na wata 1, wata 6, ko shekara 1 idan ya biya kudi a hannu (Cash/Direct Bank Transfer).
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/20">
              Direct Billing Control
            </span>
          </div>

          <form onSubmit={handleManualSubscriptionTopUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Target Account Email *</label>
                <input
                  type="email"
                  required
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="e.g. admin@kanospecialist.com"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Choose Subscription Tier *</label>
                <select
                  value={selectedPlan}
                  onChange={(e: any) => setSelectedPlan(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="consultant">Tier 1: Private Consultant (₦15,000/mo)</option>
                  <option value="basic">Tier 2: Clinic Basic (₦25,000/mo)</option>
                  <option value="pro">Tier 3: Hospital Pro (₦45,000/mo)</option>
                  <option value="enterprise">Tier 4: Enterprise Network (₦120,000/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subscription Duration *</label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value={1}>1 Month (Standard)</option>
                  <option value={3}>3 Months (Quarterly)</option>
                  <option value={6}>6 Months (Bi-Annual - Discounted)</option>
                  <option value={12}>12 Months / 1 Year (Annual Plan)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>⚡ Apply Manual Top-Up / Extend Expiry</span>
            </button>
          </form>

          {/* ACTIVE MANUAL SUBSCRIPTIONS LOG TABLE */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Manual Subscription Records</h4>

            {activeSubscriptions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No manual subscription top-ups performed yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300 min-w-[600px]">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">User/Facility Email</th>
                      <th className="p-3">Plan Tier</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Activated Date</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {activeSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-950/50 transition">
                        <td className="p-3 font-mono font-bold text-white">{sub.email}</td>
                        <td className="p-3 uppercase text-cyan-400 font-bold">{sub.plan}</td>
                        <td className="p-3">{sub.durationMonths} Month(s)</td>
                        <td className="p-3 text-slate-400">{sub.startDate}</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">{sub.expiryDate}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded border border-emerald-500/30">
                            {sub.status} ✓
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
           {/* ======================================================== */}
        {/* SECTION 3: ENTITY REGISTRATION FORM                     */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="text-xl">➕</span>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Register New Medical Partner, Consultant, MD Staff or Agent
              </h3>
              <p className="text-xs text-slate-400">
                Create verified system accounts for Hospitals, Private Clinics, Consultants, MD Office Staff, or Field Agents.
              </p>
            </div>
          </div>

          <form onSubmit={handleRegisterEntity} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Entity / Official Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Aminu Kano Hospital / Dr. Bello"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Official Email Address</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="official@domain.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* AN KARA WANNAN PASSWORD FIELD ANAN */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Account Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Account Category / Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as EntityType)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500"
              >
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Private Clinic</option>
                <option value="Private Consultant">Private Consultant</option>
                <option value="MD Staff">MD Office Staff</option>
                <option value="APT Field Agent">APT Official Field Agent</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">State / Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Kano, Nigeria"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Subscription Plan</label>
              <select
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value as any)}
                disabled={newType === 'MD Staff' || newType === 'APT Field Agent'}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500 disabled:opacity-50"
              >
                <option value="Free Trial">Free Trial (1 Month)</option>
                <option value="Pro Monthly">Pro Monthly</option>
                <option value="Enterprise">Enterprise Unlimited</option>
                <option value="Official Internal">Official Internal</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Register & Grant Access →
              </button>
            </div>
          </form>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: ACCOUNT BAN & REVOCATION TOOL                */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-red-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Instant Account Ban & Access Revocation Tool
              </h3>
              <p className="text-xs text-slate-400">
                Immediately block any compromised account or fraudulent email address across all systems.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBlockUser(banInputEmail);
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md"
          >
            <input
              type="email"
              required
              value={banInputEmail}
              onChange={(e) => setBanInputEmail(e.target.value)}
              placeholder="e.g. suspicious@user.com"
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Ban User
            </button>
          </form>

          {bannedList.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-[10px] font-bold text-red-400 uppercase mb-2">Currently Suspended Accounts:</h4>
              <div className="flex flex-wrap gap-2">
                {bannedList.map((email) => (
                  <div
                    key={email}
                    className="px-3 py-1 bg-slate-950 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2"
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

        {/* ======================================================== */}
        {/* SECTION 5: MASTER ACCOUNTS DIRECTORY TABLE               */}
        {/* ======================================================== */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                Master Directory of Registered Accounts & Entities
              </h3>
              <p className="text-xs text-slate-400">
                Track status, extend subscriptions, or suspend access for hospitals, consultants, MD staff, and agents.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Filter:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
              >
                <option value="ALL">All Categories ({accounts.length})</option>
                <option value="Hospital">Hospitals</option>
                <option value="Clinic">Private Clinics</option>
                <option value="Private Consultant">Private Consultants</option>
                <option value="MD Staff">MD Office Staff</option>
                <option value="APT Field Agent">APT Field Agents</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
            <table className="w-full text-left text-xs text-slate-300 min-w-[750px]">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">ID / Account Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Contact & Location</th>
                  <th className="p-3.5">Reg Date</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions & Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white">
                      {acc.name}
                      <span className="block text-[10px] font-mono text-purple-400">{acc.id}</span>
                      <span className="block text-[10px] font-mono text-slate-400">{acc.email}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          acc.type === 'MD Staff'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : acc.type === 'APT Field Agent'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : acc.type === 'Private Consultant'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {acc.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {acc.phone}
                      <span className="block text-[10px] text-slate-400">{acc.location}</span>
                    </td>
                    <td className="p-3.5 text-slate-400">{acc.regDate}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[10px]">
                        {acc.plan}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          acc.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : acc.status === 'Trial Expired'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {acc.status !== 'Active' && (
                        <button
                          onClick={() => handleGrantAccess(acc.id)}
                          className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white rounded-lg text-[10px] font-bold transition"
                        >
                          Activate Access
                        </button>
                      )}

                      {acc.status === 'Suspended' ? (
                        <button
                          onClick={() => handleRestoreAccess(acc.email)}
                          className="px-2.5 py-1 bg-sky-600/30 hover:bg-sky-600 text-sky-200 hover:text-white rounded-lg text-[10px] font-bold transition"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(acc.email)}
                          className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white rounded-lg text-[10px] font-bold transition"
                        >
                          Suspend
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteAccount(acc.id, acc.email)}
                        className="px-2 py-1 bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold transition"
                        title="Delete Permanently"
                      >
                        🗑️
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
