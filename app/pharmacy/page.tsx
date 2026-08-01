'use client';
import React, { useState } from 'react';
import {
Pill,
Search,
Plus,
ShoppingCart,
AlertTriangle,
TrendingUp,
DollarSign,
Package,
CheckCircle2,
Clock
} from 'lucide-react';
interface Medicine {
id: string;
name: string;
category: string;
stock: number;
unitPrice: number;
expiryDate: string;
status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}
export default function PharmacyPage() {
const [activeTab, setActiveTab] = useState<'inventory' | 'pos' | 'prescriptions'>('inventory');
const [searchTerm, setSearchTerm] = useState('');
// Sample data for Demonstration
const [medicines] = useState<Medicine[]>([
{ id: 'MED-001', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 450, unitPrice: 200, expiryDate: '2026-11-20', status: 'In Stock' },
{ id: 'MED-002', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 12, unitPrice: 1200, expiryDate: '2025-08-15', status: 'Low Stock' },
{ id: 'MED-003', name: 'Ciprofloxacin 500mg', category: 'Antibiotic', stock: 0, unitPrice: 1800, expiryDate: '2025-10-01', status: 'Out of Stock' },
{ id: 'MED-004', name: 'Artemether/Lumefantrine', category: 'Antimalarial', stock: 120, unitPrice: 2500, expiryDate: '2027-01-10', status: 'In Stock' },
{ id: 'MED-005', name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', stock: 85, unitPrice: 350, expiryDate: '2026-05-30', status: 'In Stock' },
]);
const filteredMedicines = medicines.filter(m =>
m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
m.id.toLowerCase().includes(searchTerm.toLowerCase())
);
return (
<div className="p-6 bg-slate-50 min-h-screen text-slate-800">
{/* Header */}
<div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
<div>
<h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
<Pill className="text-teal-600 h-7 w-7" />
Pharmacy & Dispense Management
</h1>
<p className="text-sm text-slate-500 mt-1">Gudanar da magunguna, sayarwa, da duba takardun magani</p>
</div>
<div className="flex items-center gap-3">
<button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
<Plus className="w-4 h-4" /> Kara Magani Suba
</button>
</div>
</div>
{/* Metrics Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
<div>
<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jimillar Magunguna</p>
<h3 className="text-2xl font-bold text-slate-800 mt-1">1,240</h3>
<span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
<TrendingUp className="w-3 h-3" /> +5 sababbi
</span>
</div>
<div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
<Package className="w-6 h-6" />
</div>
</div>
<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
<div>
<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mazaunawa (Low Stock)</p>
<h3 className="text-2xl font-bold text-amber-600 mt-1">8</h3>
<span className="text-xs text-amber-600 font-medium mt-1">Yana bukatan odar gaggawa</span>
</div>
<div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
<AlertTriangle className="w-6 h-6" />
</div>
</div>
<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
<div>
<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kudin Sayarwa Yau</p>
<h3 className="text-2xl font-bold text-slate-800 mt-1">₦145,200</h3>
<span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
<TrendingUp className="w-3 h-3" /> 12% sama da jiya
</span>
</div>
<div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
<DollarSign className="w-6 h-6" />
</div>
</div>
<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
<div>
<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prescriptions Pending</p>
<h3 className="text-2xl font-bold text-blue-600 mt-1">14</h3>
<span className="text-xs text-slate-500 mt-1">Daga dakin likitoci</span>
</div>
<div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
<Clock className="w-6 h-6" />
</div>
</div>
</div>
{/* Navigation Tabs */}
<div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2">
<button
onClick={() => setActiveTab('inventory')}
className={py-3 px-5 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${ activeTab === 'inventory' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800' }}
>
<Package className="w-4 h-4" /> Magungunan da ke Akwai (Inventory)
</button>
<button
onClick={() => setActiveTab('pos')}
className={py-3 px-5 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${ activeTab === 'pos' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800' }}
>
<ShoppingCart className="w-4 h-4" /> Banta / Sayarwa (POS)
</button>
</div>
{/* Main Content Area /}
{activeTab === 'inventory' && (
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
{/ Table Search Header */}
<div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
<div className="relative flex-1 max-w-md">
<Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
<input
type="text"
placeholder="Nemi magani ta suna, rukuni ko code..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
/>
</div>
</div>
{/* Table */}
<div className="overflow-x-auto">
<table className="w-full text-left text-sm">
<thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
<tr>
<th className="py-3.5 px-4">Lambar Magani (ID)</th>
<th className="py-3.5 px-4">Sunan Magani</th>
<th className="py-3.5 px-4">Rukuni (Category)</th>
<th className="py-3.5 px-4">Adadin Stock</th>
<th className="py-3.5 px-4">Farashin Ɗaya (NGN)</th>
<th className="py-3.5 px-4">Ranar Karewa (Expiry)</th>
<th className="py-3.5 px-4">Matsayi (Status)</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 text-slate-700">
{filteredMedicines.map((med) => (
<tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
<td className="py-3 px-4 font-mono text-xs font-semibold text-slate-500">{med.id}</td>
<td className="py-3 px-4 font-medium text-slate-900">{med.name}</td>
<td className="py-3 px-4 text-slate-500">{med.category}</td>
<td className="py-3 px-4 font-semibold">{med.stock} pcs</td>
<td className="py-3 px-4">₦{med.unitPrice.toLocaleString()}</td>
<td className="py-3 px-4 text-slate-500">{med.expiryDate}</td>
<td className="py-3 px-4">
{med.status === 'In Stock' && (
<span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
<CheckCircle2 className="w-3 h-3" /> Akwai
</span>
)}
{med.status === 'Low Stock' && (
<span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
<AlertTriangle className="w-3 h-3" /> Yayi Kadan
</span>
)}
{med.status === 'Out of Stock' && (
<span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
<AlertTriangle className="w-3 h-3" /> Ya Kare
</span>
)}
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)}
{activeTab === 'pos' && (
<div className="bg-white p-8 rounded-xl border border-slate-200 text-center py-16">
<ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
<h3 className="text-lg font-bold text-slate-800">Sashen Sayar da Magani (Point of Sale)</h3>
<p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
Anan za a zabi marar lafiya ko mai siyan magani na waje, a zabi magunguna kuma a fitar da rasit din biya tare da ragewa daga ma'ajiya.
</p>
</div>
)}
</div>
);
 }
