import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, Trash2, Menu, Pencil } from "lucide-react"; 
import api from "../api/axiosConfig"; 

// --- SKELETON COMPONENT (Untuk Layout Shift/CLS) ---
const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-pulse">
    <div className="lg:col-span-4 bg-slate-100 rounded-[2.5rem] h-125 p-8 flex flex-col items-center">
      <div className="w-full h-8 bg-slate-200 rounded mb-8"></div>
      <div className="w-36 h-36 bg-slate-200 rounded-full mb-8"></div>
      <div className="w-full h-10 bg-slate-200 rounded"></div>
    </div>
    <div className="lg:col-span-8 flex flex-col gap-6">
      <div className="bg-slate-100 rounded-[2.5rem] h-48 w-full"></div>
      <div className="bg-slate-100 rounded-[2.5rem] grow w-full"></div>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // =========================================
  // 1. STATE MANAGEMENT
  // =========================================
  const [moodHistory, setMoodHistory] = useState([]); 
  const [moodTypes, setMoodTypes] = useState([]); 
  const [allTags, setAllTags] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);

  // View State
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toLocaleDateString('en-CA')); 
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [selectedMood, setSelectedMood] = useState(null); 
  const [selectedTagIds, setSelectedTagIds] = useState([]); 
  const [moodNote, setMoodNote] = useState("");

  // =========================================
  // 2. MEMOIZED STYLES & PRELOAD
  // =========================================
  const moodStyles = useMemo(() => ({
    "0": { textColor: "text-[#FFFFFF]", bgGradient: "from-[#7F1D1D] to-[#B91C1C]", shadowColor: "shadow-[#000]/50", image: "/very_sad.png" }, 
    "1": { textColor: "text-[#1F2937]", bgGradient: "from-[#C2410C  ] to-[#FDBA74]", shadowColor: "shadow-[#000]/25", image: "/sad.png" }, 
    "2": { textColor: "text-[#0F172A]", bgGradient: "from-[#1E3A8A ] to-[#60A5FA]", shadowColor: "shadow-[#000000]/20", image: "/normal.png" }, 
    "3": { textColor: "text-[#064E3B]", bgGradient: "from-[#166534 ] to-[#4ADE80]", shadowColor: "shadow-[#000000]/15", image: "/happy.png" }, 
    "4": { textColor: "text-[#083344]", bgGradient: "from-[#0891B2 ] to-[#67E8F9]", shadowColor: "shadow-[#000]/15", image: "/very_happy.png" }  
  }), []);

  const getMoodStyle = useCallback((id) => {
    return moodStyles[id] || moodStyles[2];
  }, [moodStyles]);

  // OPTIMASI LCP: Preload Gambar di Background
  useEffect(() => {
    Object.values(moodStyles).forEach(style => {
        const img = new Image();
        img.src = style.image;
    });
  }, [moodStyles]);

  // =========================================
  // 3. FETCH DATA (LCP FIX: PARALLEL)
  // =========================================
  useEffect(() => {
    const loadData = async () => {
        if (!localStorage.getItem("user_token")) {
            navigate("/login");
            return;
        }

        setIsLoading(true);
        try {
            // Parallel Request: Jalan barengan biar ngebut
            const [typesRes, tagsRes, moodRes] = await Promise.all([
                api.get("/mood-type"),
                api.get("/feelings"),
                api.get("/mood")
            ]);

            setMoodTypes(typesRes.data.data || []);
            setAllTags(tagsRes.data.data || []);
            setMoodHistory(moodRes.data.data || []);
        } catch (error) {
            console.error("Gagal memuat data:", error);
            if (error.response?.status === 401) navigate("/login");
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, [navigate]);

  // =========================================
  // 4. AUTO OPEN MODAL (UX FEATURE)
  // =========================================
  useEffect(() => {
    if (!isLoading && moodHistory.length >= 0) {
      const todayStr = new Date().toLocaleDateString('en-CA');
      const hasTodayData = moodHistory.some(item => 
          new Date(item.logDate).toLocaleDateString('en-CA') === todayStr
      );

      // Jika belum ada data hari ini, buka modal
      if (!hasTodayData) {
          setIsEditing(false); 
          setSelectedMood(null); 
          setMoodNote(""); 
          setSelectedTagIds([]); 
          setShowMoodModal(true);
      }
    }
  }, [isLoading, moodHistory]); // Dependensi ke moodHistory biar akurat

  // =========================================
  // 5. COMPUTED DATA
  // =========================================
  const daysInMonth = useMemo(() => {
    const now = new Date();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Array.from({ length: totalDays }, (_, i) => i + 1);
  }, []);

  const streakDates = useMemo(() => {
    if (!moodHistory.length) return [];
    const loggedDates = new Set(moodHistory.map(item => new Date(item.logDate).toLocaleDateString('en-CA')));
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    let checkDate = new Date();
    if (!loggedDates.has(todayStr)) checkDate.setDate(checkDate.getDate() - 1); 
    
    let tempStreak = [];
    while (true) {
        const dStr = checkDate.toLocaleDateString('en-CA');
        if (loggedDates.has(dStr)) {
            tempStreak.push(dStr);
            checkDate.setDate(checkDate.getDate() - 1);
        } else { break; }
    }
    return tempStreak.length >= 3 ? tempStreak : [];
  }, [moodHistory]);

  const dailyData = useMemo(() => {
    const isToday = selectedDateStr === new Date().toLocaleDateString('en-CA');
    const moodEntry = moodHistory.find(item => 
        new Date(item.logDate).toLocaleDateString('en-CA') === selectedDateStr
    );

    if (moodEntry) {
        const moodTypeInfo = moodTypes.find(t => String(t.id) === String(moodEntry.moodTypeId));
        const style = getMoodStyle(moodEntry.moodTypeId);
        
        let displayTags = [];
        if (moodEntry.moodLogTags && Array.isArray(moodEntry.moodLogTags)) {
            displayTags = moodEntry.moodLogTags.map(logItem => {
                const tagId = logItem.feelingTagId; 
                const foundTag = allTags.find(t => String(t.id) === String(tagId));
                return foundTag ? foundTag.tagName : null;
            }).filter(Boolean); 
        }

        return {
            id: moodEntry.id, 
            status: moodTypeInfo ? moodTypeInfo.moodName : "Unknown",
            time: new Date(moodEntry.createdAt || moodEntry.logDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            icon: style.image, 
            note: moodEntry.journalNote || "No note added.",
            textColor: style.textColor,
            bgGradient: style.bgGradient,
            shadowColor: style.shadowColor,
            tags: displayTags 
        };
    } else {
        const defaultStyle = getMoodStyle(2); 
        return {
            id: null,
            status: "No Data",
            time: "--:--",
            icon: defaultStyle.image, 
            note: isToday ? "You haven't logged your mood today." : "No data logged for this day.",
            textColor: "text-slate-400",
            bgGradient: "from-slate-50 to-white",
            shadowColor: "shadow-slate-200",
            tags: []
        };
    }
  }, [selectedDateStr, moodHistory, moodTypes, allTags, getMoodStyle]);

  const availableTags = useMemo(() => {
    if (!selectedMood) return [];
    return allTags.filter(tag => String(tag.moodTypeId) === String(selectedMood.id));
  }, [selectedMood, allTags]);

  // =========================================
  // 6. HANDLERS
  // =========================================
  const handleDateClick = useCallback((day) => {
    const now = new Date();
    setSelectedDateStr(new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString('en-CA'));
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTagIds(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
  };

  // HANDLER BARU: Smart Tag Transfer
  const handleMoodChange = (newMood) => {
    if (selectedMood && String(selectedMood?.id) === String(newMood.id)) return; 

    // 1. Ambil nama-nama tag yang sedang dipilih sekarang
    const currentTagNames = selectedTagIds.map(id => {
        const tag = allTags.find(t => t.id === id);
        return tag ? tag.tagName : null;
    }).filter(Boolean);

    // 2. Set mood baru
    setSelectedMood(newMood);

    // 3. Cari tag di mood baru yang namanya sama
    const availableTagsForNewMood = allTags.filter(t => String(t.moodTypeId) === String(newMood.id));
    const matchingTagIds = availableTagsForNewMood
        .filter(t => currentTagNames.includes(t.tagName))
        .map(t => t.id);

    // 4. Pilih otomatis tag yang match
    setSelectedTagIds(matchingTagIds);
  };

  const handleOpenCreateModal = () => {
    const isToday = selectedDateStr === new Date().toLocaleDateString('en-CA');
    if (isToday && dailyData.id === null) {
      setIsEditing(false); setSelectedMood(null); setMoodNote(""); setSelectedTagIds([]); setShowMoodModal(true);
    }
  };

  const handleEditClick = () => {
    const currentLog = moodHistory.find(m => m.id === dailyData.id);
    if (!currentLog) return;
    setIsEditing(true);
    setSelectedMood(moodTypes.find(mt => String(mt.id) === String(currentLog.moodTypeId)));
    setMoodNote(currentLog.journalNote || "");
    setSelectedTagIds(currentLog.moodLogTags ? currentLog.moodLogTags.map(t => t.feelingTagId) : []);
    setShowMoodModal(true);
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return;

    const payload = {
      moodTypeId: selectedMood.id,
      journalNote: moodNote,
      feelingTagIds: selectedTagIds
    };

    try {
      if (isEditing) {
          await api.put(`/mood/${dailyData.id}`, payload);
      } else {
          await api.post("/mood", { ...payload, logDate: new Date().toISOString() });
      }
      
      const { data } = await api.get("/mood");
      setMoodHistory(data.data || []);
      
      setShowMoodModal(false);
      setIsEditing(false);
      setSelectedTagIds([]);
      setMoodNote("");
    } catch (error) {
      console.error("Gagal save:", error);
      alert("Gagal menyimpan data.");
    }
  };

  const handleResetDaily = async () => {
    if(!dailyData.id) return;
    if(!window.confirm("Hapus data mood ini?")) return;

    try {
        await api.delete(`/mood/${dailyData.id}`);
        const { data } = await api.get("/mood");
        setMoodHistory(data.data || []);
    } catch (error) {
        console.error("Gagal hapus:", error);
        alert("Gagal menghapus data.");
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const isViewingToday = selectedDateStr === new Date().toLocaleDateString('en-CA');

  // =========================================
  // 7. RENDER UI
  // =========================================
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 font-sans text-slate-800 bg-transparent min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col gap-1 md:gap-2 mb-8">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">Mood Tracker</h1>
        <p className="text-sm md:text-lg text-slate-500 font-medium">Understand yourself better, one day at a time.</p>
      </div>

      {/* CALENDAR BAR */}
      <div className="relative group mb-8 h-24"> 
        <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-slate-600 hover:scale-110 hover:bg-white transition-all"><ChevronLeft size={20} /></button>
        
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
              <div key={day} onClick={() => handleDateClick(day)} className="flex flex-col items-center min-w-14 snap-center cursor-pointer relative group/day z-10">
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
        <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-slate-600 hover:scale-110 hover:bg-white transition-all"><ChevronRight size={20} /></button>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-500">
          
          {/* MAIN CARD: DAILY OVERVIEW */}
          <div className={`lg:col-span-4 relative overflow-hidden bg-linear-to-b ${dailyData.bgGradient} rounded-[2.5rem] p-8 shadow-xl ${dailyData.shadowColor} border border-white/40 flex flex-col items-center justify-start min-h-125 transition-all duration-500 hover:shadow-2xl`}>
            
            <div className="w-full flex justify-between items-center z-10 mb-8 h-10">
              <h3 className="font-medium text-2xl text-slate-900 tracking-tight">Daily Overview</h3>
              <div className="flex gap-2">
                  {dailyData.status !== "No Data" && isViewingToday ? (
                      <>
                          <button onClick={handleEditClick} className="p-2 bg-white/40 hover:bg-slate-900 hover:text-white rounded-full text-slate-600 transition-all backdrop-blur-sm"><Pencil size={20} /></button>
                          <button onClick={handleResetDaily} className="p-2 bg-white/40 hover:bg-red-500 hover:text-white rounded-full text-slate-600 transition-all backdrop-blur-sm"><Trash2 size={20} /></button>
                      </>
                  ) : (
                    isViewingToday && dailyData.status === "No Data" ? (
                       <button onClick={handleOpenCreateModal} className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-lg hover:bg-slate-700 transition-all">LOG NOW</button>
                    ) : (
                       <Menu size={24} className="text-slate-900 opacity-50"/>
                    )
                  )}
              </div>
            </div>

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
                        fetchPriority="high" // Prioritas Download Gambar
                        loading="eager"      // Langsung download (jangan lazy)
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

          {/* SIDE CARDS */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            <div className="bg-linear-to-b from-slate-50 to-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-white/60 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-slate-100 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="bg-white px-4 py-1.5 rounded-xl text-[10px] font-black shadow-sm text-slate-400 tracking-widest border border-slate-100">RECOMMENDED MODULE</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative z-10">
                <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-sm hover:shadow-lg hover:border-slate-200 border border-slate-100 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🧘</div>
                  <div><h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Maintain Focus</h4><p className="text-xs text-slate-400">10 min • Focus</p></div>
                </div>
                <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-sm hover:shadow-lg hover:border-slate-200 border border-slate-100 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🧠</div>
                  <div><h4 className="font-bold text-slate-800 text-sm group-hover:text-purple-600">Deep Learning</h4><p className="text-xs text-slate-400">25 min • Brain</p></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 grow border border-white/60 flex flex-col min-h-50 relative overflow-hidden group hover:shadow-2xl transition-shadow">
               <div className="absolute top-1/2 left-1/2 w-full h-full bg-slate-50/50 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-slate-100/50 transition-colors"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="bg-slate-100 px-4 py-1.5 rounded-xl text-[10px] font-black shadow-sm text-slate-500 tracking-widest">LATEST JOURNAL</span>
              </div>
              <div className="grow flex flex-col justify-center relative z-10">
                <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 relative">
                  <span className="absolute top-4 left-4 text-4xl text-slate-200 font-serif leading-none">“</span>
                  <p className={`text-sm md:text-lg font-medium leading-relaxed italic px-4 text-center ${dailyData.status === 'No Data' ? 'text-slate-400' : 'text-slate-700'}`}>
                    {dailyData.note}
                  </p>
                   <span className="absolute bottom-4 right-4 text-4xl text-slate-200 font-serif leading-none rotate-180">“</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INPUT */}
      {showMoodModal && (
        <div className="fixed inset-0 z-99 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[90vh]">
             <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-blue-50 to-white pointer-events-none"></div>
             <button onClick={() => {setShowMoodModal(false); setIsEditing(false);}} className="absolute top-4 right-4 z-20 p-2 bg-white/50 rounded-full hover:bg-slate-100 transition-colors">
                <span className="sr-only">Close</span>
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="relative z-10 text-center flex flex-col h-full overflow-y-auto no-scrollbar">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{isEditing ? "Edit Entry" : "How's your day?"}</h2>
                <p className="text-slate-500 text-sm mb-6">{isEditing ? "Update your mood details." : "Track your mood to build your streak."}</p>
                
                <div className="flex justify-between gap-1 mb-6 overflow-x-auto py-2 px-1 scrollbar-hide shrink-0">
                  {moodTypes.map((m) => {
                    const style = getMoodStyle(m.id);
                    const isSelected = selectedMood && String(selectedMood?.id) === String(m.id);
                    return (
                      // UPDATE: Menggunakan handleMoodChange untuk logic Smart Tag Transfer
                      <button key={m.id} onClick={() => handleMoodChange(m)} className={`group flex flex-col items-center gap-2 transition-all duration-200 p-2 rounded-2xl ${isSelected ? 'bg-slate-50 scale-110 -translate-y-1 ring-2 ring-slate-100' : 'opacity-60 hover:opacity-100 hover:bg-gray-50'}`}>
                        <img src={style.image} alt={m.moodName} width="48" height="48" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
                        <span className={`text-[10px] font-bold uppercase ${isSelected ? style.textColor : 'text-slate-400'}`}>{m.moodName}</span>
                      </button>
                    )
                  })}
                </div>

                {selectedMood && availableTags.length > 0 && (
                  <div className="mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <p className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">What are you feeling?</p>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {availableTags.map((tag) => {
                        const isSelected = selectedTagIds.includes(tag.id);
                        return (
                          <button key={tag.id} onClick={() => toggleTag(tag.id)} 
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 
                            ${isSelected 
                                ? `bg-slate-800 text-white border-slate-800 shadow-md transform scale-105` 
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                            }`}>
                            {tag.tagName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none mb-6 placeholder:text-slate-400 min-h-20" rows="3" placeholder="Why do you feel this way? (Optional)" value={moodNote} onChange={(e) => setMoodNote(e.target.value)}></textarea>
                <button onClick={handleSaveMood} disabled={!selectedMood} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 shrink-0">
                  <Check size={18} strokeWidth={3} /> {isEditing ? "Update Entry" : "Save Entry"}
                </button>
             </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;