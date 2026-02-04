import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const now = new Date();
    const totalDays = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    setDaysInMonth(Array.from({ length: totalDays }, (_, i) => i + 1));
  }, [navigate]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 font-sans text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1 md:gap-2 mb-8">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
          Mood Tracker
        </h1>
        <p className="text-sm md:text-lg text-slate-500 font-medium">
          Understand yourself better, one day at a time.
        </p>
      </div>

      {/* STREAK / CALENDAR SECTION */}
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-slate-600 hover:scale-110 hover:bg-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div
          ref={scrollRef}
          className="w-full flex items-end gap-1 md:gap-2 overflow-x-auto md:overflow-x-hidden py-4 px-2 md:px-8 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {daysInMonth.map((day) => {
            const isToday = day === new Date().getDate();
            return (
              <div key={day} className="flex flex-col items-center gap-2 min-w-14 snap-center">
                <button
                  className={`relative shrink-0 w-12 h-12 md:w-12 md:h-12 flex items-center justify-center rounded-full md:rounded-full font-bold transition-all duration-300 ease-out
                  ${
                    isToday
                      ? "bg-blue-600 text-white shadow-blue-500/40 shadow-lg scale-110 -translate-y-1 ring-2 ring-blue-200 ring-offset-2"
                      : "bg-[#5DC6F1]/20 text-slate-700 hover:bg-[#5DC6F1] hover:text-white hover:shadow-md"
                  } text-base md:text-lg`}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Tombol Kanan */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-slate-600 hover:scale-110 hover:bg-white transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-4">
        <div className="lg:col-span-4 relative overflow-hidden bg-linear-to-b from-[#CDE9FF] to-[#A8D8F0] rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-white/40 flex flex-col items-center justify-between min-h-100 lg:h-auto lg:min-h-137.5 transition-transform hover:scale-[1.01] duration-500">
          
          <div className="w-full flex justify-between items-center z-10">
            <h3 className="font-bold text-xl text-slate-800/90 tracking-tight">
              Daily Overview
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center grow gap-6 text-center w-full z-10">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 shadow-sm">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>

            <div className="space-y-1">
              <h4 className="text-3xl md:text-4xl font-bold text-slate-800">
                Very Happy
              </h4>
              <p className="text-sm font-semibold text-slate-500/80">
                Updated at {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            <div className="relative group cursor-pointer">
               {/* Glow Effect yang lebih halus */}
               <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-700"></div>
                <img
                src="/icon.png"
                alt="Mood Icon"
                className="w-32 h-32 md:w-40 md:h-40 relative z-10 drop-shadow-xl hover:-translate-y-2 transition-transform duration-500 ease-in-out"
                draggable={false}
                />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          
          {/* Card 2: Meditating Section */}
          <div className="bg-linear-to-b from-[#CDE9FF] to-[#A8D8F0] rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 border border-white/40 relative overflow-hidden">
             {/* Decorative Blur */}
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/20 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-xl text-[10px] md:text-xs font-black shadow-sm text-slate-600 tracking-widest border border-white/50">
                RECOMMENDED MODULE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative z-10">
              {/* Activity 1 */}
              <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl flex items-center gap-5 shadow-sm hover:shadow-lg hover:bg-white/80 transition-all duration-300 cursor-pointer group border border-white/40">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  🧘
                </div>
                <div className="flex flex-col items-start w-full">
                  <h4 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                    Maintain Focus
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">10 min • Focus</p>
                  <button className="bg-slate-800 text-white text-[10px] tracking-wide px-4 py-2 rounded-full font-bold uppercase hover:bg-blue-600 hover:shadow-blue-500/30 transition-all w-full sm:w-auto shadow-md">
                    Start
                  </button>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl flex items-center gap-5 shadow-sm hover:shadow-lg hover:bg-white/80 transition-all duration-300 cursor-pointer group border border-white/40">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  🧠
                </div>
                <div className="flex flex-col items-start w-full">
                  <h4 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                    Deep Learning
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">25 min • Brain</p>
                  <button className="bg-slate-800 text-white text-[10px] tracking-wide px-4 py-2 rounded-full font-bold uppercase hover:bg-blue-600 hover:shadow-blue-500/30 transition-all w-full sm:w-auto shadow-md">
                    Start
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Journaling Section */}
          <div className="bg-linear-to-b from-[#CDE9FF] to-[#A8D8F0] rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 grow border border-white/40 flex flex-col min-h-55 relative overflow-hidden group">
             {/* Decorative Blur */}
             <div className="absolute top-1/2 left-1/2 w-full h-full bg-white/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-white/20 transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-xl text-[10px] md:text-xs font-black shadow-sm text-slate-600 tracking-widest border border-white/50">
                LATEST JOURNAL
              </span>
              <button className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                 {/* Icon Edit Simple */}
                 <div className="w-4 h-4 border-2 border-slate-400 rounded-sm"></div>
              </button>
            </div>

            <div className="grow flex flex-col justify-center relative z-10">
                {/* Visual kertas kutipan */}
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-sm relative">
                {/* Tanda kutip dekoratif */}
                <span className="absolute top-4 left-4 text-4xl text-blue-200 font-serif leading-none">“</span>
                
                <p className="text-sm md:text-lg font-medium leading-relaxed text-slate-700 italic px-4 text-center">
                  Feeling great today because everything is finally going my way.
                  I managed to finish my React project faster than expected!
                </p>
                
                 <span className="absolute bottom-4 right-4 text-4xl text-blue-200 font-serif leading-none rotate-180">“</span>
              </div>
              
              <div className="flex justify-end mt-3 items-center gap-2 px-2">
                 <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">Your Daily Note</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Home;