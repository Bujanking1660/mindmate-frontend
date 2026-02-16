import React from "react";
import { Lock } from "lucide-react";

const MoodStabilityCard = ({ stabilityData }) => {
  if (!stabilityData) {
     return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex items-center justify-center h-40 animate-pulse">
           <span className="text-slate-400">Loading stability analysis...</span>
        </div>
     );
  }

  const { isEnoughData, stabilityScore, stabilityLabel, totalLogs, period } = stabilityData;
  const score = isEnoughData ? stabilityScore : 85; // Fallback visual
  const color = score > 75 ? "#22c55e" : score > 40 ? "#eab308" : "#ef4444";
  const strokeDashoffset = 502 - (502 * score) / 100;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800">Mood Stability</h2>
        <span className="text-xs font-bold tracking-wide text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase">{period}</span>
      </div>

      <div className="relative min-h-55 flex items-center">
        <div className={`w-full flex flex-col md:flex-row items-center gap-10 md:gap-16 justify-start transition-all duration-500 ${!isEnoughData ? "filter blur-md opacity-40 grayscale-50" : ""}`}>
            {/* SVG Donut */}
            <div className="relative w-48 h-48 shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="80" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="50%" cy="50%" r="80" fill="transparent" stroke={color} strokeWidth="10" strokeDasharray={502} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-black tracking-tighter`} style={{ color }}>{score}</span>
                  <span className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">/ 100</span>
               </div>
            </div>
            
            {/* Text Info */}
            <div className="flex-1 text-center md:text-left max-w-lg">
               <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">{isEnoughData ? stabilityLabel : "Mood Sangat Stabil"}</h3>
               <p className="text-slate-500 text-base leading-relaxed mb-6">Your mood stability score is calculated based on variance over the last 30 days.</p>
               <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 inline-flex flex-col min-w-25">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-0.5">Total Logs</span>
                  <span className="text-xl font-bold text-slate-700">{totalLogs}</span>
               </div>
            </div>
        </div>

        {/* Lock Overlay */}
        {!isEnoughData && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-sm">
            <div className="bg-white p-4 rounded-full shadow-xl mb-4 text-orange-500 animate-bounce-slow border border-orange-50">
               <Lock size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Analisis Belum Tersedia</h3>
            <p className="text-slate-600 font-medium max-w-sm">Catat mood-mu minimal 4 kali minggu ini untuk membuka fitur ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodStabilityCard;