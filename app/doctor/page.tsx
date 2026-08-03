'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  phone?: string;
}

interface Patient {
  id: string;
  name: string;
  reason: string;
  time?: string;
  labResult: string;
  avatarUrl: string;
}

interface PrescriptionRecord {
  id: string;
  patientId: string;
  patientName: string;
  medicationName: string;
  dosage: string;
  duration: string;
  type: 'pharmacy' | 'lab';
  doctorName: string;
  date: string;
}

export default function DoctorConsolePage() {
  const [orderType, setOrderType] = useState<'pharmacy' | 'lab'>('pharmacy');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [activeVideoPeer, setActiveVideoPeer] = useState<string>('');

  // Notifications State
  const [notifications, setNotifications] = useState<string[]>([
    '🔔 Reception: An haɗa maras lafiya Amina Ibrahim tare da ku.',
  ]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Multi-Party Conference Modal
  const [isConferenceModalOpen, setIsConferenceModalOpen] = useState(false);
  const [invitedParticipants, setInvitedParticipants] = useState<string[]>([
    'Patient (Active)',
  ]);

  // Dynamic Doctors List
  const [onDutyDoctors, setOnDutyDoctors] = useState<DoctorProfile[]>([
    {
      id: 'DOC-101',
      name: 'Dr. Jamilu Abubakar Sadiq',
      specialty: 'General Medicine / Lead Tele-Consultant',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'DOC-102',
      name: 'Dr. Zainab Bello',
      specialty: 'Pediatric Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-788530364841?auto=format&fit=crop&q=80&w=250',
    }
  ]);

  // Form States
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [clinicalNote, setClinicalNote] = useState('');

  // Patient Queue
  const [patientsQueue, setPatientsQueue] = useState<Patient[]>([
    {
      id: 'APT-8902',
      name: 'Amina Ibrahim',
      reason: 'Routine Follow-up',
      labResult: 'Pending Lab Request',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'APT-7710',
      name: 'Usman Bello',
      reason: 'Lab Result Review',
      labResult: 'MP: Positive (++), Widal: 1:80',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
  ]);

  const [activePatient, setActivePatient] = useState<Patient>(patientsQueue[0]);

  // History of Attended Patients & Prescriptions
  const [attendedPatients, setAttendedPatients] = useState<PrescriptionRecord[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
      return;
    }

    // Load saved prescriptions from local storage
    const savedPrescriptions = localStorage.getItem('apt_patient_prescriptions');
    if (savedPrescriptions) {
      try {
        setAttendedPatients(JSON.parse(savedPrescriptions));
      } catch (e) {
        console.error(e);
      }
    }

    setIsAuthenticated(true);
  }, []);

  const handleStartDoctorVideoCall = (doctorName: string) => {
    setActiveVideoPeer(`Doctor Peer: ${doctorName}`);
    setIsVideoActive(true);
  };

  const handleStartPatientVideoCall = (patient: Patient) => {
    setActivePatient(patient);
    setActiveVideoPeer(`Patient: ${patient.name}`);
    setIsVideoActive(true);
  };

  const handleSendOrderAndPrescription = () => {
    if (orderType === 'pharmacy' && (!medicationName || !dosage)) {
      alert('Don Allah shigar da sunan magani da adadin shan sa (dosage).');
      return;
    }

    if (orderType === 'lab' && !medicationName) {
      alert('Don Allah shigar da gwajin da kake buƙata (Lab Test).');
      return;
    }

    const newPrescription: PrescriptionRecord = {
      id: 'RX-' + Math.floor(100000 + Math.random() * 900000),
      patientId: activePatient.id,
      patientName: activePatient.name,
      medicationName,
      dosage: orderType === 'pharmacy' ? dosage : 'N/A (Lab Test)',
      duration: orderType === 'pharmacy' ? duration : 'N/A',
      type: orderType,
      doctorName: onDutyDoctors[0].name,
      date: new Date().toLocaleDateString(),
    };

    const updatedList = [newPrescription, ...attendedPatients];
    setAttendedPatients(updatedList);

    // Save to LocalStorage for Patient Dashboard Printing
    localStorage.setItem('apt_patient_prescriptions', JSON.stringify(updatedList));

    alert(`✅ An yi nasarar ƙira/bada Prescription na ${activePatient.name}. Maras lafiya zai iya ganinsa da yin Print a dashboard dinsa!`);

    setMedicationName('');
    setDosage('');
    setDuration('');
  };

  const handlePrintPrescription = (rx: PrescriptionRecord) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>E-Prescription - ${rx.patientName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .card { border: 1px solid #ccc; padding: 15px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Hospital Central E-Prescription</h2>
              <p><strong>Doctor:</strong> ${rx.doctorName} | <strong>Date:</strong> ${rx.date}</p>
            </div>
            <div class="card">
              <h3>Patient: ${rx.patientName} (${rx.patientId})</h3>
              <p><strong>Order Type:</strong> ${rx.type.toUpperCase()}</p>
              <p><strong>Prescription / Test:</strong> ${rx.medicationName}</p>
              <p><strong>Dosage:</strong> ${rx.dosage}</p>
              <p><strong>Duration:</strong> ${rx.duration}</p>
            </div>
            <br/><button onclick="window.print()">Print Document</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col pb-10">
      {/* Navigation Header */}
      <header className="bg-slate-800/80 border-b border-slate-700/60 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between sticky top-0 z-40 backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden border-2 border-sky-500/60 bg-slate-950 flex-shrink-0 shadow-lg">
            <img src={primaryDoctor.avatarUrl} alt={primaryDoctor.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-xs sm:text-sm text-white tracking-tight flex items-center gap-2">
              {primaryDoctor.name}
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                ● Live
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">{primaryDoctor.specialty}</p>
          </div>
        </div>

        {/* Right Action Icons: Notifications & Landing Page Link */}
        <div className="flex items-center gap-3">
          {/* Notification Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="p-2.5 bg-slate-900 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-200 text-xs font-bold relative transition"
            >
              🔔
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-2">
                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">Notifications</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {notifications.map((note, i) => (
                    <div key={i} className="p-2 bg-slate-900 rounded-lg text-[11px] text-slate-300">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsConferenceModalOpen(true)}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <span>🌐 Video Conf</span>
          </button>

          {/* Link to Landing Page app/page.tsx instead of /dashboard */}
          <Link
            href="/"
            className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-xl transition text-slate-200"
          >
            ← Babban Asibiti Page
          </Link>
        </div>
      </header>

      {/* Main Responsive Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Interactive Video Call & Findings */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 relative min-h-[360px] sm:min-h-[440px] flex items-center justify-center overflow-hidden shadow-2xl">
            {isVideoActive ? (
              <div className="w-full h-full relative flex items-center justify-center bg-slate-900 p-6">
                <div className="text-center space-y-3">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-sky-500 mx-auto overflow-hidden shadow-2xl animate-pulse">
                    <img src={activePatient.avatarUrl} alt={activePatient.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {activeVideoPeer || activePatient.name}
                  </h3>
                  
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {invitedParticipants.map((part) => (
                      <span key={part} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        ● Live Node: {part}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Self View Floating Box */}
                <div className="absolute top-4 right-4 w-28 h-20 sm:w-36 sm:h-24 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex items-center justify-center">
                  {camOff ? (
                    <span className="text-[10px] text-slate-400 font-bold">Camera Off</span>
                  ) : (
                    <img src={primaryDoctor.avatarUrl} alt="Doctor" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Call Action Bar */}
                <div className="absolute bottom-4 inset-x-auto bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 flex items-center gap-2 sm:gap-4 shadow-2xl">
                  <button
                    onClick={() => setMicMuted(!micMuted)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition ${micMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200'}`}
                  >
                    {micMuted ? '🎙️ Unmute' : '🎙️ Mute'}
                  </button>
                  <button
                    onClick={() => setCamOff(!camOff)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition ${camOff ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200'}`}
                  >
                    {camOff ? '📹 Cam On' : '📹 Cam Off'}
                  </button>
                  <button
                    onClick={() => setIsVideoActive(false)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition"
                  >
                    End Call
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-sky-500/40 mx-auto shadow-lg">
                  <img src={activePatient.avatarUrl} alt={activePatient.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">Start Session with {activePatient.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">Reason: {activePatient.reason} ({activePatient.id})</p>
                </div>
                <button
                  onClick={() => handleStartPatientVideoCall(activePatient)}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  📹 Start Encrypted Video Call
                </button>
              </div>
            )}
          </div>

          {/* Notes & Lab Display */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Clinical Observation Note ({activePatient.name})
            </h3>
            <textarea
              rows={3}
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              placeholder="Rubuta bayanin lafiyar maras lafiya a nan..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Right Column: Doctors, Queue & E-Prescriptions */}
        <div className="lg:col-span-4 space-y-5">
          {/* On-Duty Doctors - Direct Call Option */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-amber-400">
              On-Duty Consultants (Call Doctor)
            </h3>
            <div className="space-y-2">
              {onDutyDoctors.map((doc) => (
                <div key={doc.id} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={doc.avatarUrl} alt={doc.name} className="w-7 h-7 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-xs text-white">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">{doc.specialty}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartDoctorVideoCall(doc.name)}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg transition"
                  >
                    📹 Call
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">Today's Patient Queue</h3>
            <div className="space-y-2">
              {patientsQueue.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => setActivePatient(pat)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    activePatient.id === pat.id ? 'bg-slate-900 border-sky-500/60' : 'bg-slate-900/50 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={pat.avatarUrl} alt={pat.name} className="w-8 h-8 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-xs text-white">{pat.name}</p>
                      <p className="text-[10px] text-slate-400">{pat.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartPatientVideoCall(pat)}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold rounded-lg transition"
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* E-Prescription Dispatcher */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">Generate E-Prescription</h3>

            <input
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              placeholder={orderType === 'pharmacy' ? 'Sunan Magani (e.g. Paracetamol)' : 'Gwajin Lab'}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            />

            {orderType === 'pharmacy' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Dosage (2x3)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                />
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Kwanaki (5 Days)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setOrderType('pharmacy')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border transition ${orderType === 'pharmacy' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                💊 Pharmacy
              </button>
              <button
                onClick={() => setOrderType('lab')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border transition ${orderType === 'lab' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                🔬 Lab
              </button>
            </div>

            <button
              onClick={handleSendOrderAndPrescription}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
            >
              Post Prescription to Patient EHR
            </button>
          </div>
        </div>
      </div>

      {/* Attended Patients & Prescriptions Log Table */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-6">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Teburin Marasa Lafiya da Aka Bawa Prescription ({attendedPatients.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Rx ID</th>
                  <th className="py-2.5 px-3">Maras Lafiya</th>
                  <th className="py-2.5 px-3">Order / Magani</th>
                  <th className="py-2.5 px-3">Dosage / Duration</th>
                  <th className="py-2.5 px-3">Kwanan Wata</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {attendedPatients.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-400">{rx.id}</td>
                    <td className="py-2.5 px-3 font-semibold">{rx.patientName} ({rx.patientId})</td>
                    <td className="py-2.5 px-3">{rx.medicationName}</td>
                    <td className="py-2.5 px-3">{rx.dosage} - {rx.duration}</td>
                    <td className="py-2.5 px-3">{rx.date}</td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handlePrintPrescription(rx)}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold rounded-lg transition"
                      >
                        🖨️ Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Multi-Party Modal */}
      {isConferenceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white">🌐 Multi-Party Inter-Department Call</h3>
              <button onClick={() => setIsConferenceModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs">✕</button>
            </div>
            <p className="text-xs text-slate-400">Zaɓi ɓangaren da kake buƙatar haɗawa a kiran bidiyo:</p>
            <div className="space-y-2">
              {['Pharmacy Desk', 'Laboratory Dept', 'Private Consultant'].map((dept) => (
                <div
                  key={dept}
                  onClick={() => {
                    if (!invitedParticipants.includes(dept)) setInvitedParticipants([...invitedParticipants, dept]);
                  }}
                  className="p-3 rounded-xl border bg-slate-950 border-slate-800 text-slate-300 text-xs font-bold cursor-pointer hover:border-purple-500"
                >
                  + Add {dept} to Call
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setIsConferenceModalOpen(false);
                setIsVideoActive(true);
              }}
              className="w-full py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl"
            >
              Start Conference Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
                    }
