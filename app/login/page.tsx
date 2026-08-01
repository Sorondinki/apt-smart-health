'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // States for Forgot Password Modal
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSending, setIsResetSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // 🔒 AINIHIN EMAIL ƊIN SUPER ADMIN KANḲANTA (HARDCODED FOR SECURITY)
  const SUPER_ADMIN_EMAIL = 'sorondinkiseeme@gmail.com'; // Saka ainihin email dinka a nan

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();

      // Check if user has been banned/kicked by Super Admin
      const bannedUsers = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');
      if (bannedUsers.includes(cleanEmail)) {
        alert('Access Denied: Your account has been suspended or revoked by the Super Admin.');
        return;
      }
      
      // 🔑 1. Save Auth Session
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', cleanEmail);

      // 🔑 2. Initialize Trial Date if not set
      if (!localStorage.getItem('apt_reg_date')) {
        localStorage.setItem('apt_reg_date', new Date().toISOString());
      }

      // 🔑 3. STRICT SUPER ADMIN CHECK (EXACT EMAIL MATCH ONLY)
      if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
        localStorage.setItem('userRole', 'SUPER_ADMIN');
      } else {
        localStorage.setItem('userRole', 'HOSPITAL_ADMIN');
      }

      router.push('/dashboard');
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetSending(true);

    setTimeout(() => {
      setIsResetSending(false);
      setResetSent(true);
    }, 1200);
  };

  const closeResetModal = () => {
    setIsForgotPasswordOpen(false);
    setResetSent(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-sky-600/30">
            A
          </div>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to your APT Smart-Health account
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-600 text-sm outline-none transition text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-600 text-sm outline-none transition text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-600 gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="font-bold text-sky-600 hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-sky-600 hover:underline">
              Register Hospital
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Reset Password</h3>
              <button
                onClick={closeResetModal}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {resetSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-slate-900">Check Your Email</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We have sent password reset instructions to <span className="font-semibold text-slate-800">{resetEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="w-full mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your registered email address and we'll send you a link to reset your account password.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="doctor@hospital.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-600 text-sm outline-none transition text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeResetModal}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetSending}
                    className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2"
                  >
                    {isResetSending ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
      }
