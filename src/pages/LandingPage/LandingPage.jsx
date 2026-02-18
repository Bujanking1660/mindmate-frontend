import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, ShieldCheck, TrendingUp, Activity } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      {/* 1. Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">
          MindMate
        </div>
        <div className="hidden md:flex gap-8 text-slate-500 font-medium">
          <a href="#features" className="hover:text-slate-800 transition-colors">Fitur</a>
          <a href="#why-mindmate" className="hover:text-slate-800 transition-colors">Mengapa MindMate?</a>
        </div>
        <Link 
          to="/login" 
          className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
        >
          Mulai Jurnal
        </Link>
      </nav>

      {/* 2. Hero Section (The Hook) */}
      <header className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-[#E0F2FE] rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-slate-200 rounded-full blur-3xl opacity-30 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-slate-900 tracking-tight">
              Pahami Pola Emosimu, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
                Kendalikan Stresmu.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Berhenti menebak-nebak apa yang membuatmu cemas. MindMate mengubah perasaan abstrakmu menjadi data konkret untuk kesehatan mental yang lebih stabil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Link 
                to="/login" 
                className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all transform hover:scale-105 shadow-lg shadow-sky-100 flex items-center gap-2 group"
              >
                Mulai Jurnal Pertamamu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Mascot Image */}
          <div className="flex-1 flex justify-center lg:justify-end relative">
            <img 
              draggable="false"
              src="/chick-wave.png" 
              alt="Mascot waving hello" 
              className="w-64 md:w-80 lg:w-[1000px] object-contain animate-[bounce_3s_infinite]"
            />
          </div>
        </div>
      </header>

      {/* 3. The Reality Section (Fact & Problem) */}
      <section id="why-mindmate" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row-reverse items-center gap-12">
          
          {/* Right: Text Block (Visual order right on desktop) */}
          <div className="flex-1 text-center lg:text-left">
             <div className="inline-block px-4 py-1 bg-red-50 text-red-500 rounded-full text-sm font-semibold mb-6">
              Fact & Problem
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
              Mengingat Perasaan Secara Akurat Itu Sulit.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              60% Gen Z mengalami fluktuasi mood dan kecemasan tingkat tinggi. Namun, mengandalkan ingatan saja sering kali membuat kita mengalami <strong className="text-slate-800">"Kebutaan Pemicu" (Trigger Blindness)</strong>. Kamu tahu kamu stres, tapi kamu tidak tahu pasti apa penyebab utamanya. Jurnal kertas biasa tidak bisa memberimu jawaban.
            </p>
          </div>

          {/* Left: Mascot Image */}
          <div className="flex-1 flex justify-center lg:justify-start">
             <img 
              draggable="false"
              src="/chick-think.png" 
              alt="Mascot thinking about triggers" 
              className="w-56 md:w-72 lg:w-[1000px] object-contain"
            />
          </div>

        </div>
      </section>

      {/* 4. Features Section (The Solution) */}
      <section id="features" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 relative">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Fitur Unggulan</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-sky-500">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Catat dalam Hitungan Detik</h3>
              <p className="text-slate-500 leading-relaxed">
                Ganti narasi panjang yang melelahkan dengan skala skor mood 1-5 dan Feeling Tags yang spesifik. Cepat, tepat, dan real-time.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-500">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Analisis Stabilitas Emosi</h3>
              <p className="text-slate-500 leading-relaxed">
                Biarkan sistem menghitung tingkat fluktuasi emosimu setiap minggu. Ketahui seberapa stabil kesehatan mentalmu tanpa perlu analisis manual.
              </p>
            </div>

            {/* Card 3 with Mascot */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 relative overflow-visible">
               <div className="absolute -top-16 right-4 z-10">
                  <img 
                      draggable="false"
                    src="/chick-detective.png" 
                    alt="Detective Mascot" 
                    className="w-32 md:w-40 object-contain"
                  />
               </div>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 pt-2">Temukan Pemicu Stresmu</h3>
              <p className="text-slate-500 leading-relaxed">
                Otomatis temukan korelasi antara aktivitas harianmu dengan emosi negatif. Ketahui apa yang harus dihindari sebelum stres memburuk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Impact & Gamification Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-gradient-to-l from-slate-50 to-transparent -z-10 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Bangun Kebiasaan, <br/>
              <span className="text-sky-500">Lihat Perubahannya.</span>
            </h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Pertahankan konsistensimu dengan sistem Streak. Semakin sering kamu mencatat, semakin akurat MindMate mengenali dirimu.
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <Activity className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-slate-700">Daily Streak</span>
              </div>
              <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-slate-700">Smart Insights</span>
              </div>
            </div>
          </div>
          
          {/* Right Visual */}
          <div className="flex-1 relative flex justify-center">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl text-white transform rotate-3 hover:rotate-0 transition-all duration-500 max-w-sm w-full">
                <div className="flex justify-between items-center mb-8">
                   <div>
                      <p className="text-slate-400 text-sm">Target Minggu Ini</p>
                      <p className="text-2xl font-bold">5 Hari Beruntun</p>
                   </div>
                   <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      🔥
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-orange-500 rounded-full"></div>
                   </div>
                   <div className="flex justify-between text-xs text-slate-400">
                      <span>Sen</span>
                      <span>Sel</span>
                      <span>Rab</span>
                      <span className="text-orange-400 font-bold">Kam</span>
                      <span>Jum</span>
                      <span>Sab</span>
                      <span>Min</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Final Bottom CTA */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-slate-900">
            Siap mengambil alih kendali emosimu?
          </h2>
          
          {/* Container relatif untuk menampung elemen absolut */}
          <div className="relative flex justify-center items-center h-32">
            
            {/* Gambar diposisikan absolut ke kiri dari tengah */}
            <img 
              draggable="false"
              src="/chick-run.png" 
              alt="Mascot running" 
              className="absolute right-1/2 mr-32 w-48 md:w-50 object-contain z-10"
            />
            
            {/* Tombol tetap di tengah */}
            <Link 
              to="/login" 
              className="relative z-20 px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
            >
              Coba MindMate Sekarang
            </Link>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="font-bold text-xl text-slate-900">MindMate</div>
            <img 
              draggable="false"
              src="/chick-sleep.png" 
              alt="Mascot sleeping" 
              className="w-12 md:w-16 object-contain"
            />
          </div>
          <div className="text-slate-400 text-sm">
            © {new Date().getFullYear()} MindMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
