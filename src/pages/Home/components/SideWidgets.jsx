import { Zap, Brain, Quote } from "lucide-react";

const SideWidgets = ({ dailyData }) => {
  return (
    <div className="lg:col-span-7 flex flex-col gap-6 h-full">
      
      {/* 1. Recommended Module (Grid 2 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap size={80} className="text-blue-500" />
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap size={24} fill="currentColor" />
              </div>
              <h4 className="font-black text-slate-800 text-lg mb-1">Maintain Focus</h4>
              <p className="text-slate-400 text-sm font-medium">10 min • Meditation</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-purple-200 transition-all cursor-pointer group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Brain size={80} className="text-purple-500" />
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain size={24} fill="currentColor" />
              </div>
              <h4 className="font-black text-slate-800 text-lg mb-1">Deep Thinking</h4>
              <p className="text-slate-400 text-sm font-medium">25 min • Exercise</p>
          </div>

      </div>

      {/* 2. Latest Journal (Card Panjang ke Bawah) */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/40 border border-slate-100 flex-1 relative overflow-hidden group">
        
        {/* Background Blob */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-50 rounded-full blur-3xl opacity-60"></div>

        <div className="flex items-center gap-3 mb-6">
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
                     <p className="text-slate-400 italic text-center font-medium">
                        Belum ada catatan jurnal untuk hari ini.
                     </p>
                ) : (
                    <div className="relative">
                         <span className="text-6xl text-slate-100 absolute -top-8 -left-4 font-serif">“</span>
                         <p className="text-xl md:text-2xl text-slate-700 font-medium italic text-center leading-relaxed">
                            {dailyData.note}
                         </p>
                         <span className="text-6xl text-slate-100 absolute -bottom-10 -right-4 font-serif">”</span>
                    </div>
                )}
            </div>
            
            {dailyData.status !== 'No Data' && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400">Written at</span>
                    <span className="bg-slate-50 px-3 py-1 rounded-lg text-sm font-bold text-slate-600">
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