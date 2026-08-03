'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PrescriptionItem {
  id: string;
  patientName: string;
  patientId: string;
  prescriberName: string;
  prescriberRole: 'Doctor' | 'Nurse';
  prescribedDrug: string;
  dosage: string;
  unitPrice: number;
  status: 'Pending Dispatch' | 'Billed' | 'Dispatched';
}

interface DrugInventory {
  id: string;
  name: string;
  stock: number;
  category: string;
  price: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

interface CartItem {
  drug: DrugInventory;
  quantity: number;
}

export default function PharmacyDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // INCOMING REAL-LIVE PRESCRIPTIONS FROM DOCTOR/NURSE
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'RX-901',
      patientName: 'Amina Ibrahim',
      patientId: 'APT-8902',
      prescriberName: 'Dr. Jamilu Sadiq',
      prescriberRole: 'Doctor',
      prescribedDrug: 'Paracetamol 500mg',
      dosage: '2 tabs x 3 daily (5 Days)',
      unitPrice: 1500,
      status: 'Pending Dispatch',
    },
    {
      id: 'RX-902',
      patientName: 'Usman Bello',
      patientId: 'APT-7710',
      prescriberName: 'Nurse Maryam Lawal',
      prescriberRole: 'Nurse',
      prescribedDrug: 'Amoxicillin 250mg',
      dosage: '1 cap x 2 daily (7 Days)',
      unitPrice: 3200,
      status: 'Pending Dispatch',
    },
  ]);

  // DRUG INVENTORY LIST (READ ONLY FOR TECHNICIAN)
  const [inventory] = useState<DrugInventory[]>([
    { id: 'DRG-01', name: 'Paracetamol 500mg', stock: 450, category: 'Analgesics', price: 1500, status: 'AVAILABLE' },
    { id: 'DRG-02', name: 'Amoxicillin 250mg', stock: 120, category: 'Antibiotics', price: 3200, status: 'AVAILABLE' },
    { id: 'DRG-03', name: 'Ciprofloxacin 500mg', stock: 0, category: 'Antibiotics', price: 4500, status: 'OUT_OF_STOCK' },
    { id: 'DRG-04', name: 'Ibuprofen 400mg', stock: 300, category: 'NSAIDs', price: 1800, status: 'AVAILABLE' },
  ]);

  // ACTIVE SELECTION CART FOR BILLING
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionItem | null>(null);

  // STOCK ADJUSTMENT REQUEST MODAL FOR MD
  const [stockRequestItem, setStockRequestItem] = useState<DrugInventory | null>(null);
  const [requestedStockQty, setRequestedStockQty] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // 🔐 AUTHENTICATION GUARD
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login/';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // ADD DRUG TO BILLING SELECTION
  const handleAddToCart = (drug: DrugInventory) => {
    if (drug.status === 'OUT_OF_STOCK' || drug.stock === 0) {
      alert(`⚠️ ${drug.name} is currently OUT OF STOCK! Please request MD inventory update.`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.drug.id === drug.id);
      if (existing) {
        return prev.map(item =>
          item.drug.id === drug.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { drug, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (drugId: string) => {
    setCart(prev => prev.filter(item => item.drug.id !== drugId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.drug.price * item.quantity, 0);
  };

  // DISPATCH BILL TO FINANCE & NOTIFY PRESCRIBER (DOCTOR/NURSE)
  const handleDispatchBillAndNotify = () => {
    if (!selectedPrescription) {
      alert('Please select an active incoming prescription first!');
      return;
    }
    if (cart.length === 0) {
      alert('Please select at least one drug from the inventory catalog!');
      return;
    }

    const totalAmount = calculateTotal();
    const drugSummary = cart.map(c => `${c.drug.name} (x${c.quantity})`).join(', ');

    // 1. Send Bill to Finance Account
    alert(
      `💸 FINANCE DISPATCH SUCCESSFUL!\n\n` +
      `Bill Total: ₦${totalAmount.toLocaleString()}\n` +
      `Patient: ${selectedPrescription.patientName} (${selectedPrescription.patientId})\n` +
      `Sent directly to Finance Accounts Section.`
    );

    // 2. Notify Prescriber (Doctor / Nurse)
    alert(
      `📩 PRESCRIBER NOTIFICATION SENT!\n\n` +
      `Sent to: ${selectedPrescription.prescriberRole} ${selectedPrescription.prescriberName}\n` +
      `Status: Dispensed ${drugSummary} from Pharmacy Store.`
    );

    // Clear processed item
    setPrescriptions(prev => prev.filter(p => p.id !== selectedPrescription.id));
    setSelectedPrescription(null);
    setCart([]);
  };

  // SUBMIT STOCK UPDATE REQUEST TO MD OFFICE
  const handleSubmitMdStockRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockRequestItem) return;

    alert(
      `🏛️ MD OFFICE STOCK ALERT SUBMITTED!\n\n` +
      `Item: ${stockRequestItem.name}\n` +
      `Proposed Stock/Status Update: ${requestedStockQty}\n` +
      `Reason: ${adjustmentReason}\n\n` +
      `Request has been sent to the Hospital MD/Head Office for approval and stock verification.`
    );

    setStockRequestItem(null);
    setRequestedStockQty('');
    setAdjustmentReason('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs font-bold">
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col pb-12">
      
      {/* Header Bar */}
      <header className="border-b border-emerald-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-lg shadow-emerald-600/30">
              💊
            </div>
            <div>
              <h1 className="font-extrabold text-xs sm:text-base text-white tracking-tight flex items-center gap-1.5">
                APT Pharmacy Technician Portal
                <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  DISPENSARY
                </span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Inventory & Live E-Prescription Fulfillment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/"
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              ← Hospital Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Incoming Prescriptions</p>
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">{prescriptions.length} Orders</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Available Catalog</p>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{inventory.length} Products</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Selected Bill Items</p>
            <h2 className="text-xl sm:text-2xl font-black text-sky-400 mt-0.5">{cart.length} Items</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Stock Adjustments</p>
            <h2 className="text-xl sm:text-2xl font-black text-purple-400 mt-0.5">MD Approval Req.</h2>
          </div>
        </div>

        {/* Workspace Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left Column: Live Prescriptions & Selected Dispense Cart */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Real Live Prescriptions from Doctor/Nurse */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📩 Incoming Prescriptions</span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    Live Stream
                  </span>
                </h3>
              </div>

              {prescriptions.length === 0 ? (
                <div className="p-6 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500">
                  No active incoming doctor/nurse prescriptions.
                </div>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map(rx => (
                    <div
                      key={rx.id}
                      onClick={() => setSelectedPrescription(rx)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2 ${
                        selectedPrescription?.id === rx.id
                          ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              {rx.id}
                            </span>
                            <span className="text-[9px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                              From {rx.prescriberRole}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-white mt-1">
                            {rx.patientName} <span className="text-slate-400 font-normal">({rx.patientId})</span>
                          </h4>
                          <p className="text-[10px] text-slate-400">Prescribed by {rx.prescriberName}</p>
                        </div>

                        <span className="text-xs font-bold text-emerald-400">
                          ₦{rx.unitPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-0.5">
                        <p className="text-slate-200 font-bold">💊 {rx.prescribedDrug}</p>
                        <p className="text-slate-400 text-[10px]">Dosage: {rx.dosage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Drug Billing Cart */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span>🛒 Selected Billing Cart</span>
                <span className="text-[10px] text-slate-400">Total: ₦{calculateTotal().toLocaleString()}</span>
              </h3>

              {cart.length === 0 ? (
                <div className="p-6 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500">
                  Select drugs from the catalog on the right to build the prescription invoice.
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.drug.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-white">{item.drug.name}</p>
                        <p className="text-[10px] text-slate-400">
                          ₦{item.drug.price.toLocaleString()} x {item.quantity} = ₦{(item.drug.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.drug.id)}
                        className="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-[10px] font-bold rounded-lg border border-red-500/30 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons: Send to Finance & Notify Doctor/Nurse */}
              <div className="pt-2">
                <button
                  onClick={handleDispatchBillAndNotify}
                  disabled={cart.length === 0 || !selectedPrescription}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>💸 Send Bill to Finance & Notify Prescriber</span>
                  <span>→</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Pharmacy Drug Stock Catalog (Read-Only + MD Update Request) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                💊 Pharmacy Inventory Catalog
              </h3>
              <p className="text-[10px] text-slate-400">
                Click items to add to billing. Technicians cannot edit stock directly; submit adjustment requests to MD.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search medication name or category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 transition"
            />

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {inventory
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(item => (
                  <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.category} • ₦{item.price.toLocaleString()}</p>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        item.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.status === 'AVAILABLE' ? `Stock: ${item.stock}` : 'OUT OF STOCK'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold text-[10px] rounded-xl border border-emerald-500/30 transition"
                      >
                        + Select Drug
                      </button>

                      <button
                        onClick={() => setStockRequestItem(item)}
                        className="py-1.5 px-2.5 bg-purple-600/20 hover:bg-purple-600 hover:text-white text-purple-300 font-bold text-[10px] rounded-xl border border-purple-500/30 transition"
                      >
                        🏛️ MD Stock Alert
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </main>

      {/* MD STOCK ADJUSTMENT REQUEST MODAL */}
      {stockRequestItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm sm:text-base text-white">
              Request Stock Update to MD Office — <span className="text-purple-400">{stockRequestItem.name}</span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Technicians are restricted from directly editing inventory. Submit stock replenishment or out-of-stock status report directly to Hospital MD.
            </p>

            <form onSubmit={handleSubmitMdStockRequest} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Current Stock Level</label>
                <input
                  type="text"
                  disabled
                  value={`${stockRequestItem.stock} Units (${stockRequestItem.status})`}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Proposed Stock Quantity / Status</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 200 Units or OUT OF STOCK"
                  value={requestedStockQty}
                  onChange={(e) => setRequestedStockQty(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Reason for MD Notification</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide details on stock depletion, damaged stock, or emergency restock needed..."
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStockRequestItem(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  Submit Report to MD Office
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
