'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
}

export default function DoctorConsolePage() {
  const [orderType, setOrderType] = useState<'pharmacy' | 'lab'>('pharmacy');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Multi-Party Conference Call Invite Modal
  const [isConferenceModalOpen, setIsConferenceModalOpen] = useState(false);
  const [invitedParticipants, setInvitedParticipants] = useState<string[]>([
    'Patient (Active)',
  ]);

  // Dynamic Doctors List State
  const [onDutyDoctors, setOnDutyDoctors] = useState<DoctorProfile[]>([
    {
      id: 'DOC-101',
      name: 'Dr. Jamilu Abubakar Sadiq',
      specialty: 'General Medicine / Lead Tele-Consultant',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    },
  ]);

  // E-Prescription Form States
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [clinicalNote, setClinicalNote] = useState('');

  // Patient Queue Data
  const [patientsQueue] = useState([
    {
      id: 'APT-8902',
      name: 'Amina Ibrahim',
      reason: 'Routine Follow-up',
      status: 'Ready Now',
      labResult: 'Pending Lab Request',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'APT-7710',
      name: 'Usman Bello',
      reason: 'Lab Result Review',
      time: '10:45 AM',
      labResult: 'MP: Positive (++), Widal: 1:80',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'APT-9122',
      name: 'Fatima Abubakar',
      reason: 'General Checkup',
      time: '11:30 AM',
      labResult: 'Fasting Blood Sugar: 95 mg/dL',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
  ]);

  const [activePatient, setActivePatient] = useState(patientsQueue[0]);

  // Load Session and Fetch Newly Registered Doctors
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
      return;
    }

    // Fetch registered consultants/doctors dynamically from localStorage
    const savedAccounts = localStorage.getItem('apt_registered_accounts');
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        const registeredDocs = parsed
          .filter((acc: any) => acc.type === 'Private Consultant' || acc.type === 'MD Staff')
          .map((acc: any) => ({
            id: acc.id,
            name: acc.name,
            specialty: acc.type === 'Private Consultant' ? 'Private Medical Consultant' : 'MD Executive Staff',
            avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250',
          }));

        if (registeredDocs.length > 0) {
          setOnDutyDoctors((prev) => {
            const existingIds = prev.map((d) => d.id);
            const filteredNew = registeredDocs.filter((d: any) => !existingIds.includes(d.id));
            return [...prev, ...filteredNew];
          });
        }
      } catch (e) {
        console.error('Error fetching registered doctors list:', e);
      }
    }

    setIsAuthenticated(true);
  }, []);

  const handleToggleParticipant = (departmentLabel: string) => {
    if (invitedParticipants.includes(departmentLabel)) {
      setInvitedParticipants((prev) => prev.filter((p) => p !== departmentLabel));
    } else {
      setInvitedParticipants((prev) => [...prev, departmentLabel]);
    }
  };

  const handleSaveNote = () => {
    if (!clinicalNote) {
      alert('Please enter clinical findings before saving.');
      return;
    }
    alert(`Clinical consultation note successfully saved to ${activePatient.name}'s EHR.`);
    setClinicalNote('');
  };

  const handleSendOrder = () => {
    if (orderType === 'pharmacy' && (!medicationName || !dosage)) {
      alert('Please fill in the medication name and dosage.');
      return;
    }

    if (orderType === 'lab' && !medicationName) {
      alert('Please enter the required laboratory test name.');
      return;
    }

    const destination = orderType === 'pharmacy' ? 'Pharmacy Desk' : 'Laboratory Department';
    alert(`Order for ${activePatient.name} successfully dispatched to ${destination} & Patient EHR!`);

    setMedicationName('');
    setDosage('');
    setDuration('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  const primaryDoctor = onDutyDoctors[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Navigation Header */}
      <header className="bg-slate-800/80 border-b border-slate-700/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-sky-500/60 bg-slate-950 flex-shrink-0 shadow-lg shadow-sky-500/20">
            <img src={primaryDoctor.avatarUrl} alt={primaryDoctor.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              {primaryDoctor.name}
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                ● Live & Online
              </span>
            </h1>
            <p className="text-xs text-slate-400">{primaryDoctor.specialty}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConferenceModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <span>🌐 Invite Departments to Video Conference</span>
          </button>

          <Link
            href="/dashboard/"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-xl transition text-slate-200"
          >
            ← Hospital Dashboard
          </Link>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Video Window */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden shadow-2xl">
            {isVideoActive ? (
              <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                {/* Active Video Screen */}
                <div className="text-center p-6 space-y-3">
                  <div className="relative w-28 h-28 rounded-full border-4 border-sky-500 mx-auto overflow-hidden shadow-2xl animate-pulse">
                    <img src={activePatient.avatarUrl} alt={activePatient.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{activePatient.name} (Patient)</h3>
                  
                  {/* Multi-Party Participants Badge Bar */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {invitedParticipants.map((part) => (
                      <span
                        key={part}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        ● Connected: {part}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Self Preview */}
                <div className="absolute top-4 right-4 w-32 h-24 sm:w-40 sm:h-28 bg-slate-800 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden flex items-center justify-center">
                  {camOff ? (
                    <span className="text-[10px] text-slate-400 font-bold">Camera Off</span>
                  ) : (
                    <div className="w-full h-full relative">
                      <img src={primaryDoctor.avatarUrl} alt={primaryDoctor.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-slate-950/80 text-sky-400 text-[9px] px-1.5 py-0.5 rounded font-bold">
                        Dr. Jamilu (Self)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Waiting Screen */
              <div className="text-center p-8 space-y-4">
                <div className="relative w-20 h-20 rounded-3xl overflow-hidden border border-sky-500/40 mx-auto shadow-lg">
                  <img src={activePatient.avatarUrl} alt={activePatient.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Start Consultation with {activePatient.name}</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto">
                    Reason: {activePatient.reason} ({activePatient.id})
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoActive(true)}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition"
                >
                  Start Encrypted Video Session
                </button>
              </div>
            )}

            {/* Video Controls */}
            {isVideoActive && (
              <div className="absolute bottom-4 inset-x-0 mx-auto w-fit bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700/80 flex items-center gap-4 shadow-2xl">
                <button
                  onClick={() => setMicMuted(!micMuted)}
                  className={`p-3 rounded-xl text-xs font-bold transition ${
                    micMuted ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {micMuted ? '🎙️ Unmute' : '🎙️ Mute'}
                </button>

                <button
                  onClick={() => setCamOff(!camOff)}
                  className={`p-3 rounded-xl text-xs font-bold transition ${
                    camOff ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {camOff ? '📹 Cam On' : '📹 Cam Off'}
                </button>

                <button
                  onClick={() => setIsConferenceModalOpen(true)}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
                >
                  + Add Department Node
                </button>

                <button
                  onClick={() => setIsVideoActive(false)}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                >
                  End Call
                </button>
              </div>
            )}
          </div>

          {/* Laboratory Findings Display */}
          <div className="bg-slate-800/60 border border-purple-500/30 rounded-3xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <span>🔬 Laboratory Findings</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Patient: {activePatient.id}</span>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-slate-200">
              <p className="font-semibold">{activePatient.labResult}</p>
            </div>
          </div>

          {/* Clinical Consultation Notes */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Consultation Findings for {activePatient.name}
            </h3>
            <textarea
              rows={3}
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              placeholder="Type clinical observations, symptoms, or diagnostic findings..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-4 text-xs text-slate-200 outline-none focus:border-sky-500 transition"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Save to Patient EHR
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Queue & On-Duty Staff */}
        <div className="lg:col-span-4 space-y-5">
          {/* On-Duty Doctors / Intake Consultants */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                On-Duty Doctors & Consultants ({onDutyDoctors.length})
              </h3>
            </div>
            <div className="space-y-2">
              {onDutyDoctors.map((doc) => (
                <div key={doc.id} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-600 flex-shrink-0">
                    <img src={doc.avatarUrl} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">{doc.name}</p>
                    <p className="text-[10px] text-slate-400">{doc.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patients Queue */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's Patient Queue ({patientsQueue.length})
            </h3>
            <div className="space-y-3">
              {patientsQueue.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => setActivePatient(pat)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    activePatient.id === pat.id
                      ? 'bg-slate-900 border-sky-500/60 shadow-lg'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                      <img src={pat.avatarUrl} alt={pat.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{pat.name}</p>
                      <p className="text-[10px] text-slate-400">{pat.id} • {pat.reason}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActivePatient(pat);
                      setIsVideoActive(true);
                    }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold rounded-lg transition"
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* E-Prescription Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Generate E-Prescription / Order
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {orderType === 'pharmacy' ? 'Medication Name' : 'Laboratory Test'}
                </label>
                <input
                  type="text"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder={orderType === 'pharmacy' ? 'e.g. Paracetamol 500mg' : 'e.g. Full Blood Count'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500 transition"
                />
              </div>

              {orderType === 'pharmacy' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dosage</label>
                    <input
                      type="text"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="2 tabs x 3 daily"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="5 Days"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setOrderType('pharmacy')}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    orderType === 'pharmacy' ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  💊 Pharmacy Order
                </button>
                  <button
                  type="button"
                  onClick={() => setOrderType('lab')}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    orderType === 'lab' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  🔬 Lab Request
                </button>
              </div>

              <button
                onClick={handleSendOrder}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Party Conference Call Invite Modal */}
      {isConferenceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>🌐 Multi-Party Inter-Department Call</span>
              </h3>
              <button
                onClick={() => setIsConferenceModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select hospital departments and personnel to join the ongoing video conference call with patient{' '}
              <strong className="text-white">{activePatient.name}</strong>:
            </p>

            <div className="space-y-2">
              {[
                { key: 'Hospital Admin Desk', label: '🏥 Hospital Super Admin' },
                { key: 'Pharmacy Desk', label: '💊 Pharmacy Dispatcher' },
                { key: 'Laboratory Dept', label: '🔬 Laboratory Diagnostician' },
                { key: 'Private Consultant', label: '👨‍⚕️ External Specialist Consultant' },
              ].map((dept) => {
                const isInvited = invitedParticipants.includes(dept.key);
                return (
                  <div
                    key={dept.key}
                    onClick={() => handleToggleParticipant(dept.key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isInvited ? 'bg-purple-900/40 border-purple-500/60 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold">{dept.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border">
                      {isInvited ? '● Connected' : '+ Add to Call'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsConferenceModalOpen(false);
                setIsVideoActive(true);
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Update Multi-Party Conference Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
          }
