'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  patientName: string;
  patientId: string;
  serviceType: string;
  description: string;
  amount: number;
  status: 'Unpaid' | 'Paid';
}

interface TransactionItem {
  id: string;
  patientName: string;
  amount: number;
  type: string;
  paymentMethod: 'Cash' | 'POS Terminal' | 'Bank Transfer';
  timestamp: string;
}

interface StaffPayroll {
  id: string;
  staffName: string;
  role: string;
  department: string;
  baseSalary: number;
  allowance: number;
  status: 'Pending' | 'Paid';
  paymentDate?: string;
}

export default function HospitalFinanceDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'billing' | 'payroll'>('billing');

  // VIDEO & CONFERENCE CALL STATES
  const [isCallActive, setIsCallActive] = useState(false);
  const [callMode, setCallMode] = useState<'video' | 'conference'>('video');
  const [callRecipient, setCallRecipient] = useState('MD Office / Hospital Admin');

  // PENDING PATIENT BILLS QUEUE
  const [pendingBills, setPendingBills] = useState<InvoiceItem[]>([
    {
      id: 'INV-1001',
      patientName: 'Amina Ibrahim',
      patientId: 'APT-8902',
      serviceType: 'Pharmacy Dispense',
      description: 'Paracetamol & Amoxicillin Order',
      amount: 4700,
      status: 'Unpaid',
    },
    {
      id: 'INV-1002',
      patientName: 'Usman Bello',
      patientId: 'APT-7710',
      serviceType: 'Doctor Consultation',
      description: 'General OPD Consultation Fee',
      amount: 3000,
      status: 'Unpaid',
    },
  ]);

  // COMPLETED TRANSACTIONS HISTORY
  const [completedTransactions, setCompletedTransactions] = useState<TransactionItem[]>([
    { id: 'TX-900', patientName: 'Kabiru Sanusi', amount: 4500, type: 'Lab Test Fee', paymentMethod: 'POS Terminal', timestamp: '10:14 AM' },
    { id: 'TX-899', patientName: 'Zainab Dahiru', amount: 2000, type: 'Card Registration', paymentMethod: 'Cash', timestamp: '09:45 AM' },
  ]);

  // HOSPITAL STAFF PAYROLL SYSTEM
  const [staffPayroll, setStaffPayroll] = useState<StaffPayroll[]>([
    { id: 'EMP-01', staffName: 'Dr. Jamilu Sadiq', role: 'Chief Medical Officer', department: 'Clinical', baseSalary: 350000, allowance: 50000, status: 'Pending' },
    { id: 'EMP-02', staffName: 'Nurse Maryam Lawal', role: 'Senior Staff Nurse', department: 'Nursing', baseSalary: 180000, allowance: 20000, status: 'Pending' },
    { id: 'EMP-03', staffName: 'Pharm. Ibrahim Aliyu', role: 'Pharmacy Technician', department: 'Pharmacy', baseSalary: 150000, allowance: 15000, status: 'Paid', paymentDate: '01 Aug 2026' },
    { id: 'EMP-04', staffName: 'Aisha Garba', role: 'Chief Finance Officer', department: 'Accounts', baseSalary: 200000, allowance: 25000, status: 'Pending' },
  ]);

  // MANUAL INVOICE FORM
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientId, setNewPatientId] = useState('');
  const [newServiceType, setNewServiceType] = useState('Registration Fee');
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // 🔐 AUTHENTICATION GUARD
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // PROCESS PATIENT PAYMENT
  const handleProcessPayment = (
    billId: string,
    amount: number,
    patientName: string,
    method: 'Cash' | 'POS Terminal' | 'Bank Transfer'
  ) => {
    alert(`✅ PAYMENT SUCCESSFUL!\n\nAmount: ₦${amount.toLocaleString()}\nPatient: ${patientName}\nMethod: ${method}\nOfficial Digital Receipt Printed.`);
    
    setPendingBills(prev => prev.filter(bill => bill.id !== billId));
    setCompletedTransactions(prev => [
      {
        id: `TX-${Math.floor(100 + Math.random() * 900)}`,
        patientName,
        amount,
        type: 'Direct Settlement',
        paymentMethod: method,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  // DISBURSE STAFF SALARY
  const handleDisburseSalary = (staffId: string, staffName: string, totalNet: number) => {
    alert(`💸 SALARY DISBURSED!\n\nStaff: ${staffName}\nNet Amount: ₦${totalNet.toLocaleString()}\nStatus: Direct Bank Transfer Dispatched & Salary Slip Generated.`);

    setStaffPayroll(prev =>
      prev.map(emp =>
        emp.id === staffId
          ? { ...emp, status: 'Paid', paymentDate: new Date().toLocaleDateString('en-GB') }
          : emp
      )
    );
  };

  // CREATE MANUAL INVOICE
  const handleCreateManualInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newAmount) return;

    const newBill: InvoiceItem = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newPatientName,
      patientId: newPatientId || `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: newServiceType,
      description: newDescription || 'Hospital Billing',
      amount: parseFloat(newAmount),
      status: 'Unpaid',
    };

    setPendingBills(prev => [newBill, ...prev]);
    alert(`🧾 New Invoice ${newBill.id} created for ${newPatientName}!`);

    setNewPatientName('');
    setNewPatientId('');
    setNewAmount('');
    setNewDescription('');
  };

  const totalRevenue = completedTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaidPayroll = staffPayroll
    .filter(emp => emp.status === 'Paid')
    .reduce((acc, curr) => acc + (curr.baseSalary + curr.allowance), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col pb-12">
      
      {/* Top Header */}
      <header className="border-b border-amber-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-600 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-lg shadow-amber-600/30">
              💳
            </div>
            <div>
              <h1 className="font-extrabold text-xs sm:text-base text-white tracking-tight flex items-center gap-1.5">
                APT Finance, Accounts & Payroll Portal
                <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  ENTERPRISE
                </span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Patient Billing, Staff Payroll & Tele-Conference Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCallActive(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] sm:text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
            >
              📹 <span>Conference</span>
            </button>
            <Link
              href="/dashboard/"
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        
        {/* Navigation Tabs (Billing vs Payroll) */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'billing'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            💳 Patient Billing & Counter Queue
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === 'payroll'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            💰 Staff Payroll System
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-950 text-emerald-400 border border-emerald-500/30">
              NEW
            </span>
          </button>
        </div>

        {/* Dynamic Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Today's Revenue</p>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">₦{totalRevenue.toLocaleString()}</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Pending Invoices</p>
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">{pendingBills.length} Bills</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Monthly Payroll Paid</p>
            <h2 className="text-xl sm:text-2xl font-black text-sky-400 mt-0.5">₦{totalPaidPayroll.toLocaleString()}</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Net Hospital Profit</p>
            <h2 className="text-xl sm:text-2xl font-black text-purple-400 mt-0.5">₦{(totalRevenue - totalPaidPayroll).toLocaleString()}</h2>
          </div>
        </div>

        {/* TAB 1: PATIENT BILLING & CASHIER QUEUE */}
        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>📋 Pending Cashier Payment Queue</span>
                  <span className="text-[10px] text-slate-400">{pendingBills.length} Waiting</span>
                </h3>

                {pendingBills.length === 0 ? (
                  <div className="p-6 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500">
                    No pending invoices awaiting payment at the cashier counter.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingBills.map(bill => (
                      <div key={bill.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                {bill.id}
                              </span>
                              <span className="text-[9px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                                {bill.serviceType}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-xs sm:text-sm text-white mt-1">
                              {bill.patientName} <span className="text-slate-400 font-normal">({bill.patientId})</span>
                            </h4>
                            <p className="text-[10px] text-slate-400">{bill.description}</p>
                          </div>
                          <span className="text-xs sm:text-sm font-black text-emerald-400">
                            ₦{bill.amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <button
                            onClick={() => handleProcessPayment(bill.id, bill.amount, bill.patientName, 'Cash')}
                            className="py-2 bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold text-[10px] rounded-xl border border-emerald-500/30 transition"
                          >
                            💵 Cash
                          </button>
                          <button
                            onClick={() => handleProcessPayment(bill.id, bill.amount, bill.patientName, 'POS Terminal')}
                            className="py-2 bg-sky-600/20 hover:bg-sky-600 hover:text-white text-sky-400 font-bold text-[10px] rounded-xl border border-sky-500/30 transition"
                          >
                            💳 POS
                          </button>
                          <button
                            onClick={() => handleProcessPayment(bill.id, bill.amount, bill.patientName, 'Bank Transfer')}
                            className="py-2 bg-purple-600/20 hover:bg-purple-600 hover:text-white text-purple-400 font-bold text-[10px] rounded-xl border border-purple-500/30 transition"
                          >
                            🏦 Transfer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Manual Invoice */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
                <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  ➕ Create Direct Hospital Invoice
                </h3>
                <form onSubmit={handleCreateManualInvoice} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Patient Full Name"
                    value={newPatientName}
                    onChange={e => setNewPatientName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Patient ID (e.g. APT-1022)"
                    value={newPatientId}
                    onChange={e => setNewPatientId(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                  <select
                    value={newServiceType}
                    onChange={e => setNewServiceType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="Registration Fee">Card & Registration Fee</option>
                    <option value="Doctor Consultation">Doctor Consultation</option>
                    <option value="Laboratory Test">Laboratory Test</option>
                    <option value="Emergency Deposit">Emergency Deposit</option>
                    <option value="Surgical Fee">Surgical / Theatre Deposit</option>
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Amount (₦)"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-2 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                  >
                    Generate Invoice
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  📜 Recent Receipts
                </h3>
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {completedTransactions.map(tx => (
                    <div key={tx.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-white">{tx.patientName}</p>
                        <p className="text-[10px] text-slate-400">{tx.type} • {tx.paymentMethod} • {tx.timestamp}</p>
                      </div>
                      <span className="text-xs font-black text-emerald-400">+₦{tx.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF PAYROLL MANAGEMENT SYSTEM */}
        {activeTab === 'payroll' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>💰 Hospital Staff Payroll Directory</span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    AUGUST 2026 CYCLE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Manage salary disbursements, basic pay, allowances, and digital paystub generation for all hospital staff.
                </p>
              </div>
            </div>

            {/* Payroll Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase font-bold text-slate-400">
                    <th className="p-3">Staff Member</th>
                    <th className="p-3">Department & Role</th>
                    <th className="p-3">Base Salary</th>
                    <th className="p-3">Allowances</th>
                    <th className="p-3">Total Net Pay</th>
                    <th className="p-3">Payment Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {staffPayroll.map(emp => {
                    const totalNet = emp.baseSalary + emp.allowance;
                    return (
                      <tr key={emp.id} className="hover:bg-slate-950/40 transition">
                        <td className="p-3 font-extrabold text-white">
                          {emp.staffName}
                          <p className="text-[9px] font-normal text-slate-500">{emp.id}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-200">{emp.role}</p>
                          <span className="text-[9px] text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded">
                            {emp.department}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-300">₦{emp.baseSalary.toLocaleString()}</td>
                        <td className="p-3 font-semibold text-slate-300">₦{emp.allowance.toLocaleString()}</td>
                        <td className="p-3 font-extrabold text-emerald-400">₦{totalNet.toLocaleString()}</td>
                        <td className="p-3">
                          {emp.status === 'Paid' ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              ✓ Paid on {emp.paymentDate}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              ⏳ Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {emp.status === 'Pending' ? (
                            <button
                              onClick={() => handleDisburseSalary(emp.id, emp.staffName, totalNet)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-xl shadow-md transition"
                            >
                              Disburse Salary 💸
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`📄 PRINTING PAY SLIP:\n\nEmployee: ${emp.staffName}\nRole: ${emp.role}\nTotal Paid: ₦${totalNet.toLocaleString()}\nDate: ${emp.paymentDate}`)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-xl border border-slate-700 transition"
                            >
                              Print Slip 📄
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* VIDEO & TELE-CONFERENCE CALL MODAL */}
      {isCallActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>📹 APT Tele-Health Conference</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-bold border border-red-500/30 animate-pulse">
                    LIVE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Connected with: <span className="text-purple-300 font-bold">{callRecipient}</span></p>
              </div>

              <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCallMode('video')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${callMode === 'video' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  Video
                </button>
                <button
                  onClick={() => setCallMode('conference')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${callMode === 'conference' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  Conference
                </button>
              </div>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-2xl mx-auto animate-bounce">
                  💳
                </div>
                <p className="text-xs font-bold text-slate-300">
                  {callMode === 'video' ? `P2P Encrypted Video Call Active` : `Multi-Department Conference Active`}
                </p>
                <p className="text-[10px] text-slate-500">Connecting Feeds...</p>
              </div>
              <div className="absolute bottom-3 right-3 w-24 h-16 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex items-center justify-center text-[9px] text-slate-400 font-bold shadow-lg">
                Finance Cam
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => alert('Muted')} className="p-3 rounded-2xl bg-slate-800 text-slate-200 text-sm">🎙️</button>
              <button onClick={() => alert('Camera Off')} className="p-3 rounded-2xl bg-slate-800 text-slate-200 text-sm">📹</button>
              <button onClick={() => setIsCallActive(false)} className="px-5 py-3 rounded-2xl bg-red-600 text-white font-bold text-xs shadow-lg">End Call 🛑</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
                                    }
