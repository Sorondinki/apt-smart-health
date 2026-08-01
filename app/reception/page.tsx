'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReceptionDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [complaint, setComplaint] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Don Allah cika sunan marar lafiya da lamba ta waya.');
      return;
    }
    const fileNo = 'APT-' + Math.floor(1000 + Math.random() * 9000);
    alert(`An buɗe sabon fayil tare da File ID: ${fileNo} ga ${fullName}! An tura shi zuwa Doctor da Finance queue.`);
    setFullName('');
    setAge('');
    setPhone('');
    setComplaint('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-600/30">
              📋
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Hospital Central Reception Desk
              </h1>
              <p className="text-[10px] text-slate-400">Patient Registration & File Number Generation</p>
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

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white">New Patient Central Registration</h2>
            <p className="text-xs text-slate-400">
              Asibiti Babba: Receptionist kawai ke da izinin buɗe sabon fayil da tura marar lafiya zuwa ga Likita.
            </p>
          </div>

          <form onSubmit={handleRegisterPatient} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Fatima Abubakar"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="08012345678"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Chief Complaint / Notes</label>
              <textarea
                rows={3}
                value={complaint}
                onChange={e => setComplaint(e.target.value)}
                placeholder="Brief reason for visit..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Register Patient & Generate File ID</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
      }
      
