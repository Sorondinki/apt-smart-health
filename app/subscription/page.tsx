'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'consultant' | 'basic' | 'pro' | 'enterprise'>('pro');
  const [email, setEmail] = useState('');

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

  const handlePaystackPayment = (planKey: 'consultant' | 'basic' | 'pro' | 'enterprise') => {
    if (!email) {
      alert('Kada ka manta! Shigar da adireshin Email dinka na Biyan Kudi.');
      return;
    }

    setLoading(true);

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
          ],
        },
        callback: async function (response: any) {
          try {
            const res = await fetch('/api/paystack/verify/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference: response.reference }),
            });
            const result = await res.json();

            setLoading(false);
            if (result.success) {
              alert('Biyan kudi ya kammala tsaf! Ref: ' + response.reference);
              localStorage.setItem('subscription_active', 'active');
              window.location.href = '/dashboard/';
            } else {
              alert('An samu matsala wajen tabbatar da biyan kudin.');
            }
          } catch (e) {
            setLoading(false);
            alert('Biyan kudi ya wuce amman ana bukatar Tabbatarwa.');
          }
        },
        onClose: function () {
          setLoading(false);
          alert('An soke biyan kudin.');
        },
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
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

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full uppercase">
            Facility Subscription & Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Choose Your Healthcare Plan
          </h1>
          <p className="text-slate-400 text-sm">
            Activate HMS, Outpatient Triage, Telemedicine Video Consults, and EHR with Paystack instant settlement.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Facility Billing Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. billing@yourhospital.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
            const plan = plans[key];
            const isSelected = selectedPlan === key;

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

                  <ul className="space-y-2.5 pt-4 border-t border-slate-800/80">
                    {plan.features.map((feat, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-cyan-400 font-bold">✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan(key);
                    handlePaystackPayment(key);
                  }}
                  disabled={loading}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition shadow-lg ${
                    isSelected
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {loading ? 'Processing Paystack...' : `Pay Now (₦${plan.price.toLocaleString()})`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>🔒 Secured 256-Bit SSL Paystack Payment Gateway</span>
        </div>
      </div>
    </div>
  );
              }
