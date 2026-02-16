import { X, Calendar, Clock, Tag, AlignLeft } from "lucide-react";

const LogDetailModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Kotak Modal Putih (Konsisten putih) */}
      <div className="bg-white rounded-4xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative border border-slate-100">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header: Putih, Simpel, dengan Ikon */}
        <div className="h-40 bg-white flex flex-col items-center justify-center border-b border-slate-100 relative">
          <h2 className="text-2xl font-black mt-4 text-slate-900 uppercase tracking-tighter">
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
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Tag size={14} strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-widest">
                Aktivitas & Perasaan
              </h3>
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
                <span className="text-slate-400 text-xs italic bg-slate-50 px-3 py-1 rounded-lg">
                  Tanpa tag
                </span>
              )}
            </div>
          </div>

          {/* Section: Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <AlignLeft size={14} strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-widest">
                Catatan Jurnal
              </h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-h-20 max-h-37.5 overflow-y-auto">
              <p className="text-slate-800 text-sm leading-relaxed font-medium">
                {data.note || "Kamu tidak menulis catatan untuk hari ini."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer: Tombol Tutup */}
        <div className="p-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white font-black text-xs tracking-widest rounded-2xl hover:bg-slate-700 transition-all active:scale-[0.98] shadow-sm uppercase"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;
