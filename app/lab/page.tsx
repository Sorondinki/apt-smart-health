'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LabModulePage() {
  const [labOrders, setLabOrders] = useState([
    { id: 'LAB-881', patient: 'Amina Ibrahim', test: 'Full Blood Count (FBC)', status: 'Completed', result: 'Hb: 12.5 g/dL (Normal)' },
    { id: 'LAB-882', patient: 'Kabiru Usman', test: 'Malaria Parasite (MP)', status: 'Pending', result: 'Awaiting Diagnostics' },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Laboratory & Diagnostics Portal</h1>
          <p className="text-xs text-slate-400">Process clinical tests, enter specimen results, and sync EHR</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl">
          ← Home
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <h2 className="text-lg font-bold text-white">Diagnostic Requests Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Requested Test</th>
                <th className="p-3">Status</th>
                <th className="p-3">Diagnostic Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {labOrders.map((order) => (
                <tr key={order.id}>
                  <td className="p-3 font-mono font-bold text-cyan-400">{order.id}</td>
                  <td className="p-3 font-bold text-white">{order.patient}</td>
                  <td className="p-3">{order.test}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{order.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
      }
