'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  isAvailable: boolean;
}

interface PatientRecord {
  fileNo: string;
  fullName: string;
  age: string;
  gender: string;
  phone: string;
  complaint: string;
  assignedTo: string;
  isEmergency: boolean;
  type: 'New' | 'Returning';
  lastPrescription?: string;
  dateAdded: string;
}

interface NotificationAlert {
  id: string;
  recipient: string;
  message: string;
  timestamp: string;
}

export default function ReceptionDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form States
  const [patientType, setPatientType] = useState<'New' | 'Returning'>('New');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [complaint, setComplaint] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  // Notification State
  const [activeNotification, setActiveNotification] = useState<NotificationAlert | null>(null);

  // Sample Doctors List
  const [doctors] = useState<Doctor[]>([
    { id: 'doc1', name: 'Dr. Aliyu Usman', specialty: 'General Physician', isAvailable: true },
    { id: 'doc2', name: 'Dr. Zainab Bello', specialty: 'Pediatrician', isAvailable: false },
    { id: 'doc3', name: 'Dr. Ibrahim Sani', specialty: 'Cardiologist', isAvailable: true },
  ]);

  // Sample Patient Records
  const [patients, setPatients] = useState<PatientRecord[]>([
    {
      fileNo: 'APT-1042',
      fullName: 'Amina Kabir',
      age: '28',
      gender: 'Female',
      phone: '08031234567',
      complaint: 'Severe Headache & Fever',
      assignedTo: 'Dr. Aliyu Usman',
      isEmergency: false,
      type: 'Returning',
      lastPrescription: 'Paracetamol 500mg (2x3), Artemether 80mg (1x2)',
      dateAdded: '2026-08-01',
    },
  ]);

  const availableDoctors = doctors.filter((doc) => doc.isAvailable);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Dispatch Notification Handler
  const sendStaffNotification = (recipientName: string, patientName: string, fileNo: string, isEmergencyCase: boolean) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const alertMessage = isEmergencyCase
      ? `🚨 EMERGENCY ALERT: Sabon maras lafiya da ke buƙatar gaggawa (${patientName} - ${fileNo}) an tura shi zuwa gare ka!`
      : `🔔 NEW PATIENT ASSIGNED: An tura maras lafiya (${patientName} - ${fileNo}) zuwa kukan ka/shafin ka.`;

    const newNotification: NotificationAlert = {
      id: Date.now().toString(),
      recipient: recipientName,
      message: alertMessage,
      timestamp: timeStr,
    };

    setActiveNotification(newNotification);

    // Auto dismiss toast notification after 6 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 6000);
  };

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Don Allah cika sunan marar lafiya da lamba ta waya.');
      return;
    }

    let assignedStaff = '';

    if (availableDoctors.length > 0 && !isEmergency) {
      if (!selectedDoctor) {
        alert('Don Allah zaɓi Likita daga cikin wadanda ke akwai (Available Doctors).');
        return;
      }
      const doc = doctors.find((d) => d.id === selectedDoctor);
      assignedStaff = doc ? doc.name : 'Unassigned Doctor';
    } else {
      assignedStaff = 'Duty Nurse (Emergency Unit)';
    }

    const fileNo = 'APT-' + Math.floor(1000 + Math.random() * 9000);

    const newPatient: PatientRecord = {
      fileNo,
      fullName,
      age,
      gender,
      phone,
      complaint,
      assignedTo: assignedStaff,
      isEmergency: availableDoctors.length === 0 || isEmergency,
      type: patientType,
      lastPrescription:
        patientType === 'Returning'
          ? 'An tura bukatar sake duba maganin baya zuwa likita'
          : 'No previous prescription (New Patient)',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setPatients([newPatient, ...patients]);

    // Send Real-time Notification Event
    sendStaffNotification(assignedStaff, fullName, fileNo, availableDoctors.length === 0 || isEmergency);

    // Reset Form
    setFullName('');
    setAge('');
    setPhone('');
    setComplaint('');
    setSelectedDoctor('');
    setIsEmergency(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col pb-12 relative">
      {/* Toast Notification Alert Box */}
      {activeNotification && (
        <div className="fixed top-20 right-6 z-50 max-w-md w-full bg-purple-950 border border-purple-500/50 shadow-2xl rounded-2xl p-4 flex items-start gap-3 animate-bounce">
          <div className="text-xl">📩</div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between font-bold text-purple-300">
              <span>Notification Sent → {activeNotification.recipient}</span>
              <span className="text-[10px] text-slate-400">{activeNotification.timestamp}</span>
            </div>
            <p className="text-slate-200 mt-1">{activeNotification.message}</p>
          </div>
          <button 
            onClick={() => setActiveNotification(null)}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-600/30">
              📋
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Hospital Central Reception Desk
              </h1>
              <p className="text-[10px] text-slate-400">
                Patient Registration, Doctor Assignment & Live Alerts
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            ← Hospital Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* Patient Registration Form */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">
                Patient Registration & Instant Staff Dispatch
              </h2>
              <p className="text-xs text-slate-400">
                Buɗe fayil, tura sanarwa (Notification) nan take ga Likita ko Nurse.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setPatientType('New')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  patientType === 'New'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sabon Maras Lafiya (New)
              </button>
              <button
                type="button"
                onClick={() => setPatientType('Returning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  patientType === 'Returning'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tsohon Maras Lafiya (Returning)
              </button>
            </div>
          </div>

          <form onSubmit={handleRegisterPatient} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Fatima Abubakar"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
            </div>

            {/* Doctor Assignment Section */}
            <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-400 uppercase">
                  Assign Consultant (Doctor)
                </label>
                <span className="text-[11px] text-slate-400">
                  Available Doctors:{' '}
                  <strong className="text-emerald-400 font-bold">
                    {availableDoctors.length}
                  </strong>
                </span>
              </div>

              {availableDoctors.length > 0 && !isEmergency ? (
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
                >
                  <option value="">-- Zaɓi Likita Daga Jeri --</option>
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs">
                  ⚠️ Za a tura notification kai tsaye zuwa <strong>Duty Nurse (Emergency Case)</strong>.
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                />
                <label htmlFor="emergency" className="text-xs font-bold text-red-400 cursor-pointer">
                  Akwai Emergency! Tura notification zuwa Nurse kai tsaye
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Chief Complaint / Notes
              </label>
              <textarea
                rows={3}
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Brief reason for visit..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Register Patient & Dispatch Notification</span>
              <span>📩</span>
            </button>
          </form>
        </div>

        {/* Patients Table & History */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div>
            <h3 className="text-base font-black text-white">
              Patient Files & Prescription Records
            </h3>
            <p className="text-xs text-slate-400">
              Teburin fayiloli da sakonnin da aka tura wa ma'aikata.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">File ID</th>
                  <th className="py-3 px-3">Patient Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Assigned Staff</th>
                  <th className="py-3 px-3">Last Prescription</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {patients.map((pt, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-purple-400">
                      {pt.fileNo}
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      {pt.fullName}
                      <span className="block text-[10px] text-slate-500">
                        {pt.gender}, {pt.age} yrs | {pt.phone}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          pt.type === 'Returning'
                            ? 'bg-blue-900/50 text-blue-400 border border-blue-700/40'
                            : 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/40'
                        }`}
                      >
                        {pt.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          pt.isEmergency ? 'text-red-400' : 'text-slate-200'
                        }`}
                      >
                        {pt.assignedTo}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-400 italic">
                      {pt.lastPrescription}
                    </td>
                    <td className="py-[10px] px-3 text-[11px] text-slate-500">
                      {pt.dateAdded}
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
        
