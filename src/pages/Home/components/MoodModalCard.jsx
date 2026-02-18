// src/pages/Home/components/MoodModuleCard.jsx

import React from "react";
import { ArrowRight, Lock } from "lucide-react";
import { MODULE_DATA } from "../../../data/moduleContent";

const MoodModuleCard = ({ moodTypeId, onClick }) => {
  if (moodTypeId === null || moodTypeId === undefined) {
    return (
      <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 flex flex-col items-center justify-center text-center min-h-55 transition-all duration-300">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <Lock size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">
          Modul Terkunci
        </h3>
        <p className="text-slate-500 font-medium text-sm max-w-xs">
          Silakan isi mood harianmu terlebih dahulu untuk mendapatkan
          rekomendasi modul.
        </p>
      </div>
    );
  }

  // Jika ada moodTypeId, cari kontennya. Jika tidak ketemu di DATA, baru fallback ke default (opsional)
  const content = MODULE_DATA[moodTypeId] || MODULE_DATA[2];

  // Mapping warna
  const colorMap = {
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-100",
      text: "text-rose-900",
      btn: "bg-rose-600 hover:bg-rose-700",
      iconBg: "bg-rose-100 text-rose-600",
      tag: "border-rose-200 text-rose-600 bg-white",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-900",
      btn: "bg-orange-500 hover:bg-orange-600",
      iconBg: "bg-orange-100 text-orange-600",
      tag: "border-orange-200 text-orange-600 bg-white",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-900",
      btn: "bg-blue-600 hover:bg-blue-700",
      iconBg: "bg-blue-100 text-blue-600",
      tag: "border-blue-200 text-blue-600 bg-white",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-900",
      btn: "bg-emerald-600 hover:bg-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-600",
      tag: "border-emerald-200 text-emerald-600 bg-white",
    },
    fuchsia: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-100",
      text: "text-fuchsia-900",
      btn: "bg-fuchsia-600 hover:bg-fuchsia-700",
      iconBg: "bg-fuchsia-100 text-fuchsia-600",
      tag: "border-fuchsia-200 text-fuchsia-600 bg-white",
    },
  };

  const styles = colorMap[content?.theme] || colorMap.blue;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[2.5rem] border transition-all duration-300 hover:shadow-xl group flex flex-col md:flex-row ${styles.bg} ${styles.border}`}
    >
      {/* Kiri: Konten Teks */}
      <div className="p-6 md:p-8 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${styles.iconBg}`}
          >
            {content.icon}
          </div>
          {/* Tags (Hidden di Mobile biar ga penuh) */}
          <div className="hidden sm:flex gap-2">
            {content.tags?.map((tag, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border uppercase tracking-wider shadow-sm ${styles.tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className={`text-2xl font-black mb-2 ${styles.text}`}>
          {content.title}
        </h3>
        <p
          className={`font-medium leading-relaxed text-sm md:text-base opacity-90 ${styles.text.replace("900", "700")}`}
        >
          {content.description}
        </p>
      </div>

      {/* Kanan: Tombol Aksi */}
      <div className="p-6 md:p-2 md:pr-4 flex items-center justify-center md:w-48">
        <button
          onClick={onClick}
          className={`w-full py-4 md:py-0 md:h-full md:max-h-40 rounded-2xl text-white font-bold text-sm shadow-lg transition-all flex md:flex-col items-center justify-center gap-2 md:gap-1 active:scale-95 ${styles.btn}`}
        >
          <span>Buka Modul</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default MoodModuleCard;
