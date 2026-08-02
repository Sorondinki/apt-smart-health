'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdvertiseBookingPage() {
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [targetLink, setTargetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const pricing = {
    top: { name: 'Top Banner Spotlight Promo', price: 25000 },
    bottom: { name: 'Featured Bottom Ad Carousel Card', price: 15000 },
  };

  const handlePaystackAdPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !businessName || !adTitle) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const selectedPrice = pricing[placement].price;
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_35d71341910d7e398c83ab6bac0665c790b216a9';

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      // @ts-ignore
      const handler = PaystackPop.setup({
        key: publicKey,
        email: contactEmail,
        amount: selectedPrice * 100,
        currency: 'NGN',
        ref: 'APT_AD_' + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
          custom_fields: [
            { display_name: 'Business Name', variable_name: 'business_name', value: businessName },
            { display_name: 'Placement', variable_name: 'placement', value: placement },
            { display_name: 'Ad Title', variable_name: 'ad_title', value: adTitle },
          ],
        },
        callback: function (response: any) {
          const newAdBooking = {
            id: 'AD-' + Date.now(),
            businessName,
            contactEmail,
            phone,
            placement,
            adTitle,
            adDescription,
            targetLink,
            price: selectedPrice,
            paymentRef: response.reference,
            status: 'Pending Approval',
            date: new Date().toISOString().split('T')[0],
          };

          const existingAds = JSON.parse(localStorage.getItem('apt_pending_ads') || '[]');
          localStorage.setItem('apt_pending_ads', JSON.stringify([newAdBooking, ...existingAds]));

          setLoading(false);
          alert('Payment Successful! Reference: ' + response.reference + '. Your advertisement is submitted and pending MD Admin verification.');
          window.location.href = '/';
        },
        onClose: function () {
          setLoading(false);
          alert('Ad booking payment cancelled.');
        },
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-lg">
              A
            </div>
            <span className="font-extrabold text-white text-sm">APT Healthcare Advertising Portal</span>
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full uppercase">
            Partner Growth & Ad Sponsorship
          </span>
          <h1 className="text-3xl font-black text-white">Promote Your Medical Business</h1>
          <p className="text-xs text-slate-400">Reach thousands of healthcare professionals, clinics, and patients across Northern Nigeria.</p>
        </div>

        <form onSubmit={handlePaystackAdPayment} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-400">Select Advertisement Placement Zone</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPlacement('top')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  placement === 'top' ? 'bg-cyan-950/60 border-cyan-500' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-amber-400 block mb-1">PROMO SPOTLIGHT</span>
                <h4 className="text-sm font-bold text-white">Top Banner Banner</h4>
                <p className="text-xs font-black text-cyan-400 mt-2">₦25,000 / month</p>
              </div>

              <div
                onClick={() => setPlacement('bottom')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  placement === 'bottom' ? 'bg-cyan-950/60 border-cyan-500' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-emerald-400 block mb-1">FEATURED CARD</span>
                <h4 className="text-sm font-bold text-white">Bottom Carousel Spotlight</h4>
                <p className="text-xs font-black text-cyan-400 mt-2">₦15,000 / month</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Business / Organization Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Kano Diagnostic Center"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Contact Email *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@company.com"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Target Website / WhatsApp Link</label>
              <input
                type="text"
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                placeholder="https://wa.me/2348000000000"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Advertisement Title *</label>
            <input
              type="text"
              required
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              placeholder="e.g. Get Free Blood Sugar & BP Triage on all visits!"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Advertisement Description / Body Text</label>
            <textarea
              rows={3}
              value={adDescription}
              onChange={(e) => setAdDescription(e.target.value)}
              placeholder="Provide a short description of your medical offer, discount or services..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Opening Paystack Payment...' : `Pay & Submit Advertisement (₦${pricing[placement].price.toLocaleString()})`}
          </button>
        </form>
      </div>
    </div>
  );
        }
      
