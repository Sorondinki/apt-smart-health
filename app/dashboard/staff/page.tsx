'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState([
    { id: 'STF-101', name: 'Dr. Jamilu Sadiq', role: 'Doctor', dept: 'Cardiology', email: 'jamilu@hospital.com' },
    { id: 'STF-102', name: 'Nurse Amina Bello', role: 'Nurse', dept: 'Outpatient Triage', email: 'amina@hospital.com' },
  ]);

  const [formData, setFormData] = useState({ name: '', role: 'Doctor', dept: '', email: '', password: '' });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newStaff = {
      id: `STF-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      role: formData.role,
      dept: formData.dept || 'General',
      email: formData.email,
    };

    setStaffList([...staffList, newStaff]);
    setFormData({ name: '', role: 'Doctor', dept: '', email: '', password: '' });
    alert("Sabuwar ma'aikaci an yi masa rijista lami lafiya!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Staff Recruitment & Credentialing</h1>
          <p className="text-xs text-slate-400">Register and manage Doctors, Nurses, and System Administrators</p>
        </div>
        <Link href="/dashboard/" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl">
          ← Back to Command Center
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-white">Recruit New Staff</h2>
          <form onSubmit={handleAddStaff} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Abubakar Umar"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-bold mb-1">Staff Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
              >
                <option value="Doctor">Doctor (Consultant)</option>
                <option value="Nurse">Nurse (Triage & Ward)</option>
                <option value="Lab Tech">Lab Technician</option>
                <option value="Clinic Admin">Clinic Desk Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-bold mb-1">Department</label>
              <input
                type="text"
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                placeholder="Pediatrics, Surgery, Triage..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-bold mb-1">Official Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@hospital.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition"
            >
              + Complete Staff Registration
            </button>
          </form>
        </div>

        {/* Staff Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-white">Active Medical & Admin Personnel ({staffList.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Staff ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {staffList.map((stf) => (
                  <tr key={stf.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{stf.id}</td>
                    <td className="p-3 font-bold text-white">{stf.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-slate-800 rounded-md text-[10px] font-bold border border-slate-700">
                        {stf.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{stf.dept}</td>
                    <td className="p-3 text-slate-400">{stf.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
                }
                
