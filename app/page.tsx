import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-between p-2 shadow-lg shadow-sky-500/20">
              <span className="text-white font-black text-xl leading-none">A</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
                APT <span className="text-sky-600">Smart-Health</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Healthcare Network
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-sky-600 transition-colors">Ayyuka</a>
            <a href="#security" className="hover:text-sky-600 transition-colors">Tsaron Data</a>
            <a href="#monetization" className="hover:text-sky-600 transition-colors">Haɗin Gwiwa</a>
            <a href="#pricing" className="hover:text-sky-600 transition-colors">Farashi</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors hidden sm:block"
            >
              Shiga Shafin
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg shadow-sky-600/25 transition-all transform active:scale-95"
            >
              Rijistar Asibiti
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (High-Impact Headline & PWA Callout) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-100/50 via-teal-50/30 to-transparent blur-3xl -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Fasaha Mai Tallata Kanta & Dynamic PWA Offline-Support
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.15]">
            Canza Tsarin Gudanar da Asibitoci Da <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">APT Smart-Health</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Hada likitoci, asibitoci, da marasa lafiya a waje ɗaya cikin tsaro mai ƙarfi da kariya ta sirrin lafiya. Yi aiki cikin sauƙi ko da **babu intanet (Offline)**.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-xl shadow-sky-600/30 transition-all text-base transform hover:-translate-y-0.5"
            >
              Fara Amfani Kyauta (30 Days Free Trial)
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-sm transition-all text-base"
            >
              Kalli Tsarin Aiki (Live Demo)
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-slate-200/80">
            <div className="p-4">
              <p className="text-3xl font-black text-slate-900">99.9%</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Tsaron Bayanai (Encryption)</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-black text-sky-600">0s</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Offline Access Speed</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-black text-slate-900">HIPAA & NDPR</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Biya Ka'idojin Tsaro</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-black text-emerald-600">24/7</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Tuntuɓar Likitoci</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION (Daukar Hankalin Asibitoci) */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Kyakkyawan Tsari</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Dukkan Abin Da Asibitinku Ke Buƙata A Waje Ɗaya
            </p>
            <p className="mt-4 text-slate-600">
              An tsara dandalin ne domin rage asarar lokaci, kare sirrin marasa lafiya, da ƙara samun kuɗaɗen shiga.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-sky-600 group-hover:text-white transition-all">
                📁
              </div>
              <h3 className="text-xl font-bold text-slate-900">Encrypted Electronic Health Records (EHR)</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Adana tarihin rashin lafiya, sakamakon gwaji, da magunguna cikin tsaro mai lamba ta musamman (AES-256 Encryption).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all">
                📱
              </div>
              <h3 className="text-xl font-bold text-slate-900">PWA Offline Capabilities</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Saka dandalin a wayarku kamar Mobile App. Yi amfani da duba alƙawura ko da babu haɗin intanet.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                🎥
              </div>
              <h3 className="text-xl font-bold text-slate-900">Telemedicine & Video Calls</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Damar duba marasa lafiya ta hanyar kiran bidiyo ko tes mai sauri ba tare da sun zo asibiti a nitse ba.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                💊
              </div>
              <h3 className="text-xl font-bold text-slate-900">Digital Prescriptions & Pharmacy Integration</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Aika takardar magani kai tsaye zuwa фармаci (Pharmacy) mafi kusa domin sauƙaƙa wa mara lafiya samun magani.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                💳
              </div>
              <h3 className="text-xl font-bold text-slate-900">Automated Billing & Revenue Collection</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Karɓi kuɗin alƙawari da dubawa ta Paystack ko Flutterwave direct zuwa asusun asibitinku cikin sauƙi.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                🔔
              </div>
              <h3 className="text-xl font-bold text-slate-900">Smart Push Notifications</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Tura saƙonnin tunatarwa ta atomatik kan wayar mara lafiya kafin lokacin alƙawari ko lokacin shan magani.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING / MONETIZATION SECTION */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Tsarin Farashi</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Zaɓi Tsarin Da Ya Dace Da Asibitinku
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Individual Doctor</h3>
                <p className="text-slate-500 text-xs mt-1">Don likitoci masu zaman kansu</p>
                <div className="mt-6">
                  <span className="text-4xl font-black text-slate-900 font-sans">₦15,000</span>
                  <span className="text-slate-500 text-sm"> / wata</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">✓ Duba marasa lafiya 100/wata</li>
                  <li className="flex items-center gap-2">✓ Digital Prescriptions</li>
                  <li className="flex items-center gap-2">✓ PWA Mobile Installation</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition">
                Fara Amfani
              </button>
            </div>

            {/* Pro Hospital Plan (Featured) */}
            <div className="bg-gradient-to-b from-sky-900 to-slate-900 text-white p-8 rounded-3xl shadow-2xl relative flex flex-col justify-between transform lg:-translate-y-4 border-2 border-sky-400">
              <span className="absolute -top-3.5 right-6 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                Mafi Sharafi
              </span>
              <div>
                <h3 className="text-xl font-bold">Standard Hospital</h3>
                <p className="text-sky-200 text-xs mt-1">Don asibitoci masu matsakaicin girma</p>
                <div className="mt-6">
                  <span className="text-4xl font-black font-sans">₦50,000</span>
                  <span className="text-sky-200 text-sm"> / wata</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-sky-100">
                  <li className="flex items-center gap-2">✓ EHR marasa adadi (Unlimited Patients)</li>
                  <li className="flex items-center gap-2">✓ Malaman asibiti & Likitoci har 15</li>
                  <li className="flex items-center gap-2">✓ Telemedicine / Video Consultations</li>
                  <li className="flex items-center gap-2">✓ Paystack Integration & Billing</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl transition shadow-lg shadow-sky-500/30">
                Yi Rijistar Asibiti
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Custom Network</h3>
                <p className="text-slate-500 text-xs mt-1">Babban rukunin asibitoci (Hospital Chains)</p>
                <div className="mt-6">
                  <span className="text-3xl font-black text-slate-900">Tuntuɓemu</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">✓ Dedicated Private Database Server</li>
                  <li className="flex items-center gap-2">✓ Dynamic Integration da Lab Equipment</li>
                  <li className="flex items-center gap-2">✓ 24/7 Dedicated Support Engineer</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition">
                Yi Magana Da Mu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white">A</div>
            <span className="text-white font-bold text-lg">APT Smart-Health</span>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} APT Smart-Health Network. Duk haƙƙoƙi akiyaye.
          </p>
        </div>
      </footer>
    </div>
  );
          }
        
