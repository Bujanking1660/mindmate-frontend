import React from 'react';
import { X, CheckCircle, PlayCircle } from 'lucide-react';
import { MODULE_DATA } from '../../../data/moduleContent';

const ModuleDetailModal = ({ isOpen, onClose, moodTypeId }) => {
  if (!isOpen) return null;

  // Ambil data (Fallback ke ID 2 jika error)
  const data = MODULE_DATA[moodTypeId] || MODULE_DATA[2];
  const { modalContent, theme, icon, title } = data;

  // Config warna tema (Sama seperti Card)
  const themeStyles = {
    rose: { bg: "bg-rose-50", text: "text-rose-900", accent: "text-rose-600", btn: "bg-rose-600 hover:bg-rose-700", border: "border-rose-100", bullet: "bg-rose-200 text-rose-700" },
    orange: { bg: "bg-orange-50", text: "text-orange-900", accent: "text-orange-600", btn: "bg-orange-500 hover:bg-orange-600", border: "border-orange-100", bullet: "bg-orange-200 text-orange-700" },
    blue: { bg: "bg-blue-50", text: "text-blue-900", accent: "text-blue-600", btn: "bg-blue-600 hover:bg-blue-700", border: "border-blue-100", bullet: "bg-blue-200 text-blue-700" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-900", accent: "text-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700", border: "border-emerald-100", bullet: "bg-emerald-200 text-emerald-700" },
    fuchsia: { bg: "bg-fuchsia-50", text: "text-fuchsia-900", accent: "text-fuchsia-600", btn: "bg-fuchsia-600 hover:bg-fuchsia-700", border: "border-fuchsia-100", bullet: "bg-fuchsia-200 text-fuchsia-700" },
  };

  const style = themeStyles[theme] || themeStyles.blue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`${style.bg} p-6 border-b ${style.border} flex justify-between items-start`}>
            <div className="flex gap-4 items-center">
                <div className="text-4xl bg-white/50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
                    {icon}
                </div>
                <div>
                    <h3 className={`text-2xl font-black ${style.text}`}>{title}</h3>
                    <p className={`text-sm font-medium opacity-80 ${style.text}`}>Panduan Interaktif</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
                <X size={20} className="text-slate-500" />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
            <div className="mb-6 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <p className="text-slate-600 font-medium italic text-center">
                    "{modalContent.intro}"
                </p>
            </div>

            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PlayCircle size={18} className={style.accent} />
                Langkah-langkah:
            </h4>

            <div className="space-y-4">
                {modalContent.steps.map((step, index) => (
                    <div key={index} className="flex gap-4 group">
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${style.bullet}`}>
                            {index + 1}
                        </div>
                        <p className="text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors pt-1">
                            {step}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
            <button 
                onClick={onClose}
                className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${style.btn}`}
            >
                <CheckCircle size={20} />
                Saya Sudah Melakukannya
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModuleDetailModal;