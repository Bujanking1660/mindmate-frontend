import React from "react";
import { X, Calendar, Clock, Tag, AlignLeft } from "lucide-react";
// Import aset
import { getMoodImage, MASKOT_IMAGES } from "../../../utils/assetsConfig";

const LogDetailModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative border border-slate-100">
        
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100/80 hover:bg-slate-200 text-slate-500 rounded-full transition-colors backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Header: Area Visual Mood */}
        <div className="relative h-44 bg-linear-to-b from-slate-50 to-white flex flex-col items-center justify-center border-b border-slate-50">
          {/* Lingkaran Dekoratif di Belakang */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50" />
          </div>

          {/* Icon Mood Besar (Normalisasi ID: API 0-4 -> Assets 1-5) */}
          <div className="relative">
            <img 
              src={getMoodImage(data.moodTypeId + 1)} 
              alt={data.moodName}
              className="w-20 h-20 object-contain drop-shadow-xl animate-bounce-slow"
              style={{ animationDuration: '3s' }}
            />
          </div>

          <h2 className="text-2xl font-black mt-3 text-slate-900 uppercase tracking-tighter">
            {data.moodName}
          </h2>
        </div>

        {/* Body: Informasi Detail */}
        <div className="p-6 space-y-6">
          
          {/* Baris Waktu & Tanggal */}
          <div className="flex items-center justify-between text-[13px] text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" />
              <span className="font-bold">{data.formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" />
              <span className="font-bold">
                {new Date(data.logDate).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Section: Tags */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-400 font-black uppercase tracking-widest text-[11px]">
              <Tag size={14} strokeWidth={3} />
              <h3>Aktivitas & Perasaan</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.displayTags && data.displayTags.length > 0 ? (
                data.displayTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-xl border border-slate-200"
                  >
                    #{tag.toUpperCase()}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">Tanpa tag</span>
              )}
            </div>
          </div>

          {/* Section: Notes dengan Maskot Kecil */}
          <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[11px]">
                  <AlignLeft size={14} strokeWidth={3} />
                  <h3>Catatan Jurnal</h3>
                </div>
                {/* Maskot Default muncul menemani catatan */}
                <img src={MASKOT_IMAGES.default} className="w-8 h-8 opacity-40 grayscale" alt="mascot" />
            </div>
            <div className="bg-slate-50 p-5 rounded-4xl border border-slate-100 min-h-20 max-h-40 overflow-y-auto">
              <p className="text-slate-800 text-sm leading-relaxed font-medium">
                {data.journalNote || "Tidak ada catatan untuk hari ini."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white font-black text-xs tracking-widest rounded-2xl hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200 uppercase"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;