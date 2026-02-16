import React from "react";
import { Zap, Activity } from "lucide-react";

const MoodTriggersCard = ({ triggersData, loading }) => {
  // 1. Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 animate-pulse">
        <div className="h-6 w-1/3 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Empty State / Data Invalid Check
  // PERBAIKAN DI SINI: Kita pastikan triggersData adalah Array
  const isValidData = Array.isArray(triggersData) && triggersData.length > 0;

  if (!triggersData || !isValidData) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Zap size={24} />
        </div>
        <h3 className="text-slate-800 font-bold">Belum Ada Data Pemicu</h3>
        <p className="text-slate-500 text-sm mt-1">
          Tambahkan tags (seperti "Kerja", "Keluarga") saat mencatat mood untuk melihat analisis ini.
        </p>
      </div>
    );
  }

  // 3. Render Data (Sekarang aman untuk di-map)
  const maxCount = Math.max(...triggersData.map((t) => t.count || 0));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
          <Activity size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Top Triggers</h2>
      </div>

      <div className="space-y-4">
        {triggersData.map((item, index) => {
          const percentage = maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0;
          
          return (
            <div key={index} className="group">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-semibold text-slate-700">
                  {item.tagName || item.triggerName || "Unknown"}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {item.count} logs
                </span>
              </div>
              
              {/* Progress Bar Background */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                {/* Progress Bar Fill */}
                <div
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-600"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodTriggersCard;