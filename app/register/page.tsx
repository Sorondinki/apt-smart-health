'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type AccountType = 'hospital' | 'clinic' | 'doctor';

interface FormData {
  accountType: AccountType;
  // Step 1: Basic Information
  fullName: string;
  email: string;
  phone: string;
  password: string;
  // Step 2: Professional / Facility Details
  facilityName: string;
  medicalLicenseNumber: string;
  specialization: string;
  address: string;
  state: string;
  // Step 3: Subscription & Confirmation
  selectedPlan: 'starter' | 'pro' | 'enterprise';
  agreeToTerms: boolean;
}

export default function RegisterPage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    accountType: 'hospital',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    facilityName: '',
    medicalLicenseNumber: '',
    specialization: 'General Medicine',
    address: '',
    state: 'Kano',
    selectedPlan: 'pro',
    agreeToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy before proceeding.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('APT Smart-Health Registration Data:', formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Registration completed successfully! Welcome to APT Smart-Health Network.');
      window.location.href = '/login.html';
    } catch (error) {
      console.error('Registration Error:', error);
      alert('An error occurred during registration. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-sky-600/30">
            A
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            APT <span className="text-sky-600">Smart-Health</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
          Create Facility or Practitioner Account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Join the nation's premier secure offline-enabled healthcare management ecosystem.
        </p>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200/80">
          
          {/* Progress Bar Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span className={step >= 1 ? 'text-sky-600' : ''}>1. Account Setup</span>
              <span className={step >= 2 ? 'text-sky-600' : ''}>2. Practice & License</span>
              <span className={step >= 3 ? 'text-sky-600' : ''}>3. Plan & Confirmation</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Account Type Selector Toggle */}
          {step === 1 && (
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Account Practice Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: 'hospital' })}
                  className={`p-3.5 rounded-2xl border-2 text-left font-bold transition-all flex flex-col gap-1 ${
                    formData.accountType === 'hospital'
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-xl">🏥</span>
                  <span className="text-xs sm:text-sm">Hospital</span>
                  <span className="text-[10px] font-normal text-slate-500 hidden sm:block">
                    Full multi-department operations.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: 'clinic' })}
                  className={`p-3.5 rounded-2xl border-2 text-left font-bold transition-all flex flex-col gap-1 ${
                    formData.accountType === 'clinic'
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-xl">🏢</span>
                  <span className="text-xs sm:text-sm">Clinic / Centre</span>
                  <span className="text-[10px] font-normal text-slate-500 hidden sm:block">
                    Outpatient & specialist centres.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: 'doctor' })}
                  className={`p-3.5 rounded-2xl border-2 text-left font-bold transition-all flex flex-col gap-1 ${
                    formData.accountType === 'doctor'
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-xl">👨‍⚕️</span>
                  <span className="text-xs sm:text-sm">Private Doctor</span>
                  <span className="text-[10px] font-normal text-slate-500 hidden sm:block">
                    Independent telemedicine & consults.
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Full Name & Title</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Dr. Jamilu Abubakar Sadiq"
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Official Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@hospital.com"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Phone Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 800 000 0000"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Account Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition"
              >
                Continue to Step 2 →
              </button>
            </form>
          )}

          {/* STEP 2: Professional & License Details */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  {formData.accountType === 'hospital'
                    ? 'Hospital Official Name'
                    : formData.accountType === 'clinic'
                    ? 'Clinic / Health Centre Name'
                    : 'Private Practice Name'}
                </label>
                <input
                  type="text"
                  name="facilityName"
                  required
                  value={formData.facilityName}
                  onChange={handleInputChange}
                  placeholder={
                    formData.accountType === 'hospital'
                      ? 'Kano Specialist Hospital'
                      : formData.accountType === 'clinic'
                      ? 'HealthCare Clinic'
                      : 'Dr. Sadiq Medical Consult'
                  }
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Medical License Number (MDCN)</label>
                  <input
                    type="text"
                    name="medicalLicenseNumber"
                    required
                    value={formData.medicalLicenseNumber}
                    onChange={handleInputChange}
                    placeholder="MDCN/R/12345"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Primary Specialization</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition bg-white"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Gynecology">Gynecology & Obstetrics</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Surgery">General Surgery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">State / Region</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Kano"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Facility / Office Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="No. 12 Zoo Road, Kano"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  ← Go Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition"
                >
                  Continue to Step 3 →
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Subscription & Final Confirmation */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Select Preferred Subscription Plan
                </label>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${formData.selectedPlan === 'starter' ? 'border-sky-600 bg-sky-50' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="selectedPlan"
                        value="starter"
                        checked={formData.selectedPlan === 'starter'}
                        onChange={handleInputChange}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Starter Plan</p>
                        <p className="text-xs text-slate-500">For small clinics or individual private practitioners</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">₦15,000/mo</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${formData.selectedPlan === 'pro' ? 'border-sky-600 bg-sky-50' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="selectedPlan"
                        value="pro"
                        checked={formData.selectedPlan === 'pro'}
                        onChange={handleInputChange}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Standard Pro Facility</p>
                        <p className="text-xs text-slate-500">For full healthcare facilities with multi-staff & EHR</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">₦50,000/mo</span>
                  </label>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="text-xs text-slate-600 leading-relaxed">
                  I have read and agree to the <span className="font-bold text-sky-600 underline">Terms of Service (HIPAA / NDPR Compliant Privacy Policy)</span> of APT Smart-Health.
                </label>
              </div>

              <div className="flex items-center justify-between gap-4 mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  ← Go Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-black rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Complete Registration (Start 30-Day Free Trial)'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
    }
            
