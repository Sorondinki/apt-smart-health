'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'consultant' | 'basic' | 'pro' | 'enterprise'>('pro');
  const [email, setEmail] = useState('');
  const [facilityName, setFacilityName] = useState('');

  // Payment Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState<'paystack' | 'bank'>('paystack');
  const [transferProof, setTransferProof] = useState<File | null>(null);
  const [transferSubmitted, setTransferSubmitted] = useState(false);

  const plans = {
    consultant: {
      name: 'Tier 1: Private Consultant',
      price: 15000,
      period: '/month',
      desc: 'Designed for independent doctors offering direct online consultations.',
      features: [
        'Single Doctor Login',
        'Direct Telemedicine Video Calls',
        'E-Prescriptions Generation',
        'Digital Patient Notes & File Access',
      ],
    },
    basic: {
      name: 'Tier 2: Clinic Basic',
      price: 25000,
      period: '/month',
      desc: 'Ideal for small outpatient clinics & individual practices.',
      features: [
        'Up to 5 Staff Accounts',
        'Standalone Reception Desk',
        'Basic EHR Patient Records',
        'Standard Email Support',
      ],
    },
    pro: {
      name: 'Tier 3: Hospital Pro',
      price: 45000,
      period: '/month',
      desc: 'Complete HMS for growing hospitals and specialist centers.',
      features: [
        'Unlimited Staff Accounts',
        'HD Telemedicine Video Consults',
        'Full EHR & Inpatient Beds',
        'E-Prescription & Pharmacy Link',
        '24/7 Priority Support',
      ],
    },
    enterprise: {
      name: 'Enterprise Network',
      price: 120000,
      period: '/month',
      desc: 'For multi-branch hospital chains & regional networks.',
      features: [
        'Multi-Facility Operations',
        'Custom API Integrations',
        'Dedicated Account Manager',
        'Custom Telemetry Analytics',
        '99.9% Uptime SLA Guarantee',
      ],
    },
  };

  // Trigger Modal
  const openPaymentModal = (planKey: 'consultant' | 'basic' | 'pro' | 'enterprise') => {
    if (!email.trim()) {
      alert('Kada ka manta! Shigar da adireshin Email ɗinka na Biyan Kuɗi.');
      return;
    }
    setSelectedPlan(planKey);
    setPaymentTab('paystack'); // Paystack as default tab
    setTransferSubmitted(false);
    setIsModalOpen(true);
  };

  // Paystack Integration
  const handlePaystackPayment = () => {
    const planKey = selectedPlan;
    setLoadingPlan(planKey);

    const plan = plans[planKey];
    const publicKey =
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
      'pk_live_35d71341910d7e398c83ab6bac0665c790b216a9';

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      // @ts-ignore
      const handler = PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: plan.price * 100,
        currency: 'NGN',
        ref: 'APT_HEALTH_' + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
          custom_fields: [
            {
              display_name: 'Plan Name',
              variable_name: 'plan_name',
              value: plan.name,
            },
            {
              display_name: 'Facility Name',
              variable_name: 'facility_name',
              value: facilityName || 'N/A',
            },
          ],
        },
        callback: async function (response: any) {
          setLoadingPlan(null);
          setIsModalOpen(false);
          alert('Biyan kuɗi ya kammala tsaf! Ref: ' + response.reference);
          localStorage.setItem('subscription_active', 'active');
          window.location.href = '/dashboard/';
        },
        onClose: function () {
          setLoadingPlan(null);
          alert('An soke biyan kuɗin.');
        },
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  };

  // Handle Manual Bank Transfer & Save Notification for Super Admin
  const handleBankTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferSubmitted(true);

    const currentPlan = plans[selectedPlan];
    
    // Structure transfer notification payload
    const newNotification = {
      id: 'TR-' + Date.now(),
      facilityName: facilityName.trim() || 'Unnamed Facility',
      email: email.trim().toLowerCase(),
      amount: currentPlan.price,
      plan: currentPlan.name,
      proofFileName: transferProof ? transferProof.name : 'No Proof Uploaded',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    // Save to LocalStorage for Super Admin synchronization
    const existingNotifications = JSON.parse(
      localStorage.getItem('apt_payment_notifications') || '[]'
    );
    const updatedNotifications = [newNotification, ...existingNotifications];
    localStorage.setItem('apt_payment_notifications', JSON.stringify(updatedNotifications));

    setTimeout(() => {
      alert(
        '📩 Sanarwar biyan kuɗi ta Bank Transfer ta tafi da nasara!\n\nSuper Admin zai duba kuma ya kunna muku asusu nan bada dadewa ba.'
      );
      setIsModalOpen(false);
      setTransferSubmitted(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center font-black text-white text-xl">
              A
            </div>
            <span className="font-black text-lg text-white">
              APT <span className="text-cyan-400">Subscription</span>
            </span>
          </Link>

          <Link
            href="/dashboard/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition text-slate-200"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full uppercase">
            Facility Subscription & Pricing
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Choose Your Healthcare Plan
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Activate HMS, Outpatient Triage, Telemedicine Video Consults, and EHR with Instant Paystack or Direct Bank Transfer.
          </p>
        </div>

        {/* User / Facility Info Card */}
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-2">
            1. Enter Account Credentials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Facility / Doctor Name
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="e.g. Ruhul Iman Clinic"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Billing Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="billing@yourhospital.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
            const plan = plans[key];
            const isSelected = selectedPlan === key;
            const isThisPlanLoading = loadingPlan === key;

            return (
              <div
                key={key}
                className={`relative rounded-3xl p-6 border transition flex flex-col justify-between space-y-6 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {key === 'pro' && (
                  <span className="absolute -top-3 right-6 px-3 py-1 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full uppercase">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{plan.desc}</p>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">
                      ₦{plan.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500">{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-800">
                    {plan.features.map((feat, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-cyan-400 font-bold">✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openPaymentModal(key)}
                  disabled={loadingPlan !== null}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition shadow-lg ${
                    isSelected
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  } disabled:opacity-50`}
                >
                  {isThisPlanLoading ? 'Processing...' : `Pay Now (₦${plan.price.toLocaleString()})`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* POP-UP PAYMENT SELECTION MODAL                           */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-sm"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                Payment Gateway
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                Checkout: {plans[selectedPlan].name}
              </h3>
              <p className="text-xs text-slate-400">
                Amount Due:{' '}
                <strong className="text-cyan-400 text-sm">
                  ₦{plans[selectedPlan].price.toLocaleString()}
                </strong>{' '}
                ({email})
              </p>
            </div>

            {/* TAB BUTTONS */}
            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-2">
              <button
                type="button"
                onClick={() => setPaymentTab('paystack')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  paymentTab === 'paystack'
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ Paystack Online</span>
                <span className="text-[9px] bg-cyan-900/80 px-1.5 py-0.5 rounded text-cyan-200">
                  Default
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('bank')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  paymentTab === 'bank'
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🏦 Bank Transfer</span>
              </button>
            </div>

            {/* TAB CONTENT 1: PAYSTACK ONLINE */}
            {paymentTab === 'paystack' && (
              <div className="space-y-4 pt-2">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 space-y-2">
                  <p>✓ Instant account activation immediately after payment.</p>
                  <p>✓ Supports Debit Cards, USSD, and Paystack Transfer.</p>
                </div>
                <button
                  onClick={handlePaystackPayment}
                  className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-2xl shadow-xl transition"
                >
                  Proceed to Paystack Gateway (₦{plans[selectedPlan].price.toLocaleString()}) →
                </button>
              </div>
            )}

            {/* TAB CONTENT 2: DIRECT BANK TRANSFER */}
            {paymentTab === 'bank' && (
              <div className="space-y-4 pt-1">
                <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-2xl text-xs space-y-2">
                  <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                    🏦 Bank Transfer Account Details:
                  </h4>
                  <div className="space-y-1 font-mono text-slate-200">
                    <p>
                      <span className="text-slate-400 font-sans">Bank Name:</span>{' '}
                      <strong>Stanbic IBTC Bank</strong>
                    </p>
                    <p>
                      <span className="text-slate-400 font-sans">Account Name:</span>{' '}
                      <strong>Jamilu Sadiq Abubakar</strong>
                    </p>
                    <p>
                      <span className="text-slate-400 font-sans">Account No:</span>{' '}
                      <strong className="text-emerald-400 text-sm">0046687268</strong>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBankTransferSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Upload Payment Receipt / Proof (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setTransferProof(e.target.files ? e.target.files[0] : null)}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer bg-slate-950 rounded-xl border border-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={transferSubmitted}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-xl transition disabled:opacity-50"
                  >
                    {transferSubmitted ? 'Submitting Request...' : '📩 Notify Super Admin Office'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
    }
          
