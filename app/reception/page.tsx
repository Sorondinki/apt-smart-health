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
  paymentStatus: 'Paid (Cash)' | 'Approved (Transfer)' | 'Pending Finance Approval';
  consultationFee: number;
  lastPrescription?: string;
  dateAdded: string;
}

interface FinanceTransferRequest {
  id: string;
  patientName: string;
  fileNo: string;
  amount: number;
  timestamp: string;
  status: 'Pending' | 'Approved';
  timeRemainingSec: number;
}

interface NotificationAlert {
  id: string;
  recipient: string;
  message: string;
  timestamp: string;
}

export default function ReceptionDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hospital Bank Details Configuration
  const hospitalBankInfo = {
    bankName: 'GTBank / Zenith Bank',
    accountName: 'Central Hospital Healthcare Ltd',
    accountNumber: '0123456789',
  };

  // Form States
  const [patientType, setPatientType] = useState<'New' | 'Returning'>('New');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [complaint, setComplaint] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer'>('Cash');
  const [consultationFee, setConsultationFee] = useState<number>(5000); // Default fee
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);

  // Pending Finance Transfers List
  const [transferRequests, setTransferRequests] = useState<FinanceTransferRequest[]>([]);

  // Notification State
  const [activeNotification, setActiveNotification] = useState<NotificationAlert | null>(null);

  // Doctors List
  const [doctors] = useState<Doctor[]>([
    { id: 'doc1', name: 'Dr. Aliyu Usman', specialty: 'General Physician', isAvailable: true },
    { id: 'doc2', name: 'Dr. Zainab Bello', specialty: 'Pediatrician', isAvailable: false },
    { id: 'doc3', name: 'Dr. Ibrahim Sani', specialty: 'Cardiologist', isAvailable: true },
  ]);

  // Patient Records
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
      paymentStatus: 'Approved (Transfer)',
      consultationFee: 5000,
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

  // 5-Minute Countdown Timer for Pending Finance Approvals
  useEffect(() => {
    const interval = setInterval(() => {
      setTransferRequests((prevRequests) =>
        prevRequests.map((req) => {
          if (req.status === 'Pending' && req.timeRemainingSec > 0) {
            return { ...req, timeRemainingSec: req.timeRemainingSec - 1 };
          }
          return req;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Dispatch Notification Handler
  const sendStaffNotification = (recipientName: string, patientName: string, fileNo: string, isEmergencyCase: boolean) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const alertMessage = isEmergencyCase
      ? `🚨 EMERGENCY ALERT: New urgent patient (${patientName} - ${fileNo}) has been routed to your unit!`
      : `🔔 NEW PATIENT ASSIGNED: Patient (${patientName} - ${fileNo}) has been assigned to your queue.`;

    const newNotification: NotificationAlert = {
      id: Date.now().toString(),
      recipient: recipientName,
      message: alertMessage,
      timestamp: timeStr,
    };

    setActiveNotification(newNotification);

    setTimeout(() => {
      setActiveNotification(null);
    }, 6000);
  };

  // Send Account Details directly to Patient via SMS / Notification
  const handleSendAccountToPatient = () => {
    if (!phone) {
      alert('Please enter patient phone number first.');
      return;
    }
    alert(
      `📲 Account Details sent to ${fullName || 'Patient'} (${phone}):\n\nBank: ${hospitalBankInfo.bankName}\nAccount: ${hospitalBankInfo.accountNumber}\nName: ${hospitalBankInfo.accountName}\nAmount: ₦${consultationFee.toLocaleString()}`
    );
  };

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please fill in the patient full name and phone number.');
      return;
    }

    let assignedStaff = '';

    if (availableDoctors.length > 0 && !isEmergency) {
      if (!selectedDoctor) {
        alert('Please select an available doctor from the list.');
        return;
      }
      const doc = doctors.find((d) => d.id === selectedDoctor);
      assignedStaff = doc ? doc.name : 'Unassigned Doctor';
    } else {
      assignedStaff = 'Duty Nurse (Emergency Unit)';
    }

    const fileNo = 'APT-' + Math.floor(1000 + Math.random() * 9000);
    const initialPaymentStatus = paymentMethod === 'Cash' ? 'Paid (Cash)' : 'Pending Finance Approval';

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
      paymentStatus: initialPaymentStatus,
      consultationFee,
      lastPrescription:
        patientType === 'Returning'
          ? 'Previous medical record retrieval requested.'
          : 'No previous prescription (New Patient)',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setPatients([newPatient, ...patients]);

    if (paymentMethod === 'Bank Transfer') {
      const newTransfer: FinanceTransferRequest = {
        id: 'REQ-' + Date.now(),
        patientName: fullName,
        fileNo,
        amount: consultationFee,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        timeRemainingSec: 300, // 5 minutes timer
      };
      setTransferRequests([newTransfer, ...transferRequests]);
      alert(`⚠️ Patient registered. Transfer verification request sent to Finance Account. Fee: ₦${consultationFee.toLocaleString()}`);
    } else {
      alert(`✅ Patient registered successfully! Consultation fee ₦${consultationFee.toLocaleString()} received in Cash.`);
    }

    sendStaffNotification(assignedStaff, fullName, fileNo, availableDoctors.length === 0 || isEmergency);

    // Reset Form
    setFullName('');
    setAge('');
    setPhone('');
    setComplaint('');
    setSelectedDoctor('');
    setIsEmergency(false);
  };

  // Manual Override Approval By Receptionist after 5 Minutes
  const handleApproveTransferByReception = (requestId: string, fileNo: string) => {
    setTransferRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'Approved' } : req))
    );

    setPatients((prev) =>
      prev.map((pt) =>
        pt.fileNo === fileNo ? { ...pt, paymentStatus: 'Approved (Transfer)' } : pt
      )
    );

    alert(`✅ Payment for file ${fileNo} manually verified and approved by Receptionist.`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  // Dynamic QR Code payload URL
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ACCOUNT:${hospitalBankInfo.accountNumber};BANK:${hospitalBankInfo.bankName};AMOUNT:${consultationFee};NAME:${encodeURIComponent(hospitalBankInfo.accountName)}`;

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
                Patient Registration, QR Payments & Instant Dispatch
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            ← Hospital Home Page
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* Patient Registration & Billing Form */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">
                Patient Registration & Consultation Fee
              </h2>
              <p className="text-xs text-slate-400">
                Register patients, generate dynamic QR payment forms, and dispatch live staff alerts.
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
                New Patient
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
                Returning Patient
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

            {/* Consultation Fee & QR Payment Dispatch Section */}
            <div className="p-4 bg-slate-900/90 border border-emerald-500/30 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-400 uppercase">
                  💳 Consultation Fee Payment
                </label>
                <span className="text-xs font-black text-white bg-emerald-950 border border-emerald-500/40 px-3 py-1 rounded-lg">
                  Amount: ₦{consultationFee.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'Cash' | 'Bank Transfer')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-purple-500"
                  >
                    <option value="Cash">Cash (Instant Receipt)</option>
                    <option value="Bank Transfer">Bank Transfer / Online Payment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Fee Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Online / Transfer Extra Action Options */}
              {paymentMethod === 'Bank Transfer' && (
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSendAccountToPatient}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <span>📲 Send Bank Account via SMS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowQRCodeModal(true)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <span>📷 Generate Scan-to-Pay QR Code</span>
                    </button>
                  </div>

                  <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                    ℹ️ <strong>Transfer Request Workflow:</strong> Scanning the QR code auto-fills hospital bank details and amount. Once transferred, a request is sent to Finance. If not approved within <strong>5 minutes</strong>, Reception can manually force-approve.
                  </div>
                </div>
              )}
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
                  <option value="">-- Select Available Doctor --</option>
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs">
                  ⚠️ Notification will be routed directly to <strong>Duty Nurse (Emergency Unit)</strong>.
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
                  Emergency Case! Dispatch immediate alert to Nurse
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
              <span>Register Patient & Process Consultation</span>
              <span>📩</span>
            </button>
          </form>
        </div>

        {/* Finance Bank Transfer Verification Log */}
        {transferRequests.length > 0 && (
          <div className="bg-slate-800/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
                  <span>🏦 Finance Department Transfer Verification Log</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Transfers awaiting Finance approval. Receptionists can force approve after 5 minutes.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {transferRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{req.patientName}</span>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                        {req.fileNo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Amount: <strong className="text-emerald-400">₦{req.amount.toLocaleString()}</strong> | Requested at: {req.timestamp}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {req.status === 'Pending' ? (
                      <>
                        <div className="text-right">
                          <span className="text-[10px] text-amber-400 font-bold block">
                            ⏳ Finance Approval Pending
                          </span>
                          <span className="text-[11px] font-mono text-slate-300">
                            Timer: {formatTimer(req.timeRemainingSec)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleApproveTransferByReception(req.id, req.fileNo)}
                          disabled={req.timeRemainingSec > 0}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                            req.timeRemainingSec === 0
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          {req.timeRemainingSec === 0 ? '✅ Force Approve' : 'Wait Timer'}
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        ✓ Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patients Table & History */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div>
            <h3 className="text-base font-black text-white">
              Registered Patient Records & Payment Status
            </h3>
            <p className="text-xs text-slate-400">
              Complete patient queue, consultation fees, and assigned medical staff.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">File ID</th>
                  <th className="py-3 px-3">Patient Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Consultation Fee</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3">Assigned Staff</th>
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
                    <td className="py-3 px-3 font-bold text-slate-200">
                      ₦{pt.consultationFee.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          pt.paymentStatus === 'Pending Finance Approval'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60 animate-pulse'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        }`}
                      >
                        {pt.paymentStatus}
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
                    <td className="py-3 px-3 text-[11px] text-slate-500">
                      {pt.dateAdded}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Dynamic QR Code Modal */}
      {showQRCodeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white">📷 Scan-to-Pay QR Code</h3>
              <button
                onClick={() => setShowQRCodeModal(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Ask patient to scan this QR code using their banking app to auto-fill hospital details:
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block border-4 border-emerald-500 shadow-xl">
              <img src={qrDataUrl} alt="Bank QR Code" className="w-44 h-44 mx-auto" />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left space-y-1 text-xs">
              <p className="text-slate-400">
                Bank: <strong className="text-white">{hospitalBankInfo.bankName}</strong>
              </p>
              <p className="text-slate-400">
                Account No: <strong className="text-emerald-400 font-mono">{hospitalBankInfo.accountNumber}</strong>
              </p>
              <p className="text-slate-400">
                Fee Amount: <strong className="text-white">₦{consultationFee.toLocaleString()}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowQRCodeModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
            >
              Close QR Code Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
              }
