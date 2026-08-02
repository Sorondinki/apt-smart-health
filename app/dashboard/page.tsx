'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StaffMember {
  id: string;
  name: string;
  role: 'DOCTOR' | 'NURSE' | 'LAB_TECH' | 'RECEPTIONIST' | 'PHARMACIST';
  department: string;
  dutyStatus: 'ON_DUTY' | 'OFF_DUTY' | 'ON_LEAVE';
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: string;
  fee: number;
  status: 'BOOKED' | 'COMPLETED' | 'CANCELLED';
}

export default function HospitalDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [userRole, setUserRole] = useState('');

  // UI Tabs for Navigation
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STAFF_REG' | 'DUTY_ASSIGN' | 'APPOINTMENTS' | 'REVENUE'>('OVERVIEW');

  // Modal State for New Staff
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'DOCTOR', department: '' });

  // Dummy State Data (Easily connected to API/Database)
  const [staffList, setStaffList] = useState<StaffMember[]>([
    { id: 'STF-001', name: 'Dr. Aminu Kano', role: 'DOCTOR', department: 'Cardiology', dutyStatus: 'ON_DUTY' },
    { id: 'STF-002', name: 'Nurse Hauwa Ibrahim', role: 'NURSE', department: 'Emergency', dutyStatus: 'ON_DUTY' },
    { id: 'STF-003', name: 'Musa Lab Tech', role: 'LAB_TECH', department: 'Diagnostics', dutyStatus: 'ON_DUTY' },
    { id: 'STF-004', name: 'Fatima Reception', role: 'RECEPTIONIST', department: 'Front Desk', dutyStatus: 'ON_DUTY' },
    { id: 'STF-005', name: 'Pharm. Kabiru', role: 'PHARMACIST', department: 'Pharmacy', dutyStatus: 'OFF_DUTY' },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'APT-101', patientName: 'Sani Usman', doctorName: 'Dr. Aminu Kano', department: 'Cardiology', date: '2026-08-02 10:30 AM', fee: 15000, status: 'BOOKED' },
    { id: 'APT-102', patientName: 'Aisha Bello', doctorName: 'Dr. Aisha Zaria', department: 'Pediatrics', date: '2026-08-02 11:15 AM', fee: 12000, status: 'BOOKED' },
  ]);

  useEffect(() => {
    // 🔐 1. AUTH CHECK
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole') || 'HOSPITAL_ADMIN';
    setUserRole(role);

    if (!isLoggedIn) {
      router.push('/apt-login');
      return;
    }

    // ⏳ 2. SUBSCRIPTION CHECK
    if (role !== 'SUPER_ADMIN') {
      const regDateStr = localStorage.getItem('apt_reg_date');
      if (regDateStr) {
        const regDate = new Date(regDateStr);
        const currentDate = new Date();
        const diffDays = Math.ceil(Math.abs(currentDate.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
          setIsTrialExpired(true);
        }
      }
    }

    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/apt-login');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.department) return;

    const created: StaffMember = {
      id: `STF-00${staffList.length + 1}`,
      name: newStaff.name,
      role: newStaff.role as any,
      department: newStaff.department,
      dutyStatus: 'OFF_DUTY',
    };

    setStaffList([...staffList, created]);
    setNewStaff({ name: '', role: 'DOCTOR', department: '' });
    setShowStaffModal(false);
  };

  const toggleDutyStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((member) =>
        member.id === id
          ? { ...member, dutyStatus: member.dutyStatus === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY' }
          : member
      )
    );
  };

  // Calculations for MD Revenue View
  const totalRevenue = appointments.reduce((sum, item) => sum + item.fee, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative">
      
      {/* ⚠️ EXPIRED SUBSCRIPTION MODAL */}
      {isTrialExpired && userRole !== 'SUPER_ADMIN' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-red-500/20">
              🔒
            </div>
            <h2 className="text-xl font-extrabold text-white">Free Trial Expired</h2>
            <p className="text-xs text-slate-400">
              Your 1-month free trial period for APT Smart-Health has ended. Please renew to continue managing hospital operations.
            </p>
            <div className="pt-2 space-y-2">
              <Link href="/subscription" className="block w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition">
                Renew Subscription Now →
              </Link>
              <button onClick={handleLogout} className="block w-full py-2.5 bg-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-600/30">
              🏥
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                APT Hospital Executive Portal
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  ★ MD COMMAND
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">Full Hospital & Staff Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStaffModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              + Register Staff
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'OVERVIEW', label: '📊 Executive Summary' },
            { id: 'STAFF_REG', label: '👥 Staff Directory' },
            { id: 'DUTY_ASSIGN', label: '📋 Duty Roster' },
            { id: 'APPOINTMENTS', label: '📅 Appointments & Charges' },
            { id: 'REVENUE', label: '💰 Hospital Revenue' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Staff Registered</p>
                <h2 className="text-2xl font-black text-white mt-1">{staffList.length}</h2>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">On-Duty Medical Staff</p>
                <h2 className="text-2xl font-black text-emerald-400 mt-1">
                  {staffList.filter((s) => s.dutyStatus === 'ON_DUTY').length}
                </h2>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Booked Appointments</p>
                <h2 className="text-2xl font-black text-amber-400 mt-1">{appointments.length}</h2>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Daily Revenue</p>
                <h2 className="text-2xl font-black text-sky-400 mt-1">₦{totalRevenue.toLocaleString()}</h2>
              </div>
            </div>

            {/* Direct Quick Action Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/doctor/" className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-sky-500 transition block">
                <h4 className="font-bold text-sm text-white">👨‍⚕️ Doctor Console</h4>
                <p className="text-xs text-slate-400 mt-1">Consultation EHR & Telemedicine portal.</p>
              </Link>
              <Link href="/lab/" className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-purple-500 transition block">
                <h4 className="font-bold text-sm text-white">🔬 Lab Technician Console</h4>
                <p className="text-xs text-slate-400 mt-1">Upload & dispatch diagnostic reports.</p>
              </Link>
              <Link href="/pharmacy/" className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500 transition block">
                <h4 className="font-bold text-sm text-white">💊 Pharmacy Portal</h4>
                <p className="text-xs text-slate-400 mt-1">Dispense drugs and view digital prescriptions.</p>
              </Link>
            </div>
          </div>
        )}

        {/* 2. STAFF DIRECTORY & REGISTRATION TAB */}
        {activeTab === 'STAFF_REG' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Registered Hospital Staff Members</h3>
              <button
                onClick={() => setShowStaffModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
              >
                + Register New Staff
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Staff ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Duty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-sky-400">{staff.id}</td>
                      <td className="p-3 font-bold text-white">{staff.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 border border-slate-700 text-amber-300">
                          {staff.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{staff.department}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          staff.dutyStatus === 'ON_DUTY'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {staff.dutyStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. DUTY ROSTER & SHIFT ASSIGNMENT TAB */}
        {activeTab === 'DUTY_ASSIGN' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white">Shift & Duty Assignment Manager</h3>
            <p className="text-xs text-slate-400">Toggle staff duty availability for active shifts.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {staffList.map((staff) => (
                <div key={staff.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{staff.name}</h4>
                    <p className="text-[10px] text-amber-400">{staff.role} • {staff.department}</p>
                  </div>
                  <button
                    onClick={() => toggleDutyStatus(staff.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                      staff.dutyStatus === 'ON_DUTY'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {staff.dutyStatus === 'ON_DUTY' ? '● On Duty' : 'Set Active'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. APPOINTMENTS & CHARGES TAB */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white">Patient Bookings & Doctor Charges</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Assigned Doctor</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Consultation Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-amber-400">{apt.id}</td>
                      <td className="p-3 font-bold text-white">{apt.patientName}</td>
                      <td className="p-3 text-slate-300">{apt.doctorName}</td>
                      <td className="p-3 text-slate-400">{apt.department}</td>
                      <td className="p-3 text-slate-400">{apt.date}</td>
                      <td className="p-3 font-bold text-emerald-400">₦{apt.fee.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. REVENUE OVERSIGHT TAB */}
        {activeTab === 'REVENUE' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="font-bold text-sm text-white">MD Financial Command & Revenue Channels</h3>
              <p className="text-xs text-slate-400">Track consultation fees, laboratory testing payments, and pharmacy sales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor Consultation Revenue</p>
                <h2 className="text-xl font-bold text-emerald-400 mt-1">₦{totalRevenue.toLocaleString()}</h2>
              </div>
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Lab Diagnostics Revenue</p>
                <h2 className="text-xl font-bold text-sky-400 mt-1">₦45,000</h2>
              </div>
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Pharmacy Sales Revenue</p>
                <h2 className="text-xl font-bold text-purple-400 mt-1">₦82,500</h2>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: REGISTER STAFF */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Register New Hospital Staff</h3>
            
            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Fatima Usman / Nurse Aliyu"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-sky-500 outline-none"
                >
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="LAB_TECH">Lab Technician</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="PHARMACIST">Pharmacy Technician</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pediatrics, Emergency, Diagnostics"
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-sky-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
                                                }
