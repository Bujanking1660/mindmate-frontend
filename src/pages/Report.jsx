import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "../components/Navbar";
import api from "../api/axiosConfig";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react"; // Icon tambahan
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const Report = () => {
  const scrollRef = useRef(null);

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodTypes, setMoodTypes] = useState([]);
  const [allTags, setAllTags] = useState([]); // Database semua tag
  
  // Chart Data
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // Calendar & Streak State
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [streakDates, setStreakDates] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toLocaleDateString('en-CA'));
  
  // Modal Detail State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null); // Data untuk modal

  const COLORS = ["#3B82F6", "#64748B", "#EAB308", "#F97316", "#EC4899"];

  // --- INITIAL LOAD ---
  useEffect(() => {
    // Generate tanggal bulan ini
    const now = new Date();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    setDaysInMonth(Array.from({ length: totalDays }, (_, i) => i + 1));

    loadData();
  }, []);

  // Hitung Streak setiap kali history berubah
  useEffect(() => {
    if (moodHistory.length > 0) {
      calculateStreak(moodHistory);
    }
  }, [moodHistory]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load Mood Types
      const typesRes = await api.get("/mood-type");
      setMoodTypes(typesRes.data.data || []);

      // 2. Load Tags (Feelings) agar bisa menampilkan nama tag di modal
      const tagsRes = await api.get("/feelings");
      setAllTags(tagsRes.data.data || []);

      // 3. Load Mood History
      const moodRes = await api.get("/mood");
      const history = moodRes.data.data || [];
      
      const sortedHistory = [...history].sort((a, b) => new Date(a.logDate) - new Date(b.logDate));
      setMoodHistory(sortedHistory);

      processChartData(sortedHistory, typesRes.data.data || []);
    } catch (error) {
      console.error("Gagal load report:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CHART PROCESSOR ---
  const processChartData = (history, types) => {
    // Line Chart (Last 7 Days)
    const last7Days = history.slice(-7);
    const lineData = last7Days.map(item => {
      const type = types.find(t => t.id === item.moodTypeId);
      return {
        day: new Date(item.logDate).toLocaleDateString("en-US", { weekday: "short" }),
        score: item.moodTypeId,
        moodName: type ? type.moodName : "Unknown"
      };
    });
    setChartData(lineData);

    // Pie Chart
    const counts = {};
    history.forEach(item => {
      const id = item.moodTypeId;
      counts[id] = (counts[id] || 0) + 1;
    });
    const pieChartData = Object.keys(counts).map(key => {
        const type = types.find(t => String(t.id) === String(key));
        return {
            name: type ? type.moodName : `Type ${key}`,
            value: counts[key],
            id: parseInt(key)
        };
    });
    setPieData(pieChartData);
  };

  // --- STREAK LOGIC (SAMA DENGAN HOME) ---
  const calculateStreak = (history) => {
    const loggedDates = new Set(
      history.map(item => new Date(item.logDate).toLocaleDateString('en-CA'))
    );
    const todayStr = new Date().toLocaleDateString('en-CA');
    let checkDate = new Date();

    // Mundur 1 hari jika hari ini belum isi, agar streak visual tidak hilang
    if (!loggedDates.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    let tempStreak = [];
    while (true) {
        const dateStr = checkDate.toLocaleDateString('en-CA');
        if (loggedDates.has(dateStr)) {
            tempStreak.push(dateStr); 
            checkDate.setDate(checkDate.getDate() - 1); 
        } else {
            break; 
        }
    }

    // Logic Warna: Hanya simpan di array streak jika >= 3 hari
    if (tempStreak.length >= 3) {
        setStreakDates(tempStreak);
    } else {
        setStreakDates([]); 
    }
  };

  // --- HANDLERS ---
  const getDayStatus = (day) => {
    const now = new Date();
    const dateToCheckStr = new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString('en-CA');
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    // Cek data
    const foundLog = moodHistory.find(item => 
       new Date(item.logDate).toLocaleDateString('en-CA') === dateToCheckStr
    );

    const isStreakActive = streakDates.includes(dateToCheckStr);
    const isSelected = dateToCheckStr === selectedDateStr;

    return { hasData: !!foundLog, logData: foundLog, isToday: dateToCheckStr === todayStr, isStreakActive, isSelected, fullDate: dateToCheckStr };
  };

  const handleDateClick = (dayStatus) => {
    setSelectedDateStr(dayStatus.fullDate);
    
    // Jika ada datanya, buka modal detail
    if (dayStatus.hasData && dayStatus.logData) {
        prepareModalData(dayStatus.logData);
    } else {
        // Jika kosong, tutup modal (atau biarkan user tahu kosong)
        setShowDetailModal(false);
    }
  };

  const prepareModalData = (logEntry) => {
      const type = moodTypes.find(t => t.id === logEntry.moodTypeId);
      
      // Map Tag IDs ke Tag Names
      let tags = [];
      if (logEntry.moodLogTags && Array.isArray(logEntry.moodLogTags)) {
          tags = logEntry.moodLogTags.map(t => {
              const fullTag = allTags.find(at => at.id === t.feelingTagId);
              return fullTag ? fullTag.tagName : null;
          }).filter(Boolean);
      }

      setSelectedLog({
          ...logEntry,
          moodName: type ? type.moodName : "Unknown",
          iconUrl: type ? type.iconUrl : null,
          displayTags: tags,
          formattedDate: new Date(logEntry.logDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })
      });
      setShowDetailModal(true);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans pb-20">

      {/* --- MODAL DETAIL --- */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-4xl p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-20">
                    <X size={20} className="text-slate-500" />
                </button>
                
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-blue-50 to-white z-0"></div>

                <div className="relative z-10 flex flex-col items-center text-center mt-2">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{selectedLog.formattedDate}</span>
                    
                    {/* Icon */}
                    <div className="w-24 h-24 mb-4 drop-shadow-xl">
                        {selectedLog.iconUrl ? (
                            <img src={selectedLog.iconUrl} alt="Mood" className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-slate-200 rounded-full animate-pulse"></div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-6">{selectedLog.moodName}</h2>

                    {/* Tags */}
                    {selectedLog.displayTags && selectedLog.displayTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {selectedLog.displayTags.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Journal Note */}
                    <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left">
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-1">
                            <Calendar size={12} /> Journal Note
                        </p>
                        <p className="text-slate-700 text-sm leading-relaxed italic">
                            {selectedLog.journalNote ? `"${selectedLog.journalNote}"` : "No note added."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* TOP: CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">Recent Moods</h2>
            <div className="h-62.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis hide domain={[0, 6]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold text-slate-800 mb-4 self-start w-full">Mood Count</h2>
            <div className="h-50 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="text-3xl font-bold text-slate-700">{moodHistory.length}</span>
                    <p className="text-xs text-slate-400 font-medium uppercase">Total</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
                {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        {entry.name}
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* MIDDLE: DATE STRIP (LOGIC DARI HOME) */}
        <div className="relative group mb-8">
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-20 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white shadow text-slate-600 hover:scale-110"><ChevronLeft size={18} /></button>
            
            <div ref={scrollRef} className="w-full flex items-end gap-3 overflow-x-auto md:overflow-x-hidden py-4 px-2 scroll-smooth no-scrollbar snap-x snap-mandatory">
            {daysInMonth.map((day) => {
                const status = getDayStatus(day);
                
                // --- LOGIC WARNA (SAMA KAYAK HOME) ---
                let bgClass = "bg-slate-200 text-slate-400"; 
                let scaleClass = "scale-100";
                
                if (status.isStreakActive) {
                    // Warna Oranye (Streak > 3 hari)
                    bgClass = "bg-orange-500 text-white shadow-lg shadow-orange-500/40";
                } else if (status.hasData) {
                    // Warna Biru (Ada data tapi < 3 hari)
                    bgClass = "bg-sky-400 text-white shadow-md shadow-sky-400/30";
                }

                if (status.isSelected) {
                    scaleClass = "scale-110 -translate-y-1 ring-2 ring-slate-800 ring-offset-2";
                }

                return (
                <div key={day} onClick={() => handleDateClick(status)} className="flex flex-col items-center min-w-14 snap-center cursor-pointer relative group/day z-10">
                    <div className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-300 border-2 border-transparent ${bgClass} ${scaleClass}`}>
                    {day}
                    </div>
                    {/* Indikator titik kecil jika ada note */}
                    {status.hasData && status.logData?.journalNote && (
                        <div className="absolute -bottom-2 w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    )}
                </div>
                );
            })}
            </div>
            
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-20 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white shadow text-slate-600 hover:scale-110"><ChevronRight size={18} /></button>
        </div>

        {/* BOTTOM: JOURNAL LIST */}
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-800 px-2">History Log</h3>
            {[...moodHistory].reverse().map((log) => {
                const type = moodTypes.find(t => t.id === log.moodTypeId);
                const icon = type ? type.iconUrl : null;
                const name = type ? type.moodName : "Unknown";
                const dateObj = new Date(log.logDate);
                const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

                return (
                    <div key={log.id} onClick={() => prepareModalData(log)} className="cursor-pointer bg-blue-50/50 border border-blue-100 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-white hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4 min-w-50">
                             {icon ? <img src={icon} alt={name} className="w-12 h-12 object-contain" /> : <div className="w-12 h-12 bg-gray-200 rounded-full"></div>}
                             <div>
                                <h4 className="font-bold text-slate-800 text-lg">{name}</h4>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{dayName}</span>
                             </div>
                        </div>
                        <div className="flex-1 bg-white/60 rounded-xl p-3 text-sm text-slate-600 leading-relaxed border border-blue-100/50 w-full">
                            {log.journalNote ? <p className="line-clamp-2">{log.journalNote}</p> : <span className="italic text-slate-400">No note.</span>}
                        </div>
                    </div>
                )
            })}
            
            {moodHistory.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <p>No mood data yet. Start tracking!</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default Report;