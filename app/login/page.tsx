import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <a href="/" className="inline-block mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-md mx-auto">
              A
            </div>
          </a>
          <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to your APT Smart-Health account</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="doctor@hospital.com" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-600 text-sm"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-600 text-sm"
              required 
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center text-slate-600">
              <input type="checkbox" className="rounded border-slate-300 text-cyan-600 mr-2" />
              Remember me
            </label>
            <a href="#" className="text-cyan-600 hover:underline font-semibold">Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all text-sm"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Don't have an account?{' '}
          <a href="/register.html" className="text-cyan-600 font-bold hover:underline">
            Register Hospital
          </a>
        </div>
      </div>
    </div>
  );
      }
