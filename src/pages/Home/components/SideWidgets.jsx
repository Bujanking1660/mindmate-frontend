import { Quote } from "lucide-react";
import MoodModuleCard from "./MoodModalCard"; // Pastikan nama file .jsx nya benar

// Tambahkan prop onOpenModule yang dikirim dari Home.jsx
const SideWidgets = ({ dailyData, onOpenModule }) => {
  
  return (
    <div className="lg:col-span-7 flex flex-col gap-6 h-full">
      
      {/* 1. Dynamic Module Card */}
      <div className="w-full">
          <div className="flex items-center gap-2 mb-4">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Rekomendasi Hari Ini
             </span>
          </div>
          
          {/* Ganti alert dengan fungsi onOpenModule */}
          <MoodModuleCard 
            moodTypeId={dailyData.moodTypeId} 
            onClick={onOpenModule} 
          />
      </div>

      {/* 2. Latest Journal */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/40 border border-slate-100 flex-1 relative overflow-hidden group min-h-[250px]">
        
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-50 rounded-full blur-2xl opacity-40"></div>

        <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                <Quote size={20} fill="currentColor" />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Catatan Jurnal
            </span>
        </div>
        
        <div className="relative z-10 h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
                {dailyData.status === 'No Data' ? (
                     <div className="text-center">
                        <p className="text-slate-400 italic font-medium mb-2">
                           Belum ada catatan hari ini.
                        </p>
                        <p className="text-xs text-slate-300">
                           Isi mood harianmu untuk membuka jurnal.
                        </p>
                     </div>
                ) : (
                    <div className="relative w-full">
                         <span className="text-6xl text-slate-100 absolute -top-6 -left-2 font-serif select-none">“</span>
                         <p className="text-lg md:text-xl text-slate-700 font-medium italic text-center leading-relaxed px-4 line-clamp-4">
                            {dailyData.note}
                         </p>
                         <span className="text-6xl text-slate-100 absolute -bottom-8 -right-2 font-serif select-none">”</span>
                    </div>
                )}
            </div>
            
            {dailyData.status !== 'No Data' && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ditulis jam</span>
                    <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-100">
                        {dailyData.time}
                    </span>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default SideWidgets;