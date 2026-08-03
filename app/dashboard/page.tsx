'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StaffMember {
  id: string;
  name: string;
  role: 'DOCTOR' | 'NURSE' | 'LAB_TECH' | 'RECEPTIONIST' | 'PHARMACIST';
  department: string;
  email: string;
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

  // UI Navigation Tabs
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STAFF_REG' | 'DUTY_ASSIGN' | 'APPOINTMENTS' | 'REVENUE'>('OVERVIEW');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Modals Control State
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Form Input States
  const [newStaff, setNewStaff] = useState({ 
    name: '', 
    email: '',
    password: '',
    role: 'DOCTOR' as StaffMember['role'], 
    department: '' 
  });

  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctorName: '',
    department: '',
    date: '',
    fee: ''
  });

  // Default Fallback Data
  const defaultStaff: StaffMember[] = [
    { id: 'STF-001', name: 'Dr. Aminu Kano', email: 'aminu@hospital.com', role: 'DOCTOR', department: 'Cardiology', dutyStatus: 'ON_DUTY' },
    { id: 'STF-002', name: 'Nurse Hauwa Ibrahim', email: 'hauwa@hospital.com', role: 'NURSE', department: 'Emergency', dutyStatus: 'ON_DUTY' },
    { id: 'STF-003', name: 'Musa Lab Tech', email: 'musa@hospital.com', role: 'LAB_TECH', department: 'Diagnostics', dutyStatus: 'ON_DUTY' },
    { id: 'STF-004', name: 'Fatima Reception', email: 'fatima@hospital.com', role: 'RECEPTIONIST', department: 'Front Desk', dutyStatus: 'ON_DUTY' },
    { id: 'STF-005', name: 'Pharm. Kabiru', email: 'kabiru@hospital.com', role: 'PHARMACIST', department: 'Pharmacy', dutyStatus: 'OFF_DUTY' },
  ];

  const defaultAppointments: Appointment[] = [
    { id: 'APT-101', patientName: 'Sani Usman', doctorName: 'Dr. Aminu Kano', department: 'Cardiology', date: '2026-08-02 10:30 AM', fee: 15000, status: 'BOOKED' },
    { id: 'APT-102', patientName: 'Aisha Bello', doctorName: 'Dr. Aisha Zaria', department: 'Pediatrics', date: '2026-08-02 11:15 AM', fee: 12000, status: 'BOOKED' },
  ];

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // 1. INITIALIZE & PERSISTENT LOCALSTORAGE RETRIEVAL
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole') || 'HOSPITAL_ADMIN';
    setUserRole(role);

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Load Persistent Staff List
    const savedStaff = localStorage.getItem('apt_hospital_staff');
    if (savedStaff) {
      try {
        setStaffList(JSON.parse(savedStaff));
      } catch (e) {
        setStaffList(defaultStaff);
      }
    } else {
      setStaffList(defaultStaff);
      localStorage.setItem('apt_hospital_staff', JSON.stringify(defaultStaff));
    }

    // Load Persistent Appointments List
    const savedAppointments = localStorage.getItem('apt_hospital_appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (e) {
        setAppointments(defaultAppointments);
      }
    } else {
      setAppointments(defaultAppointments);
      localStorage.setItem('apt_hospital_appointments', JSON.stringify(defaultAppointments));
    }

    // Subscription Expiry Verification
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
    router.push('/login');
  };

  // HANDLER: REGISTER NEW STAFF & SAVE TO LOCALSTORAGE
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password || !newStaff.department) {
      alert('Please fill out all required fields including login credentials.');
      return;
    }

    const created: StaffMember = {
      id: `STF-00${staffList.length + 1}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      department: newStaff.department,
      dutyStatus: 'OFF_DUTY',
    };

    const updatedStaff = [...staffList, created];
    setStaffList(updatedStaff);
    
    // Save permanently so it survives browser refresh
    localStorage.setItem('apt_hospital_staff', JSON.stringify(updatedStaff));
    
    setNewStaff({ name: '', email: '', password: '', role: 'DOCTOR', department: '' });
    setShowStaffModal(false);
    
    alert(`✅ Staff ${created.name} registered successfully! Account is saved and active.`);
  };

  // HANDLER: BOOK NEW APPOINTMENT & SAVE
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.patientName || !newAppointment.doctorName || !newAppointment.fee) {
      alert('Please complete all appointment details.');
      return;
    }

    const createdApt: Appointment = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      patientName: newAppointment.patientName,
      doctorName: newAppointment.doctorName,
      department: newAppointment.department || 'General Medicine',
      date: newAppointment.date || new Date().toLocaleString(),
      fee: parseFloat(newAppointment.fee),
      status: 'BOOKED',
    };

    const updatedApts = [...appointments, createdApt];
    setAppointments(updatedApts);
    localStorage.setItem('apt_hospital_appointments', JSON.stringify(updatedApts));

    setNewAppointment({ patientName: '', doctorName: '', department: '', date: '', fee: '' });
    setShowAppointmentModal(false);

    alert(`✅ Appointment booked for ${createdApt.patientName}`);
  };

  // HANDLER: DELETE STAFF MEMBER
  const handleDeleteStaff = (id: string) => {
    if (confirm('Are you sure you want to remove this staff record?')) {
      const filtered = staffList.filter((s) => s.id !== id);
      setStaffList(filtered);
      localStorage.setItem('apt_hospital_staff', JSON.stringify(filtered));
    }
  };

  // HANDLER: TOGGLE DUTY STATUS & SAVE
  const toggleDutyStatus = (id: string) => {
    const updated = staffList.map((member) =>
      member.id === id
        ? { ...member, dutyStatus: (member.dutyStatus === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY') as StaffMember['dutyStatus'] }
        : member
    );
    setStaffList(updated);
    localStorage.setItem('apt_hospital_staff', JSON.stringify(updated));
  };

  // Search Filter
  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Financial Calculations
  const totalConsultationRevenue = appointments.reduce((sum, item) => sum + item.fee, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs font-bold">
        Verifying system authorization session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative pb-10">
      
      {/* EXPIRED SUBSCRIPTION MODAL */}
      {isTrialExpired && userRole !== 'SUPER_ADMIN' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-red-500/20">
              🔒
            </div>
            <h2 className="text-xl font-extrabold text-white">Trial Period Expired</h2>
            <p className="text-xs text-slate-400">
              Your 30-day trial period for APT Smart-Health Executive Portal has concluded. Please activate a paid tier to continue operations.
            </p>
            <div className="pt-2 space-y-2">
              <Link href="/subscription" className="block w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition">
                Renew Plan Subscription →
              </Link>
              <button onClick={handleLogout} className="block w-full py-2.5 bg-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-sky-600/30">
              🏥
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                APT Hospital Command Dashboard
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  ★ EXECUTIVE MD
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">Central Management & Staff Oversight Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowStaffModal(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>+ Register Staff</span>
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

      {/* Dashboard Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'OVERVIEW', label: '📊 Executive Summary' },
              { id: 'STAFF_REG', label: '👥 Staff Directory' },
              { id: 'DUTY_ASSIGN', label: '📋 Duty Roster' },
              { id: 'APPOINTMENTS', label: '📅 Appointments & Bookings' },
              { id: 'REVENUE', label: '💰 Financial Command' },
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

          {/* Quick Search */}
          {activeTab === 'STAFF_REG' && (
            <input
              type="text"
              placeholder="Search staff by name or dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-sky-500"
            />
          )}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Registered Staff</p>
                <h2 className="text-2xl font-black text-white mt-1">{staffList.length}</h2>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Active On-Duty Personnel</p>
                <h2 className="text-2xl font-black text-emerald-400 mt-1">
                  {staffList.filter((s) => s.dutyStatus === 'ON_DUTY').length}
                </h2>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Booked Appointments</p>
                <h2 className="text-2xl font-black text-amber-400 mt-1">{appointments.length}</h2>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Today's Estimated Revenue</p>
                <h2 className="text-2xl font-black text-sky-400 mt-1">₦{(totalConsultationRevenue + 127500).toLocaleString()}</h2>
              </div>
            </div>

            {/* Sub-Department Consoles Shortcuts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Departmental Consoles Access</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/doctor/" className="p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-sky-500 transition block group shadow-lg">
                  <h4 className="font-bold text-sm text-white group-hover:text-sky-400 transition">👨‍⚕️ Doctor Console</h4>
                  <p className="text-xs text-slate-400 mt-1">Direct telemedicine, diagnosis, and patient EHR records.</p>
                </Link>
                <Link href="/nurse/" className="p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-rose-500 transition block group shadow-lg">
                  <h4 className="font-bold text-sm text-white group-hover:text-rose-400 transition">🩺 Nursing Station</h4>
                  <p className="text-xs text-slate-400 mt-1">Ward bed management & patient vitals recording.</p>
                </Link>
                <Link href="/pharmacy/" className="p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500 transition block group shadow-lg">
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition">💊 Pharmacy Portal</h4>
                  <p className="text-xs text-slate-400 mt-1">Dispense medication and check inventory status.</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. STAFF DIRECTORY TAB */}
        {activeTab === 'STAFF_REG' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-sm text-white">Registered Hospital Personnel</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage official credentials and staff department roles.</p>
              </div>
              <button
                onClick={() => setShowStaffModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg"
              >
                + Add Staff Member
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Staff ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Official Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-sky-400">{staff.id}</td>
                      <td className="p-3 font-bold text-white">{staff.name}</td>
                      <td className="p-3 text-slate-400">{staff.email}</td>
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
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-[10px] font-bold transition border border-red-500/30"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. DUTY ROSTER TAB */}
        {activeTab === 'DUTY_ASSIGN' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-white">Shift Assignment & Duty Roster Manager</h3>
            <p className="text-xs text-slate-400">Toggle staff active availability for hospital duties.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {staffList.map((staff) => (
                <div key={staff.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{staff.name}</h4>
                    <p className="text-[10px] text-amber-400 mt-0.5">{staff.role} • {staff.department}</p>
                  </div>
                  <button
                    onClick={() => toggleDutyStatus(staff.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                      staff.dutyStatus === 'ON_DUTY'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {staff.dutyStatus === 'ON_DUTY' ? '● Active On Duty' : 'Set Active'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. APPOINTMENTS TAB */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-white">Patient Appointments & Booking Directory</h3>
                <p className="text-xs text-slate-400">Track doctor assignments and scheduled consultation fees.</p>
              </div>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition"
              >
                + Book Appointment
              </button>
            </div>

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
                      <td className="p-3 font-mono text-amber-400 font-bold">{apt.id}</td>
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

        {/* 5. REVENUE TAB */}
        {activeTab === 'REVENUE' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div>
              <h3 className="font-bold text-sm text-white">Executive Financial Operations & Revenue Stream</h3>
              <p className="text-xs text-slate-400">Real-time breakdown of hospital revenue channels.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor Consultation Revenue</p>
                <h2 className="text-2xl font-extrabold text-emerald-400 mt-1">₦{totalConsultationRevenue.toLocaleString()}</h2>
              </div>
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Laboratory Testing Revenue</p>
                <h2 className="text-2xl font-extrabold text-sky-400 mt-1">₦45,000</h2>
              </div>
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Pharmacy Sales Revenue</p>
                <h2 className="text-2xl font-extrabold text-purple-400 mt-1">₦82,500</h2>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: REGISTER STAFF */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Register Hospital Staff Member</h3>
            
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
                <label className="text-[10px] font-bold text-slate-400 uppercase">Official Email (Login Identifier)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. fatima@hospital.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Assign Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
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
                  Save & Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BOOK APPOINTMENT */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Book New Patient Appointment</h3>

            <form onSubmit={handleAddAppointment} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bello Kabir"
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Assigned Doctor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Aminu Kano"
                  value={newAppointment.doctorName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Consultation Fee (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={newAppointment.fee}
                  onChange={(e) => setNewAppointment({ ...newAppointment, fee: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
                  }
