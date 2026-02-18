import { Pencil, Trash2, Plus, Frown } from "lucide-react";

const DailyOverviewCard = ({ dailyData, isViewingToday, onEdit, onDelete, onCreate, selectedDateStr }) => {
  
  // Format Tanggal
  const formattedDate = new Date(selectedDateStr).toLocaleDateString("id-ID", { 
    weekday: "long", day: "numeric", month: "long" 
  });

  return (
    <div className={`lg:col-span-5 relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-500 group flex flex-col
        ${dailyData.status === 'No Data' 
            ? 'bg-white border border-slate-100 shadow-slate-200/50' 
            : `bg-linear-to-br ${dailyData.bgGradient} ${dailyData.shadowColor} text-white`
        }
    `}>
      
      {/* Background Decor (Noise/Texture could be added here) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>

      {/* --- HEADER --- */}
      <div className="p-8 flex justify-between items-start z-10">
        <div>
          <h3 className={`font-bold text-lg ${dailyData.status === 'No Data' ? 'text-slate-400' : 'text-white/80'}`}>
            Overview Harian
          </h3>
          <p className={`text-2xl font-black mt-1 leading-tight ${dailyData.status === 'No Data' ? 'text-slate-800' : 'text-white'}`}>
             {formattedDate}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {dailyData.status !== "No Data" && isViewingToday && (
            <>
              <button onClick={onEdit} className="p-3 bg-white/20 hover:bg-white hover:text-blue-600 backdrop-blur-md rounded-xl transition-all shadow-sm">
                 <Pencil size={18} />
              </button>
              <button onClick={onDelete} className="p-3 bg-white/20 hover:bg-red-500 hover:text-white backdrop-blur-md rounded-xl transition-all shadow-sm">
                 <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        
        {dailyData.status === 'No Data' ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center text-center py-10">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <Frown size={64} strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold text-slate-700 mb-2">Belum ada catatan</h4>
                <p className="text-slate-400 mb-8 max-w-xs">Kamu belum mencatat mood untuk tanggal ini.</p>
                
                {isViewingToday && (
                    <button 
                        onClick={onCreate}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:bg-black hover:scale-105 transition-all"
                    >
                        <Plus size={20} />
                        Catat Sekarang
                    </button>
                )}
            </div>
        ) : (
            /* DATA STATE */
            <>
                {/* Icon Wrapper with Glow */}
                <div className="relative mb-6 group-hover:scale-110 transition-transform duration-500 ease-out">
                    <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full scale-110"></div>
                    <img
                        src={dailyData.icon}
                        alt="Mood Icon"
                        className="w-48 h-48 object-contain relative z-10 drop-shadow-2xl"
                    />
                </div>

                <div className="text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold uppercase tracking-wider mb-2 shadow-sm">
                        {dailyData.time}
                    </div>
                    <h2 className="text-4xl font-black mb-6 text-white drop-shadow-md">
                        {dailyData.status}
                    </h2>

                    {/* Tags */}
                    {dailyData.tags && dailyData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                            {dailyData.tags.map((tag, idx) => (
                                <span key={idx} className="bg-white/90 text-slate-800 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default DailyOverviewCard;