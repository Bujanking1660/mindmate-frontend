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
    <div className="relative group mb-10">
      
      {/* Tombol Navigasi Kiri */}
      <button 
        onClick={() => scroll("left")} 
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-xl shadow-slate-200/50 text-slate-600 hover:scale-110 hover:text-slate-900 transition-all border border-slate-100"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Container Scroll */}
      <div 
        ref={scrollRef} 
        className="w-full flex items-center gap-1 overflow-x-auto py-6 px-1 scroll-smooth no-scrollbar snap-x snap-mandatory" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {daysInMonth.map((day) => {
          const now = new Date();
          const dateToCheckStr = new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString('en-CA');
          
          // Logic cek status
          const hasData = moodHistory.some(item => new Date(item.logDate).toLocaleDateString('en-CA') === dateToCheckStr);
          const isStreakActive = streakDates.includes(dateToCheckStr);
          const isSelected = dateToCheckStr === selectedDateStr;
          const isToday = dateToCheckStr === new Date().toLocaleDateString('en-CA');

          // Styling Dinamis
          let bgClass = "bg-white text-slate-400 border border-slate-100 hover:border-blue-200"; // Default
          
          if (isStreakActive) {
            bgClass = "bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-500/30 border-transparent";
          } else if (hasData) {
            bgClass = "bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/30 border-transparent";
          }

          if (isSelected) {
            bgClass += " ring-4 ring-blue-100 scale-110 z-10 font-black";
          }

          if (isToday && !hasData && !isSelected) {
             bgClass += " border-2 border-dashed border-slate-300";
          }

          return (
            <div key={day} className="flex flex-col items-center min-w-18 snap-center">
              <button
                onClick={() => onDateClick(day)}
                className={`w-14 h-16 rounded-[1.2rem] flex flex-col items-center justify-center gap-1 transition-all duration-300 ${bgClass}`}
              >
                <span className="text-[10px] uppercase font-bold opacity-80">
                    {new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-xl font-bold">{day}</span>
              </button>
              
              {/* Dot indicator for selection */}
              {isSelected && <div className="w-1.5 h-1.5 bg-slate-800 rounded-full mt-3"></div>}
            </div>
          );
        })}
      </div>

      {/* Tombol Navigasi Kanan */}
      <button 
        onClick={() => scroll("right")} 
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-xl shadow-slate-200/50 text-slate-600 hover:scale-110 hover:text-slate-900 transition-all border border-slate-100"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default MoodCalendar;