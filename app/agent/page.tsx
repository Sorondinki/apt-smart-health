'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HospitalEntity {
  id: string;
  name: string;
  city: string;
  category: 'General Hospital' | 'Private Clinic' | 'Independent Doctor' | 'Multi-Branch Network';
  status: 'Online' | 'In Call' | 'Offline';
  contactPhone: string;
  contactEmail: string;
  approvalStatus: 'APPROVED' | 'PENDING_MD_APPROVAL';
  pendingChanges?: Partial<HospitalEntity>;
  updateRequestedAt?: number;
}

interface PeerAgent {
  id: string;
  name: string;
  region: string;
  status: 'Online' | 'In Call' | 'Offline';
  phone: string;
}

export default function AptAgentPortalPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentEmail, setAgentEmail] = useState('');

  // Local Storage Data Management
  const [hospitals, setHospitals] = useState<HospitalEntity[]>([]);
  const [peerAgents, setPeerAgents] = useState<PeerAgent[]>([]);

  // Call & Telecom States
  const [activeCallType, setActiveCallType] = useState<'NONE' | 'MD_OFFICE' | 'PEER_AGENT' | 'HQ_CONFERENCE'>('NONE');
  const [callTargetName, setCallTargetName] = useState<string>('');
  const [micMuted, setMicMuted] = useState(false);

  // Modals & Editing Forms
  const [editingHospital, setEditingHospital] = useState<HospitalEntity | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    city: '',
    category: 'General Hospital' as HospitalEntity['category'],
    contactPhone: '',
    contactEmail: ''
  });

  // Default Mock Peer Agents
  const defaultPeerAgents: PeerAgent[] = [
    { id: 'AGT-001', name: 'Engr. Jamilu Sadiq (Sorondinki)', region: 'Headquarters / MD', status: 'Online', phone: '+2348000000001' },
    { id: 'AGT-002', name: 'Ahmad Kano Field Agent', region: 'Kano Zone', status: 'Online', phone: '+2348022221111' },
    { id: 'AGT-003', name: 'Usman Kaduna Field Rep', region: 'Kaduna Zone', status: 'Offline', phone: '+2348033332222' },
  ];

  // Default Hospitals List
  const defaultHospitals: HospitalEntity[] = [
    { id: 'HOSP-101', name: 'Aminu Kano Teaching Hospital', city: 'Kano', category: 'General Hospital', status: 'Online', contactPhone: '+2348011112222', contactEmail: 'info@akth.gov.ng', approvalStatus: 'APPROVED' },
    { id: 'HOSP-102', name: 'Nassarawa Specialist Hospital', city: 'Kano', category: 'Multi-Branch Network', status: 'Online', contactPhone: '+2348022223333', contactEmail: 'nassarawa@kano.gov.ng', approvalStatus: 'APPROVED' },
    { id: 'HOSP-103', name: 'Dr. Sadiq Private Care Clinic', city: 'Abuja', category: 'Independent Doctor', status: 'Offline', contactPhone: '+2348033334444', contactEmail: 'sadiq.clinic@health.ng', approvalStatus: 'APPROVED' },
  ];

  // 🔐 AGENT SECURITY GUARD & DATA HYDRATION
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

    // Sync saved hospitals across system
    const savedHospitals = localStorage.getItem('apt_md_hospitals');
    if (savedHospitals) setHospitals(JSON.parse(savedHospitals));
    else setHospitals(defaultHospitals);

    setPeerAgents(defaultPeerAgents);
  }, [router]);

  const saveHospitalsToStorage = (updatedList: HospitalEntity[]) => {
    setHospitals(updatedList);
    localStorage.setItem('apt_md_hospitals', JSON.stringify(updatedList));
  };

  // HANDLER: AGENT SUBMITS PROFILE EDIT (STAYS PENDING UNTIL MD APPROVES)
  const handleSubmitProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;

    const timestamp = Date.now();
    const pendingData: Partial<HospitalEntity> = {
      name: editForm.name,
      city: editForm.city,
      category: editForm.category,
      contactPhone: editForm.contactPhone,
      contactEmail: editForm.contactEmail
    };

    const updated = hospitals.map(h => {
      if (h.id === editingHospital.id) {
        return {
          ...h,
          approvalStatus: 'PENDING_MD_APPROVAL' as const,
          pendingChanges: pendingData,
          updateRequestedAt: timestamp
        };
      }
      return h;
    });

    saveHospitalsToStorage(updated);
    setEditingHospital(null);

    alert(
      `📑 UPDATE SUBMITTED FOR MD APPROVAL!\n\n` +
      `The profile changes for ${editingHospital.name} have been saved in PENDING state.\n` +
      `No need to re-enter data later! Once MD Office approves, the changes will take effect automatically.`
    );
  };

  // CALL HANDLERS
  const startCallWithMD = () => {
    setCallTargetName('MD Executive Office (Sorondinki)');
    setActiveCallType('MD_OFFICE');
  };

  const startPeerAgentCall = (agentName: string) => {
    setCallTargetName(agentName);
    setActiveCallType('PEER_AGENT');
  };

  const startHQConference = () => {
    setCallTargetName('APT National HQ Field Conference Line');
    setActiveCallType('HQ_CONFERENCE');
  };

  const endActiveCall = () => {
    setActiveCallType('NONE');
    setCallTargetName('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center p-4 text-xs font-bold">
        Verifying Agent Clearance...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col pb-12">
      
      {/* Header Bar */}
      <header className="border-b border-sky-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-lg shadow-sky-600/30">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-xs sm:text-base text-white tracking-tight flex items-center gap-1.5">
                APT Field Agent Portal
                <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                  FIELD OPS
                </span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-none">{agentEmail}</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/apt-login');
            }}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-[10px] sm:text-xs font-bold rounded-xl border border-red-500/30 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column: Telecom Console & Communications */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          
          {/* Main Call Player Display */}
          <div className="bg-slate-900 border border-sky-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 min-h-[300px] sm:min-h-[380px] flex items-center justify-center relative overflow-hidden shadow-2xl">
            
            {activeCallType !== 'NONE' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-6 space-y-4 rounded-xl sm:rounded-2xl border border-sky-500/30 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-600/20 border border-sky-500/40 rounded-full flex items-center justify-center text-3xl animate-pulse text-sky-400">
                  🎙️
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">{callTargetName}</h3>
                  <p className="text-[10px] sm:text-xs text-sky-400 font-mono mt-1">● Encrypted Agent Telecom Line Active</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setMicMuted(!micMuted)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold ${
                      micMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {micMuted ? '🎙️ Unmute Mic' : '🎙️ Mute Mic'}
                  </button>

                  <button
                    onClick={endActiveCall}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-lg transition"
                  >
                    Disconnect Call
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-2xl sm:text-3xl mx-auto text-sky-400">
                  🌐
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">APT Field Telecom Center</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 max-w-xs sm:max-w-md mt-1 mx-auto">
                    Call MD Office directly for urgent profile approvals, or connect with fellow field agents.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    onClick={startCallWithMD}
                    className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    👑 Call MD Office Directly
                  </button>

                  <button
                    onClick={startHQConference}
                    className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    🌐 Join HQ Video Conference
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Peer Agents Directory (For Knowledge Sharing & Support) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center justify-between">
              <span>💼 Peer Field Agents Directory</span>
              <span className="text-[10px] text-slate-400 font-normal">Connect for Field Support</span>
            </h3>

            <div className="space-y-2">
              {peerAgents.map((agent) => (
                <div key={agent.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{agent.name}</h4>
                    <p className="text-[10px] text-slate-400">{agent.region}</p>
                  </div>

                  <button
                    onClick={() => startPeerAgentCall(agent.name)}
                    disabled={agent.status === 'Offline'}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-[10px] rounded-xl transition"
                  >
                    📞 Call Agent
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Hospital Management & Profile Edit Requests */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                🏥 Partner Medical Entities Management ({hospitals.length})
              </h3>
              <p className="text-[10px] text-slate-400">
                Submit profile edits for hospitals. Changes stay in Pending state until MD approval.
              </p>
            </div>

            {/* List of Hospitals with Pending MD Approval Indicators */}
            <div className="space-y-3 max-h-[420px] sm:max-h-[480px] overflow-y-auto pr-1">
              {hospitals.map((h) => (
                <div key={h.id} className="p-3 sm:p-3.5 bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-white">{h.name}</h4>
                      <p className="text-[10px] text-amber-300 font-medium">{h.category} • {h.city}</p>
                    </div>

                    <span className={`shrink-0 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold ${
                      h.approvalStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
                    }`}>
                      {h.approvalStatus === 'APPROVED' ? '✓ MD Approved' : '⏳ Pending MD Approval'}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                    <p className="truncate">Phone: {h.contactPhone}</p>
                    <p className="truncate">Email: {h.contactEmail}</p>
                  </div>

                  {/* Pending Notice (No re-entry required!) */}
                  {h.approvalStatus === 'PENDING_MD_APPROVAL' && (
                    <div className="p-2 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[10px] text-amber-300">
                      ⏳ <span className="font-bold">Pending MD Approval:</span> Updates saved securely in cache. No re-entry required!
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => alert(`Dialing ${h.name} at ${h.contactPhone}...`)}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-[10px] rounded-xl"
                    >
                      📞 Direct Dial
                    </button>

                    <button
                      onClick={() => {
                        setEditingHospital(h);
                        setEditForm({
                          name: h.name,
                          city: h.city,
                          category: h.category,
                          contactPhone: h.contactPhone,
                          contactEmail: h.contactEmail
                        });
                      }}
                      className="py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] rounded-xl border border-amber-500/30"
                    >
                      ✏️ Request Profile Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* EDIT PROFILE MODAL */}
      {editingHospital && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm sm:text-base text-white">
              Request Profile Edit — <span className="text-amber-400">{editingHospital.name}</span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Submit modifications for MD approval. Changes will be saved in Pending state indefinitely until MD approves.
            </p>

            <form onSubmit={handleSubmitProfileEdit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hospital / Doctor Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                    className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="General Hospital">General Hospital</option>
                    <option value="Private Clinic">Private Clinic</option>
                    <option value="Independent Doctor">Independent Doctor</option>
                    <option value="Multi-Branch Network">Multi-Branch Network</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  value={editForm.contactPhone}
                  onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Account Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.contactEmail}
                  onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
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
                  Submit for MD Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
