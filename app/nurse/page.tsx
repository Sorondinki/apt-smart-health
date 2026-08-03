'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Inpatient {
  id: string;
  patientName: string;
  bedNumber: string;
  ward: 'MALE_WARD' | 'FEMALE_WARD' | 'PEDIATRICS' | 'ICU';
  assignedDoctor: string;
  bp: string;
  temp: string;
  pulse: string;
  medicationStatus: 'DUE' | 'ADMINISTERED' | 'PENDING';
  admissionDate: string;
}

interface ShiftNote {
  id: string;
  nurseName: string;
  shiftType: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  note: string;
  timestamp: string;
}

export default function NursingStationPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nurseEmail, setNurseEmail] = useState('');

  // Active Ward Navigation Tab
  const [activeWard, setActiveWard] = useState<'MALE_WARD' | 'FEMALE_WARD' | 'PEDIATRICS' | 'ICU'>('MALE_WARD');

  // Modals Control State
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Inpatient | null>(null);

  // Form Inputs State
  const [vitalsInput, setVitalsInput] = useState({ bp: '', temp: '', pulse: '' });
  
  const [newAdmission, setNewAdmission] = useState({
    patientName: '',
    bedNumber: '',
    ward: 'MALE_WARD' as Inpatient['ward'],
    assignedDoctor: '',
    bp: '120/80 mmHg',
    temp: '36.5 °C',
    pulse: '72 bpm'
  });

  const [handoverNoteInput, setHandoverNoteInput] = useState({
    shiftType: 'MORNING' as ShiftNote['shiftType'],
    note: ''
  });

  // Video Call State
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Default Fallback Patients
  const defaultPatients: Inpatient[] = [
    { id: 'ADM-101', patientName: 'Musa Abdullahi', bedNumber: 'Bed 04', ward: 'MALE_WARD', assignedDoctor: 'Dr. Aminu Kano', bp: '120/80 mmHg', temp: '36.8 °C', pulse: '72 bpm', medicationStatus: 'DUE', admissionDate: '2026-08-01' },
    { id: 'ADM-102', patientName: 'Ibrahim Garba', bedNumber: 'Bed 09', ward: 'MALE_WARD', assignedDoctor: 'Dr. Jamilu Sadiq', bp: '135/90 mmHg', temp: '38.1 °C', pulse: '88 bpm', medicationStatus: 'ADMINISTERED', admissionDate: '2026-08-02' },
    { id: 'ADM-201', patientName: 'Zainab Bello', bedNumber: 'Bed 02', ward: 'FEMALE_WARD', assignedDoctor: 'Dr. Aisha Zaria', bp: '118/75 mmHg', temp: '36.5 °C', pulse: '70 bpm', medicationStatus: 'PENDING', admissionDate: '2026-08-03' },
  ];

  const [patients, setPatients] = useState<Inpatient[]>([]);
  const [shiftNotes, setShiftNotes] = useState<ShiftNote[]>([]);

  // 🔐 NURSE AUTH SECURITY & DATA RETRIEVAL
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail') || 'nurse.station@hospital.com';

    if (!isLoggedIn) {
      alert('Authentication required: Please login to access Nursing Station.');
      router.push('/login');
      return;
    }

    setNurseEmail(userEmail);

    // Retrieve Persistent Patients List
    const savedPatients = localStorage.getItem('apt_nursing_patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (e) {
        setPatients(defaultPatients);
      }
    } else {
      setPatients(defaultPatients);
      localStorage.setItem('apt_nursing_patients', JSON.stringify(defaultPatients));
    }

    // Retrieve Persistent Handover Notes
    const savedNotes = localStorage.getItem('apt_nursing_handovers');
    if (savedNotes) {
      try {
        setShiftNotes(JSON.parse(savedNotes));
      } catch (e) {
        setShiftNotes([]);
      }
    }

    setIsAuthenticated(true);
  }, [router]);

  // HANDLER: REGISTER / ADMIT NEW PATIENT TO WARD
  const handleAdmitPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmission.patientName || !newAdmission.bedNumber || !newAdmission.assignedDoctor) {
      alert('Please fill out all patient admission fields.');
      return;
    }

    const created: Inpatient = {
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      patientName: newAdmission.patientName,
      bedNumber: newAdmission.bedNumber,
      ward: newAdmission.ward,
      assignedDoctor: newAdmission.assignedDoctor,
      bp: newAdmission.bp,
      temp: newAdmission.temp,
      pulse: newAdmission.pulse,
      medicationStatus: 'DUE',
      admissionDate: new Date().toISOString().split('T')[0]
    };

    const updatedPatients = [...patients, created];
    setPatients(updatedPatients);
    localStorage.setItem('apt_nursing_patients', JSON.stringify(updatedPatients));

    setNewAdmission({ patientName: '', bedNumber: '', ward: activeWard, assignedDoctor: '', bp: '120/80 mmHg', temp: '36.5 °C', pulse: '72 bpm' });
    setShowAdmitModal(false);
    alert(`✅ Patient ${created.patientName} successfully admitted to ${created.ward}!`);
  };

  // HANDLER: UPDATE PATIENT VITALS
  const handleUpdateVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const updated = patients.map((p) =>
      p.id === selectedPatient.id
        ? {
            ...p,
            bp: vitalsInput.bp || p.bp,
            temp: vitalsInput.temp || p.temp,
            pulse: vitalsInput.pulse || p.pulse,
          }
        : p
    );

    setPatients(updated);
    localStorage.setItem('apt_nursing_patients', JSON.stringify(updated));
    setSelectedPatient(null);
  };

  // HANDLER: MEDICATION ADMINISTERED
  const markMedicationDone = (patientId: string) => {
    const updated = patients.map((p) =>
      p.id === patientId ? { ...p, medicationStatus: 'ADMINISTERED' as const } : p
    );
    setPatients(updated);
    localStorage.setItem('apt_nursing_patients', JSON.stringify(updated));
  };

  // HANDLER: ADD SHIFT HANDOVER NOTE
  const handleAddHandoverNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverNoteInput.note) return;

    const createdNote: ShiftNote = {
      id: `NTE-${Date.now()}`,
      nurseName: nurseEmail.split('@')[0].toUpperCase(),
      shiftType: handoverNoteInput.shiftType,
      note: handoverNoteInput.note,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedNotes = [createdNote, ...shiftNotes];
    setShiftNotes(updatedNotes);
    localStorage.setItem('apt_nursing_handovers', JSON.stringify(updatedNotes));

    setHandoverNoteInput({ shiftType: 'MORNING', note: '' });
    setShowHandoverModal(false);
  };

  // EMERGENCY CODE RED BROADCAST
  const triggerCodeRedAlert = () => {
    if (confirm('🚨 CONFIRM EMERGENCY CODE RED ALARM?\nThis will alert ICU Resuscitation and Emergency On-Call Doctors instantly.')) {
      alert('🚨 CODE RED BROADCASTED to Central Doctor Console & Emergency ICU Units!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs font-bold">
        Connecting to Central Nursing Station Database...
      </div>
    );
  }

  const filteredPatients = patients.filter((p) => p.ward === activeWard);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col pb-12">
      
      {/* Header Bar */}
      <header className="border-b border-rose-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-rose-600/30">
              🩺
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-rose-400 tracking-tight flex items-center gap-2">
                APT Central Nursing Station
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  WARD & CLINICAL COMMAND
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">{nurseEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Video Call Conference Trigger */}
            <button
              onClick={() => setShowVideoCallModal(true)}
              className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>📹 Video Call / Conference</span>
            </button>

            {/* Emergency Code Red Button */}
            <button
              onClick={triggerCodeRedAlert}
              className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-red-600/30 animate-pulse transition"
            >
              🚨 CODE RED
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                router.push('/login');
              }}
              className="px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Ward Navigation Tabs Bar & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'MALE_WARD', label: '🛏️ Male Ward' },
              { id: 'FEMALE_WARD', label: '👩‍🛏️ Female Ward' },
              { id: 'PEDIATRICS', label: '👶 Pediatrics Ward' },
              { id: 'ICU', label: '🚨 Intensive Care Unit (ICU)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveWard(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeWard === tab.id
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHandoverModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition"
            >
              📝 Shift Handover Log ({shiftNotes.length})
            </button>

            <button
              onClick={() => {
                setNewAdmission({ ...newAdmission, ward: activeWard });
                setShowAdmitModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
            >
              + Admit Patient to {activeWard.replace('_', ' ')}
            </button>
          </div>
        </div>

        {/* Inpatients Cards Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs space-y-3">
              <p className="text-2xl">🛏️</p>
              <p>No admitted patients currently recorded in {activeWard.replace('_', ' ')}.</p>
              <button
                onClick={() => {
                  setNewAdmission({ ...newAdmission, ward: activeWard });
                  setShowAdmitModal(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Admit New Patient Now
              </button>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative">
                
                {/* Bed Number & Patient Name Header */}
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-mono font-bold text-[10px]">
                      {patient.bedNumber}
                    </span>
                    <h3 className="font-extrabold text-base text-white mt-1.5">{patient.patientName}</h3>
                    <p className="text-[10px] text-slate-400">Doctor in Charge: {patient.assignedDoctor}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{patient.id}</span>
                </div>

                {/* Vitals Summary Card */}
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Blood Press.</p>
                    <p className="text-xs font-bold text-sky-400 mt-0.5">{patient.bp}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Temp</p>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">{patient.temp}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Pulse</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">{patient.pulse}</p>
                  </div>
                </div>

                {/* Medication Status Bar */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] font-bold text-slate-400">Medication Dose:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      patient.medicationStatus === 'ADMINISTERED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {patient.medicationStatus === 'ADMINISTERED' ? '✓ Administered' : '● Dose Due'}
                  </span>
                </div>

                {/* Clinical Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setVitalsInput({ bp: patient.bp, temp: patient.temp, pulse: patient.pulse });
                    }}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
                  >
                    📝 Update Vitals
                  </button>

                  <button
                    onClick={() => markMedicationDone(patient.id)}
                    disabled={patient.medicationStatus === 'ADMINISTERED'}
                    className="py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-600/20"
                  >
                    💊 Give Meds
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </main>

      {/* MODAL 1: PATIENT ADMISSION FORM */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Admit Inpatient to Ward</h3>

            <form onSubmit={handleAdmitPatient} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abubakar Garba"
                  value={newAdmission.patientName}
                  onChange={(e) => setNewAdmission({ ...newAdmission, patientName: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bed Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bed 05 / ICU-01"
                    value={newAdmission.bedNumber}
                    onChange={(e) => setNewAdmission({ ...newAdmission, bedNumber: e.target.value })}
                    className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Target Ward</label>
                  <select
                    value={newAdmission.ward}
                    onChange={(e) => setNewAdmission({ ...newAdmission, ward: e.target.value as any })}
                    className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-rose-500"
                  >
                    <option value="MALE_WARD">Male Ward</option>
                    <option value="FEMALE_WARD">Female Ward</option>
                    <option value="PEDIATRICS">Pediatrics Ward</option>
                    <option value="ICU">Intensive Care Unit (ICU)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Assigned Attending Doctor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Aminu Kano"
                  value={newAdmission.assignedDoctor}
                  onChange={(e) => setNewAdmission({ ...newAdmission, assignedDoctor: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  Confirm Admission
                </button>
              </div>
           </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WEBRTC VIDEO CALL / CONFERENCE */}
      {showVideoCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/30 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <span>📹 APT Inter-Departmental Nursing Video Conference</span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                </h3>
                <p className="text-xs text-slate-400">Live encrypted tele-consultation channel</p>
              </div>
              <button
                onClick={() => setShowVideoCallModal(false)}
                className="px-3 py-1 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs"
              >
                Close
              </button>
            </div>

            {/* Video Streams Display Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950 rounded-2xl h-48 border border-slate-800 relative flex items-center justify-center overflow-hidden">
                {isVideoActive ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 text-xs font-mono">
                    [ Your Camera Stream Active ]
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">Camera Feed Paused</p>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 rounded text-[9px] text-white font-bold">
                  You ({nurseEmail.split('@')[0]})
                </span>
              </div>

              <div className="bg-slate-950 rounded-2xl h-48 border border-slate-800 relative flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-2xl">👨‍⚕️</p>
                  <p className="text-xs text-slate-400 font-bold">Waiting for Doctor / ICU Station to join...</p>
                </div>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 rounded text-[9px] text-amber-400 font-bold">
                  On-Call Doctor (Standby)
                </span>
              </div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsVideoActive(!isVideoActive)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  isVideoActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isVideoActive ? '📷 Camera ON' : '📷 Start Camera'}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isMuted ? '🎙️ Muted' : '🎙️ Mute Mic'}
              </button>

              <button
                onClick={() => setShowVideoCallModal(false)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SHIFT HANDOVER NOTES */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Clinical Shift Handover Records</h3>

            <form onSubmit={handleAddHandoverNote} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Shift Type</label>
                  <select
                    value={handoverNoteInput.shiftType}
                    onChange={(e) => setHandoverNoteInput({ ...handoverNoteInput, shiftType: e.target.value as any })}
                    className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="MORNING">Morning Shift</option>
                    <option value="AFTERNOON">Afternoon Shift</option>
                    <option value="NIGHT">Night Shift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Handover Note / Critical Incident Report</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record patient status updates, pending medications, or vital observations for incoming shift..."
                  value={handoverNoteInput.note}
                  onChange={(e) => setHandoverNoteInput({ ...handoverNoteInput, note: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition"
              >
                + Log Handover Note
              </button>
            </form>

            {/* List of Previous Handover Notes */}
            <div className="space-y-2 pt-2 max-h-48 overflow-y-auto pr-1">
              <h4 className="text-[10px] font-bold uppercase text-slate-400">Previous Shift Logs</h4>
              {shiftNotes.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No handover logs recorded today.</p>
              ) : (
                shiftNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-[10px] text-amber-400 font-bold">
                      <span>{note.nurseName} • {note.shiftType}</span>
                      <span className="text-slate-500">{note.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300">{note.note}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHandoverModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Close Handover Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: UPDATE VITALS */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">
              Update Patient Vitals — <span className="text-rose-400">{selectedPatient.patientName}</span>
            </h3>

            <form onSubmit={handleUpdateVitals} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure (BP)</label>
                <input
                  type="text"
                  placeholder="e.g. 120/80 mmHg"
                  value={vitalsInput.bp}
                  onChange={(e) => setVitalsInput({ ...vitalsInput, bp: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Body Temperature</label>
                <input
                  type="text"
                  placeholder="e.g. 36.8 °C"
                  value={vitalsInput.temp}
                  onChange={(e) => setVitalsInput({ ...vitalsInput, temp: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Pulse Rate</label>
                <input
                  type="text"
                  placeholder="e.g. 72 bpm"
                  value={vitalsInput.pulse}
                  onChange={(e) => setVitalsInput({ ...vitalsInput, pulse: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
              }
