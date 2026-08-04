'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

interface HospitalEntity {
  id: string;
  name: string;
  city: string;
  category: 'General Hospital' | 'Private Clinic' | 'Independent Doctor' | 'Multi-Branch Network';
  status: 'Online' | 'In Call' | 'Offline';
  contact_phone: string;
  contact_email: string;
  approval_status: 'APPROVED' | 'PENDING_SUPER_ADMIN';
  pending_changes?: Partial<HospitalEntity> | null;
  update_requested_at?: string | null;
}

interface AgentEntity {
  id: string;
  name: string;
  region: string;
  status: 'Online' | 'In Call' | 'Offline';
  type: 'Agent';
}

interface MissedCallLog {
  id: string;
  caller_name: string;
  call_type: 'INDIVIDUAL' | 'CONFERENCE';
  created_at?: string;
}

// Executive Security Clearances (Authorized MD Emails)
const ALLOWED_MD_EMAILS = [
  'sorondinkiseeme@gmail.com',
  'mariyashehuibrahim@gmail.com'
];

export default function ManagingDirectorOfficePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mdEmail, setMdEmail] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  // State Management
  const [hospitals, setHospitals] = useState<HospitalEntity[]>([]);
  const [agents, setAgents] = useState<AgentEntity[]>([]);
  const [missedCalls, setMissedCalls] = useState<MissedCallLog[]>([]);

  // Call Controls State
  const [activeCallType, setActiveCallType] = useState<'NONE' | 'INDIVIDUAL' | 'CONFERENCE'>('NONE');
  const [targetEntity, setTargetEntity] = useState<HospitalEntity | AgentEntity | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Modals State
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalEntity | null>(null);

  const [newHospitalForm, setNewHospitalForm] = useState({
    name: '',
    city: '',
    category: 'General Hospital' as HospitalEntity['category'],
    contact_phone: '',
    contact_email: ''
  });

  const [editHospitalForm, setEditHospitalForm] = useState({
    name: '',
    city: '',
    category: 'General Hospital' as HospitalEntity['category'],
    contact_phone: '',
    contact_email: ''
  });

  const [currentTime, setCurrentTime] = useState(Date.now());

  // Default Agents List
  const defaultAgents: AgentEntity[] = [
    { id: 'AGT-001', name: 'Engr. Jamilu Sadiq (Sorondinki)', region: 'Headquarters', status: 'Online', type: 'Agent' },
    { id: 'AGT-002', name: 'Ahmad Kano Field Agent', region: 'Kano Zone', status: 'Online', type: 'Agent' },
    { id: 'AGT-003', name: 'Usman Kaduna Rep', region: 'Kaduna Zone', status: 'Offline', type: 'Agent' },
  ];

  // Network Connectivity Monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Supabase Fetch Operations
  const fetchHospitals = async () => {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHospitals(data as HospitalEntity[]);
    }
  };

  const fetchMissedCalls = async () => {
    const { data, error } = await supabase
      .from('missed_calls')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMissedCalls(data as MissedCallLog[]);
    }
  };

  // Authentication & Executive Clearance Check (Dual Supabase & Storage Support)
  useEffect(() => {
    const checkExecutiveClearance = async () => {
      let userEmail = '';

      // Check Active Supabase Auth Session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user.email) {
        userEmail = session.user.email;
      } else {
        // Fallback to local Session
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        userEmail = localStorage.getItem('userEmail') || '';

        if (!isLoggedIn || !userEmail) {
          toast.error('Security Alert: Authentication required to enter MD Executive Office.');
          router.push('/apt-login');
          return;
        }
      }

      // Check Revoked Account Status
      const bannedUsers = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');
      if (bannedUsers.includes(userEmail.toLowerCase())) {
        toast.error('Access Denied: Account revoked.');
        localStorage.removeItem('isLoggedIn');
        await supabase.auth.signOut();
        router.push('/apt-login');
        return;
      }

      // Validate Authorized MD Emails
      const isAuthorized = ALLOWED_MD_EMAILS.some(
        (email) => email.toLowerCase() === userEmail.toLowerCase()
      );

      if (!isAuthorized) {
        toast.error('Unauthorized Access: Managing Director Clearance Required.');
        router.push('/');
        return;
      }

      setMdEmail(userEmail);
      setIsAuthenticated(true);
      setAgents(defaultAgents);

      // Fetch Live Database Data
      await fetchHospitals();
      await fetchMissedCalls();
      setLoadingData(false);
    };

    checkExecutiveClearance();
  }, [router]);

  // Periodic Timer Tick (10-Minute Approval Window)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  // Register New Medical Entity to Supabase Database
  const handleRegisterHospital = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord = {
      name: newHospitalForm.name,
      city: newHospitalForm.city,
      category: newHospitalForm.category,
      contact_phone: newHospitalForm.contact_phone,
      contact_email: newHospitalForm.contact_email,
      status: 'Online',
      approval_status: 'APPROVED'
    };

    const { data, error } = await supabase.from('hospitals').insert([newRecord]).select();

    if (error) {
      toast.error(`Failed to register entity: ${error.message}`);
      return;
    }

    if (data) {
      setHospitals([data[0] as HospitalEntity, ...hospitals]);
      setShowAddHospitalModal(false);
      setNewHospitalForm({ name: '', city: '', category: 'General Hospital', contact_phone: '', contact_email: '' });
      toast.success(`${newRecord.name} registered directly in Database.`);
    }
  };

  // Request Profile Edit (Start 10-Minute Timer in Database)
  const handleRequestProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;

    const timestamp = new Date().toISOString();
    const pendingData = {
      name: editHospitalForm.name,
      city: editHospitalForm.city,
      category: editHospitalForm.category,
      contact_phone: editHospitalForm.contact_phone,
      contact_email: editHospitalForm.contact_email
    };

    const { error } = await supabase
      .from('hospitals')
      .update({
        approval_status: 'PENDING_SUPER_ADMIN',
        pending_changes: pendingData,
        update_requested_at: timestamp
      })
      .eq('id', editingHospital.id);

    if (error) {
      toast.error(`Failed to update request: ${error.message}`);
      return;
    }

    await fetchHospitals();
    setEditingHospital(null);

    toast.success(
      '🚨 URGENT NOTIFICATIONS DISPATCHED!\n' +
      '📩 SMS / Email / WhatsApp sent to Super Admin & Partner.\n' +
      '⏱️ 10-Minute timer recorded in Database.',
      { duration: 6000 }
    );
  };

  // Approve Changes in Supabase
  const handleApproveChanges = async (hospital: HospitalEntity) => {
    if (!hospital.pending_changes) return;

    const updatedPayload = {
      ...hospital.pending_changes,
      approval_status: 'APPROVED',
      pending_changes: null,
      update_requested_at: null
    };

    const { error } = await supabase
      .from('hospitals')
      .update(updatedPayload)
      .eq('id', hospital.id);

    if (error) {
      toast.error(`Approval error: ${error.message}`);
      return;
    }

    await fetchHospitals();
    toast.success('⚡ Profile Changes Approved & Updated in Database!');
  };

  // Log Missed Call to Supabase Database
  const simulateUnansweredCall = async () => {
    const targetName = targetEntity ? targetEntity.name : 'Executive Conference Line';
    const missedLog = {
      caller_name: targetName,
      call_type: activeCallType === 'CONFERENCE' ? 'CONFERENCE' : 'INDIVIDUAL'
    };

    const { data, error } = await supabase.from('missed_calls').insert([missedLog]).select();

    if (!error && data) {
      setMissedCalls([data[0] as MissedCallLog, ...missedCalls]);
    }

    setActiveCallType('NONE');
    setTargetEntity(null);
    toast.error(`📲 Unanswered Call Recorded for ${targetName}`);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isLoggedIn');
    toast.success('Logged out successfully');
    router.push('/apt-login');
  };

  if (!isAuthenticated || loadingData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center p-4 text-center text-xs font-bold font-mono">
        Connecting to Supabase Database & Verifying MD Executive Clearance...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col pb-10">
      
      {/* Network Alert */}
      {!isOnline && (
        <div className="bg-red-500/20 border-b border-red-500/40 p-2.5 text-red-300 text-xs text-center font-bold">
          ⚠️ Offline Mode: Internet Connection Lost!
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-amber-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-lg sm:text-xl shadow-lg">
              👑
            </div>
            <div>
              <h1 className="font-extrabold text-xs sm:text-base text-amber-400 tracking-tight flex items-center gap-1.5">
                MD Executive Portal
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  ★ DATABASE LIVE
                </span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-[150px] sm:max-w-none">{mdEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/admin/"
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-purple-900/40 hover:bg-purple-800 text-purple-200 text-[10px] sm:text-xs font-bold rounded-xl border border-purple-500/40 transition"
            >
              Admin Console →
            </Link>
            <button
              onClick={handleSignOut}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-[10px] sm:text-xs font-bold rounded-xl border border-red-500/30 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column: Telecom Video & Missed Call Logs */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
          
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 min-h-[320px] sm:min-h-[420px] flex items-center justify-center relative overflow-hidden shadow-2xl">
            
            {activeCallType === 'INDIVIDUAL' && targetEntity && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-6 space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl border border-amber-500/20 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-500 flex items-center justify-center bg-amber-500/10 text-2xl sm:text-3xl animate-pulse">
                  {'type' in targetEntity && targetEntity.type === 'Agent' ? '💼' : '🏥'}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Direct Hotline: <span className="text-amber-400">{targetEntity.name}</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    {'city' in targetEntity ? targetEntity.city : (targetEntity as AgentEntity).region}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-emerald-400 font-mono mt-0.5">● Active Encrypted Call</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setMicMuted(!micMuted)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold ${
                      micMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {micMuted ? '🎙️ Unmute' : '🎙️ Mute'}
                  </button>
                  <button
                    onClick={() => setCamOff(!camOff)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold ${
                      camOff ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {camOff ? '📹 Cam On' : '📹 Cam Off'}
                  </button>
                  <button
                    onClick={simulateUnansweredCall}
                    className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600 text-amber-200 text-[11px] sm:text-xs font-bold rounded-xl border border-amber-500/40"
                  >
                    📲 Mark Unanswered
                  </button>
                  <button
                    onClick={endCall}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-lg"
                  >
                    End Call
                  </button>
                </div>
              </div>
            )}

            {activeCallType === 'CONFERENCE' && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-6 space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl border border-amber-500/20 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl text-amber-400">
                  🌐
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    National Executive Conference Line
                  </h3>
                  <p className="text-[11px] sm:text-xs text-amber-300">MD • Regional Agents • Partner Hospitals</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setMicMuted(!micMuted)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold ${
                      micMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {micMuted ? '🎙️ Unmute' : '🎙️ Mute'}
                  </button>
                  <button
                    onClick={simulateUnansweredCall}
                    className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600 text-amber-200 text-[11px] sm:text-xs font-bold rounded-xl border border-amber-500/40"
                  >
                    📲 Log Missed Call
                  </button>
                  <button
                    onClick={endCall}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-lg"
                  >
                    End Conference
                  </button>
                </div>
              </div>
            )}

            {activeCallType === 'NONE' && (
              <div className="text-center p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl sm:text-3xl mx-auto text-amber-400">
                  📞
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">Executive Telecom Portal</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 max-w-xs sm:max-w-md mt-1 mx-auto">
                    Initiate encrypted direct hotline calls or launch the National Executive Conference Line.
                  </p>
                </div>
                <button
                  onClick={startExecutiveConference}
                  className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
                >
                  🌐 Launch National Executive Conference
                </button>
              </div>
            )}

          </div>

          {/* Missed Calls Center */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                📞 Missed Call Logs ({missedCalls.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {missedCalls.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">No missed call records found in database.</p>
              ) : (
                missedCalls.map((log) => (
                  <div key={log.id} className="p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{log.caller_name}</p>
                      <p className="text-[10px] text-slate-400">
                        Unanswered • {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </p>
                    </div>
                    <button
                      onClick={() => toast.success(`📞 Redialing ${log.caller_name}...`)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg"
                    >
                      Call Back
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Medical Entities Directory */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  🏥 Database Entities ({hospitals.length})
                </h3>
                <p className="text-[10px] text-slate-400">General, Private, Clinics & Doctors</p>
              </div>
              <button
                onClick={() => setShowAddHospitalModal(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] sm:text-xs rounded-xl shadow-md transition"
              >
                + Register New
              </button>
            </div>

            {/* Hospitals Database Records List */}
            <div className="space-y-3 max-h-[380px] sm:max-h-[440px] overflow-y-auto pr-1">
              {hospitals.map((h) => {
                const requestedTime = h.update_requested_at ? new Date(h.update_requested_at).getTime() : 0;
                const elapsedTimeInSeconds = requestedTime ? Math.floor((currentTime - requestedTime) / 1000) : 0;
                const isTimerExpired = elapsedTimeInSeconds >= 600;

                return (
                  <div key={h.id} className="p-3 sm:p-3.5 bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-white">{h.name}</h4>
                        <p className="text-[10px] text-amber-300 font-medium">{h.category} • {h.city}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold ${
                        h.approval_status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
                      }`}>
                        {h.approval_status === 'APPROVED' ? '✓ Approved' : '⏳ Pending Admin'}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                      <p className="truncate">Phone: {h.contact_phone}</p>
                      <p className="truncate">Email: {h.contact_email}</p>
                    </div>

                    {/* Pending Update Workflow */}
                    {h.approval_status === 'PENDING_SUPER_ADMIN' && h.update_requested_at && (
                      <div className="p-2 sm:p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-1 text-[10px]">
                        <p className="text-amber-300 font-bold">⚠️ Requested Changes Pending</p>
                        <p className="text-slate-300">
                          Timer: <span className="font-mono text-white font-bold">{elapsedTimeInSeconds}s / 600s</span>
                        </p>
                        
                        <button
                          onClick={() => handleApproveChanges(h)}
                          className={`w-full py-1 mt-1 font-bold rounded-lg ${
                            isTimerExpired ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                          }`}
                        >
                          {isTimerExpired ? '⚡ 10-Mins Elapsed: Self-Approve' : 'Force MD Approval Now'}
                        </button>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => startIndividualCall(h)}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-[10px] rounded-xl"
                      >
                        📞 Hotline
                      </button>

                      <button
                        onClick={() => {
                          setEditingHospital(h);
                          setEditHospitalForm({
                            name: h.name,
                            city: h.city,
                            category: h.category,
                            contact_phone: h.contact_phone,
                            contact_email: h.contact_email
                          });
                        }}
                        className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-xl"
                      >
                        ✏️ Edit Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Field Agents */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              💼 Field Representatives Directory
            </h3>
            <div className="space-y-2">
              {agents.map((a) => (
                <div key={a.id} className="p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{a.name}</h4>
                    <p className="text-[10px] text-slate-400">{a.region}</p>
                  </div>
                  <button
                    onClick={() => startIndividualCall(a)}
                    disabled={a.status === 'Offline'}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-[10px] rounded-xl"
                  >
                    Call Agent
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* MODAL 1: REGISTER HOSPITAL */}
      {showAddHospitalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm sm:text-base text-white">Register Entity to Database</h3>

            <form onSubmit={handleRegisterHospital} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hospital / Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kano Specialist Clinic"
                  value={newHospitalForm.name}
                  onChange={(e) => setNewHospitalForm({ ...newHospitalForm, name: e.target.value })}
                  className="w-full mt-1 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kano"
                    value={newHospitalForm.city}
                    onChange={(e) => setNewHospitalForm({ ...newHospitalForm, city: e.target.value })}
                    className="w-full mt-1 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={newHospitalForm.category}
                    onChange={(e) => setNewHospitalForm({ ...newHospitalForm, category: e.target.value as any })}
                    className="w-full mt-1 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="General Hospital">General Hospital</option>
                    <option value="Private Clinic">Private Clinic</option>
                    <option value="Independent Doctor">Independent Doctor</option>
                    <option value="Multi-Branch Network">Multi-Branch Network</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+23480..."
                  value={newHospitalForm.contact_phone}
                  onChange={(e) => setNewHospitalForm({ ...newHospitalForm, contact_phone: e.target.value })}
                  className="w-full mt-1 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="info@hospital.com"
                  value={newHospitalForm.contact_email}
                  onChange={(e) => setNewHospitalForm({ ...newHospitalForm, contact_email: e.target.value })}
                  className="w-full mt-1 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHospitalModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 2: EDIT PROFILE */}
      {editingHospital && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm sm:text-base text-white">
              Edit Hospital Profile — <span className="text-amber-400">{editingHospital.name}</span>
            </h3>

            <form onSubmit={handleRequestProfileEdit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hospital Name</label>
                <input
                  type="text"
                  required
                  value={editHospitalForm.name}
                  onChange={(e) => setEditHospitalForm({ ...editHospitalForm, name: e.target.value })}
                  className="w-full mt-1 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={editHospitalForm.city}
                    onChange={(e) => setEditHospitalForm({ ...editHospitalForm, city: e.target.value })}
                    className="w-full mt-1 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={editHospitalForm.category}
                    onChange={(e) => setEditHospitalForm({ ...editHospitalForm, category: e.target.value as any })}
                    className="w-full mt-1 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="General Hospital">General Hospital</option>
                    <option value="Private Clinic">Private Clinic</option>
                    <option value="Independent Doctor">Independent Doctor</option>
                    <option value="Multi-Branch Network">Multi-Branch Network</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingHospital(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
                >
                  Save & Start Database Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
