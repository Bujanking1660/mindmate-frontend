import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MoodCalendar = ({ moodHistory, moodTypes, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Generate Calendar Grid
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const startDayOfWeek = firstDay.getDay();

    // Prev Month Filler
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, currentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i) });
    }
    // Current Month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    // Next Month Filler (up to 42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
    }
    setDaysInMonth(days);
  }, [currentDate]);

  // Optimized Search
  const historyDict = useMemo(() => {
    const dict = {};
    moodHistory.forEach((log) => {
      const dateStr = new Date(log.logDate).toLocaleDateString("en-CA");
      dict[dateStr] = { ...log, mood_name: moodTypes.find((t) => t.id === log.moodTypeId)?.moodName || "Unknown" };
    });
    return dict;
  }, [moodHistory, moodTypes]);

  // Helper for Styles
  const getStyles = (moodName) => {
    const map = {
      "Very Happy": "bg-green-100 text-green-700 bg-dot-green-500",
      "Sangat Senang": "bg-green-100 text-green-700 bg-dot-green-500",
      "Happy": "bg-blue-100 text-blue-700 bg-dot-blue-500",
      "Senang": "bg-blue-100 text-blue-700 bg-dot-blue-500",
      "Neutral": "bg-slate-100 text-slate-700 bg-dot-slate-500",
      "Biasa": "bg-slate-100 text-slate-700 bg-dot-slate-500",
      "Sad": "bg-yellow-100 text-yellow-700 bg-dot-yellow-500",
      "Sedih": "bg-yellow-100 text-yellow-700 bg-dot-yellow-500",
      "Very Sad": "bg-red-100 text-red-700 bg-dot-red-500",
      "Sangat Sedih": "bg-red-100 text-red-700 bg-dot-red-500",
    };
    const defaultStyle = "bg-indigo-50 text-indigo-700 bg-dot-indigo-400";
    const styles = map[moodName] || defaultStyle;
    const [bg, text, dot] = styles.split(" ");
    return { bg, text, dot: dot.replace("bg-dot-", "bg-") };
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
           <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
           {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
           <ChevronRight size={24} />
        </button>
      </div>

      {/* Grid */}
      <div className="p-6">
        <div className="grid grid-cols-7 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((item, idx) => {
            const dateStr = item.date.toLocaleDateString("en-CA");
            const log = historyDict[dateStr];
            const styles = log ? getStyles(log.mood_name) : null;
            
            return (
              <div 
                key={idx} 
                onClick={() => log && onDayClick(log)}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                  ${log ? `${styles.bg} cursor-pointer hover:scale-105 hover:shadow-md` : "bg-white"}
                  ${!log && item.currentMonth ? "hover:bg-slate-50" : ""}
                `}
              >
                <span className={`text-sm ${log ? styles.text : "text-slate-600"} ${!item.currentMonth ? "opacity-30" : "font-bold"}`}>{item.day}</span>
                {log && <span className={`w-1.5 h-1.5 rounded-full mt-1 ${styles.dot}`}></span>}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend Footer */}
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-center gap-6 text-xs text-slate-500 font-medium overflow-x-auto">
         {/* ... Isi Legend di sini sama seperti sebelumnya ... */}
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div>Very Happy</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Happy</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div>Neutral</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div>Sad</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div>Very Sad</div>
      </div>
    </div>
  );
};

export default MoodCalendar;