// src/pages/Home/components/DailyOverviewCard.jsx
import { Pencil, Trash2, Menu } from "lucide-react";

const DailyOverviewCard = ({ dailyData, isViewingToday, onEdit, onDelete, onCreate, selectedDateStr }) => {
  return (
    <div className={`lg:col-span-4 relative overflow-hidden bg-linear-to-b ${dailyData.bgGradient} rounded-[2.5rem] p-8 shadow-xl ${dailyData.shadowColor} border border-white/40 flex flex-col items-center justify-start min-h-125 transition-all duration-500 hover:shadow-2xl`}>
      
      {/* Header Card */}
      <div className="w-full flex justify-between items-center z-10 mb-8 h-10">
        <h3 className="font-medium text-2xl text-slate-900 tracking-tight">Daily Overview</h3>
        <div className="flex gap-2">
          {dailyData.status !== "No Data" && isViewingToday ? (
            <>
              <button onClick={onEdit} className="p-2 bg-white/40 hover:bg-slate-900 hover:text-white rounded-full text-slate-600 transition-all backdrop-blur-sm"><Pencil size={20} /></button>
              <button onClick={onDelete} className="p-2 bg-white/40 hover:bg-red-500 hover:text-white rounded-full text-slate-600 transition-all backdrop-blur-sm"><Trash2 size={20} /></button>
            </>
          ) : (
            isViewingToday && dailyData.status === "No Data" ? (
              <button onClick={onCreate} className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-lg hover:bg-slate-700 transition-all">LOG NOW</button>
            ) : (
              <Menu size={24} className="text-slate-900 opacity-50" />
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center w-full z-10 grow">
        <h2 className="text-xl md:text-2xl text-slate-800 font-medium mb-4">
          {new Date(selectedDateStr).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h2>
        <div className="text-center mb-6 h-20">
          <h4 className={`text-3xl md:text-4xl font-bold ${dailyData.textColor} mb-1 drop-shadow-sm transition-colors duration-300`}>{dailyData.status}</h4>
          <p className="text-sm font-medium text-slate-500">{dailyData.time}</p>
        </div>

        <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-500 mb-8 w-44 h-44 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-75"></div>
          {dailyData.icon && (
            <img
              src={dailyData.icon}
              alt="Mood Icon"
              width="176"
              height="176"
              fetchPriority="high"
              loading="eager"
              className={`w-36 h-36 md:w-44 md:h-44 relative z-10 drop-shadow-2xl object-contain transition-all duration-300 ${dailyData.status === 'No Data' ? 'opacity-30 grayscale blur-[2px]' : ''}`}
              draggable={false}
            />
          )}
        </div>

        <div className="w-full mt-auto min-h-12.5">
          {dailyData.tags && dailyData.tags.length > 0 ? (
            <div className="flex flex-wrap gap-3 justify-center w-full">
              {dailyData.tags.map((tag, idx) => (
                <span key={idx} className="bg-white/60 text-slate-700 px-6 py-2 rounded-full text-sm font-semibold shadow-sm border border-slate-200/50 min-w-25 text-center backdrop-blur-sm">{tag}</span>
              ))}
            </div>
          ) : (
            <div className="flex justify-center text-slate-400 text-xs font-medium italic">No tags selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyOverviewCard;