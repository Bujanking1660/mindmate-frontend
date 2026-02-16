// src/pages/Home/components/MoodCalendar.jsx
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MoodCalendar = ({ daysInMonth, moodHistory, streakDates, selectedDateStr, onDateClick }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group mb-8 h-24">
      <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-slate-600 hover:scale-110 hover:bg-white transition-all">
        <ChevronLeft size={20} />
      </button>

      <div ref={scrollRef} className="w-full flex items-end gap-3 overflow-x-auto md:overflow-x-hidden py-4 px-2 md:px-8 scroll-smooth no-scrollbar snap-x snap-mandatory h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {daysInMonth.map((day) => {
          const now = new Date();
          const dateToCheckStr = new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString('en-CA');
          const hasData = moodHistory.some(item => new Date(item.logDate).toLocaleDateString('en-CA') === dateToCheckStr);
          const isStreakActive = streakDates.includes(dateToCheckStr);
          const isSelected = dateToCheckStr === selectedDateStr;
          const isToday = dateToCheckStr === new Date().toLocaleDateString('en-CA');

          let bgClass = isStreakActive ? "bg-[#FF7E5F] text-white shadow-lg shadow-[#FF7E5F]/40" : hasData ? "bg-[#29ABE2] text-white shadow-md shadow-[#29ABE2]/30" : "bg-slate-200 text-slate-400";

          return (
            <div key={day} onClick={() => onDateClick(day)} className="flex flex-col items-center min-w-14 snap-center cursor-pointer relative group/day z-10">
              <div className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-300 border-2
                  ${bgClass} 
                  ${isSelected ? "scale-110 -translate-y-1 border-slate-800" : "scale-100 border-transparent"}
                  ${isToday && !hasData ? "ring-2 ring-slate-300 ring-offset-2" : ""}
                `}>
                {day}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-slate-600 hover:scale-110 hover:bg-white transition-all">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default MoodCalendar;