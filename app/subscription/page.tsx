'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise'>('pro');
  const [email, setEmail] = useState('');

  const plans = {
    basic: {
      name: 'Clinic Basic',
      price: 15000,
      period: '/month',
      desc: 'Ideal for small outpatient clinics & individual practices.',
      features: ['Up to 5 Staff Accounts', 'Outpatient Triage Desk', 'Basic EHR Records', 'Standard Email Support'],
    },
    pro: {
      name: 'Hospital Pro',
      price: 45000,
      period: '/month',
      desc: 'Complete HMS for growing hospitals and specialist centers.',
      features: ['Unlimited Staff Accounts', 'HD Telemedicine Video Consults', 'Full EHR & Inpatient Beds', 'E-Prescription & Pharmacy Link', '24/7 Priority Support'],
    },
    enterprise: {
      name: 'Enterprise Network',
      price: 120000,
      period: '/month',
      desc: 'For multi-branch hospital chains & regional networks.',
      features: ['Multi-Facility Operations', 'Custom API Integrations', 'Dedicated Account Manager', 'Custom Telemetry Analytics', '99.9% Uptime SLA Guarantee'],
    },
  };

  const handlePaystackPayment = (planKey: 'basic' | 'pro' | 'enterprise') => {
    if (!email) {
      alert('Tabbatar ka shigar da adireshin Email dinka!');
      return;
    }

    setLoading(true);

    const plan = plans[planKey];
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_35d71341910d7e398c83ab6bac0665c790b216a9';

    // Loading Paystack Inline SDK Dynamically
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      // @ts-ignore
      const handler = PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: plan.price * 100, // Paystack operates in kobo (Multiply NGN by 100)
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
        callback: function (response: any) {
          setLoading(false);
          alert('Biyan kudi ya kammala lami lafiya! Reference ID: ' + response.reference);
          // Nan za ka iya tura mutum zuwa dashboard ɗinsa
          window.location.href = '/dashboard/';
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
      {/* Header */}
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full uppercase">
            Flexible Health Facility Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Choose the Right Plan for Your Healthcare Facility
          </h1>
          <p className="text-slate-400 text-sm">
            Unlock seamless hospital management, telemedicine, and outpatient services with instant Paystack activation.
          </p>
        </div>

        {/* Email Form for Billing */}
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Billing Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. admin@yourhospital.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
            const plan = plans[key];
            const isSelected = selectedPlan === key;

            return (
              <div
                key={key}
                className={`relative rounded-3xl p-8 border transition flex flex-col justify-between space-y-6 ${
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
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{plan.desc}</p>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₦{plan.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-slate-800/80">
                    {plan.features.map((feat, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-cyan-400 font-bold">✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedRoleAndPay(key);
                  }}
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-xs transition shadow-lg ${
                    isSelected
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {loading ? 'Processing Paystack...' : `Subscribe with Paystack (₦${plan.price.toLocaleString()})`}
                </button>
              </div>
            );

            function setSelectedRoleAndPay(k: 'basic' | 'pro' | 'enterprise') {
              setSelectedPlan(k);
              handlePaystackPayment(k);
            }
          })}
        </div>

        {/* Security Footer Note */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>🔒 Secured by Paystack 256-Bit SSL Encryption</span>
        </div>
      </div>
    </div>
  );
        }
        
