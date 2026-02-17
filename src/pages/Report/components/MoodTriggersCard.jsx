import React, { useState } from "react";
import { Zap, Activity } from "lucide-react";

const MoodTriggersCard = ({ triggersData, loading }) => {
  const [activeTriggerTab, setActiveTriggerTab] = useState("negative");
  console.log(triggersData);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Pemicu Emosi
          </h2>
          <p className="text-slate-500 text-sm">
            {activeTriggerTab === "positive" && "Pemicu kebahagiaan terbesarmu"}
            {activeTriggerTab === "neutral" && "Pemicu ketenanganmu"}
            {activeTriggerTab === "negative" && "Pemicu stres terbesarmu"}
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          {["positive", "neutral", "negative"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTriggerTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTriggerTab === tab
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "positive"
                ? "Positif"
                : tab === "neutral"
                  ? "Netral"
                  : "Negatif"}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-50">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 animate-pulse">
            Loading triggers...
          </div>
        ) : triggersData && triggersData[activeTriggerTab] ? (
          triggersData[activeTriggerTab].isEnoughData ? (
            <div className="flex flex-col gap-4">
              {triggersData[activeTriggerTab].tags.map((tag, idx) => {
                let barColor = "bg-slate-200";
                if (activeTriggerTab === "positive") barColor = "bg-green-500";
                else if (activeTriggerTab === "neutral")
                  barColor = "bg-yellow-500";
                else if (activeTriggerTab === "negative")
                  barColor = "bg-red-500";

                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-semibold text-slate-600 truncate text-right">
                      {tag.name}
                    </div>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
                        style={{ width: `${tag.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-bold text-slate-700 text-right">
                      {tag.count}x
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">🌱</span>
              </div>
              <p className="text-slate-800 font-bold mb-1">
                Belum ada pola pemicu
              </p>
              <p className="text-slate-500 text-sm max-w-xs">
                Terus catat jurnalmu agar MindMate bisa menganalisis pemicu{" "}
                {activeTriggerTab === "positive"
                  ? "kebahagiaanmu"
                  : activeTriggerTab === "negative"
                    ? "stresmu"
                    : "ketenanganmu"}
                !
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-10 text-slate-300">
            Data tidak tersedia.
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTriggersCard;
