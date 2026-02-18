import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, Trash2, Menu, Pencil } from "lucide-react"; 
// Hapus import Flame karena tidak dipakai lagi
import api from "../api/axiosConfig"; 

const Home = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // =========================================
  // 1. STATE MANAGEMENT
  // =========================================
  
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]); 
  const [moodTypes, setMoodTypes] = useState([]); 
  const [allTags, setAllTags] = useState([]);     
  const [streakDates, setStreakDates] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // View & Modal State
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toLocaleDateString('en-CA')); 
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState(null); 
  const [availableTags, setAvailableTags] = useState([]); 
  const [selectedTagIds, setSelectedTagIds] = useState([]); 
  const [moodNote, setMoodNote] = useState("");

  // State Dashboard
  const [dailyData, setDailyData] = useState({
    id: null, 
    status: "No Data",
    time: "--:--",
    icon: null,
    note: "You haven't logged your mood today.",
    color: "text-slate-400",
    bgGradient: "transparent",
    tags: []
  });

  // =========================================
  // 2. STYLE MAPPING
  // =========================================
  const moodStyles = {
    1: { color: "text-blue-600",   bgGradient: "from-blue-200 to-blue-300" }, 
    2: { color: "text-slate-600",  bgGradient: "from-slate-200 to-slate-300" }, 
    3: { color: "text-yellow-600", bgGradient: "from-yellow-200 to-yellow-300" }, 
    4: { color: "text-orange-600", bgGradient: "from-orange-200 to-orange-300" }, 
    5: { color: "text-pink-600",   bgGradient: "from-pink-200 to-pink-300" }  
  };

  const getMoodStyle = (id) => {
    return moodStyles[id] || moodStyles[3]; 
  };

  // =========================================
  // 3. INITIAL LOAD
  // =========================================
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const now = new Date();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    setDaysInMonth(Array.from({ length: totalDays }, (_, i) => i + 1));

    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    setIsLoading(true);
    let typesData = [];
    let tagsData = [];

    try {
      const typesRes = await api.get("/mood-type");
      typesData = typesRes.data.data || [];
      setMoodTypes(typesData);
    } catch (error) {
      console.error("Gagal load mood types:", error);
    }

    try {
      const tagsRes = await api.get("/feelings"); 
      tagsData = tagsRes.data.data || [];
      setAllTags(tagsData);
    } catch (error) {
      console.warn("Gagal load feelings:", error);
    }

    await fetchMoodHistory(typesData, tagsData);
    setIsLoading(false);
  };

  const fetchMoodHistory = async (currentMoodTypes, currentTags) => {
    try {
      const response = await api.get("/mood");
      const history = response.data.data || []; 
      setMoodHistory(history);
      updateDashboardDisplay(selectedDateStr, history, currentMoodTypes, currentTags);
    } catch (error) {
      console.error("Gagal ambil history:", error);
    }
  };

  // =========================================
  // 4. CORE LOGIC: DISPLAY
  // =========================================
  const updateDashboardDisplay = (dateStr, historyData, typeData, tagData) => {
    const moodEntry = historyData.find(item => {
        return new Date(item.logDate).toLocaleDateString('en-CA') === dateStr;
    });

    const isToday = dateStr === new Date().toLocaleDateString('en-CA');

    if (moodEntry) {
        const moodTypeInfo = typeData.find(t => String(t.id) === String(moodEntry.moodTypeId));
        const style = getMoodStyle(moodEntry.moodTypeId);
        const displayIcon = moodTypeInfo?.iconUrl || null; 

        let displayTags = [];
        if (moodEntry.moodLogTags && Array.isArray(moodEntry.moodLogTags)) {
            displayTags = moodEntry.moodLogTags.map(logItem => {
                const tagId = logItem.feelingTagId; 
                const foundTag = tagData.find(t => String(t.id) === String(tagId));
                return foundTag ? foundTag.tagName : null;
            }).filter(Boolean); 
        }

        setDailyData({
          id: moodEntry.id, 
          status: moodTypeInfo ? moodTypeInfo.moodName : "Unknown",
          time: new Date(moodEntry.createdAt || moodEntry.logDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          icon: displayIcon,
          note: moodEntry.journalNote || "No note added.",
          color: style.color,
          bgGradient: style.bgGradient,
          tags: displayTags 
        });
        
        if (!isEditing) setShowMoodModal(false);

    } else {
        let defaultIconUrl = null;
        if(typeData.length > 0) {
            const middleIndex = Math.floor(typeData.length / 2);
            defaultIconUrl = typeData[middleIndex].iconUrl;
        }

        setDailyData({
            id: null,
            status: "No Data",
            time: "--:--",
            icon: defaultIconUrl, 
            note: isToday ? "You haven't logged your mood today." : "No data logged for this day.",
            color: "text-slate-400",
            bgGradient: "transparent",
            tags: []
        });

        if (isToday) {
            handleOpenCreateModal();
        } else {
            setShowMoodModal(false);
        }
    }
  };

  // =========================================
  // 5. HANDLERS
  // =========================================

  const handleDateClick = (day) => {
    const now = new Date();
    const clickedDate = new Date(now.getFullYear(), now.getMonth(), day);
    const dateStr = clickedDate.toLocaleDateString('en-CA');
    
    setSelectedDateStr(dateStr); 
    updateDashboardDisplay(dateStr, moodHistory, moodTypes, allTags);
  };

  useEffect(() => {
    if (selectedMood) {
      const filtered = allTags.filter(tag => String(tag.moodTypeId) === String(selectedMood.id));
      setAvailableTags(filtered);
      
      if(!isEditing && !selectedTagIds.length) {
          setSelectedTagIds([]); 
      }
    } else {
      setAvailableTags([]);
    }
  }, [selectedMood, allTags]);

  const toggleTag = (tagId) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId] 
    );
  };

  const handleOpenCreateModal = () => {
      setIsEditing(false);
      setSelectedMood(null);
      setMoodNote("");
      setSelectedTagIds([]);
      setShowMoodModal(true);
  };

  const handleEditClick = () => {
      const currentLog = moodHistory.find(m => m.id === dailyData.id);
      if (!currentLog) return;
      setIsEditing(true);
      const currentMoodType = moodTypes.find(mt => String(mt.id) === String(currentLog.moodTypeId));
      setSelectedMood(currentMoodType);
      setMoodNote(currentLog.journalNote || "");
      if (currentLog.moodLogTags && Array.isArray(currentLog.moodLogTags)) {
          const tagIds = currentLog.moodLogTags.map(t => t.feelingTagId);
          setSelectedTagIds(tagIds);
      } else {
          setSelectedTagIds([]);
      }
      setShowMoodModal(true);
  };

  // =========================================
  // 6. STREAK LOGIC (REVISI WARNA)
  // =========================================
  useEffect(() => {
    if (moodHistory.length > 0) {
      calculateStreak(moodHistory);
    }
  }, [moodHistory]);

  const calculateStreak = (history) => {
    const loggedDates = new Set(
      history.map(item => new Date(item.logDate).toLocaleDateString('en-CA'))
    );
    const todayStr = new Date().toLocaleDateString('en-CA');
    let currentDate = new Date();
    
    // Logic: Streak putus jika kemarin kosong DAN hari ini juga kosong
    if (!loggedDates.has(todayStr)) {
        currentDate.setDate(currentDate.getDate() - 1);
        const yesterdayStr = currentDate.toLocaleDateString('en-CA');
        if (!loggedDates.has(yesterdayStr)) {
            setStreakDates([]); // Putus total
            return;
        }
    } else {
        currentDate = new Date();
    }

    let tempStreak = [];
    // Hitung mundur (Backward Check)
    // Jika hari ini belum isi, kita cek dari kemarin agar streak visual tidak hilang
    let checkDate = new Date();
    if (!loggedDates.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const dateStr = checkDate.toLocaleDateString('en-CA');
        if (loggedDates.has(dateStr)) {
            tempStreak.push(dateStr); 
            checkDate.setDate(checkDate.getDate() - 1); 
        } else {
            break; 
        }
    }

    // ATURAN PENTING: Hanya set streak jika >= 3 hari
    // Jika < 3, array dikosongkan. Akibatnya warna akan fallback ke Biru (hasData)
    if (tempStreak.length >= 3) {
        setStreakDates(tempStreak);
    } else {
        setStreakDates([]); 
    }
  };

  // =========================================
  // 7. ACTIONS
  // =========================================

  const handleSaveMood = async () => {
    if (!selectedMood) return;
    const payload = {
      moodTypeId: selectedMood.id,
      journalNote: moodNote,
      feelingTagIds: selectedTagIds 
    };
    if (!isEditing) {
        payload.logDate = new Date().toISOString();
    }
    try {
      if (isEditing) {
          await api.put(`/mood/${dailyData.id}`, payload);
      } else {
          await api.post("/mood", payload);
      }
      await fetchMoodHistory(moodTypes, allTags);
      setShowMoodModal(false);
      setIsEditing(false);
      setSelectedTagIds([]);
      setMoodNote("");
    } catch (error) {
      console.error("Gagal save mood:", error);
      alert("Gagal menyimpan data.");
    }
  };

  const handleResetDaily = async () => {
    if(!dailyData.id) return;
    const confirmReset = window.confirm("Hapus data mood ini?");
    if(confirmReset) {
      try {
        await api.delete(`/mood/${dailyData.id}`);
        fetchMoodHistory(moodTypes, allTags); 
      } catch (error) {
        console.error("Gagal reset:", error);
        alert("Gagal hapus data.");
      }
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // --- LOGIC UI CALENDAR ---
  const getDayStatus = (day) => {
    const now = new Date();
    const dateToCheckStr = new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString('en-CA');
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    // Cek apakah tanggal ini ada datanya
    const hasData = moodHistory.some(item => 
       new Date(item.logDate).toLocaleDateString('en-CA') === dateToCheckStr
    );

    // Cek apakah tanggal ini bagian dari streak >= 3 hari
    const isStreakActive = streakDates.includes(dateToCheckStr);

    const isSelected = dateToCheckStr === selectedDateStr;

    return { hasData, isToday: dateToCheckStr === todayStr, isStreakActive, isSelected };
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        </div>
    );
  }

  const isViewingToday = selectedDateStr === new Date().toLocaleDateString('en-CA');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 font-sans text-slate-800 bg-transparent min-h-screen">
      
      {/* MODAL */}
      {showMoodModal && (isViewingToday || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
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
                    return (
                      <button key={m.id} onClick={() => setSelectedMood(m)} className={`group flex flex-col items-center gap-2 transition-all duration-200 p-2 rounded-2xl ${selectedMood?.id === m.id ? 'bg-blue-50 scale-110 -translate-y-1 ring-2 ring-blue-100' : 'opacity-60 hover:opacity-100 hover:bg-gray-50'}`}>
                        <img src={m.iconUrl} alt={m.moodName} className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
                        <span className={`text-[10px] font-bold uppercase ${selectedMood?.id === m.id ? 'text-blue-600' : 'text-slate-400'}`}>{m.moodName}</span>
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
                          <button key={tag.id} onClick={() => toggleTag(tag.id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${isSelected ? "bg-slate-800 text-white border-slate-800 shadow-md transform scale-105" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"}`}>
                            {tag.tagName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none mb-6 placeholder:text-slate-400 min-h-20" rows="3" placeholder="Why do you feel this way? (Optional)" value={moodNote} onChange={(e) => setMoodNote(e.target.value)}></textarea>
                <button onClick={handleSaveMood} disabled={!selectedMood} className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 shrink-0">
                  <Check size={18} strokeWidth={3} /> {isEditing ? "Update Entry" : "Save Entry"}
                </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 md:gap-2 mb-8">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">Mood Tracker</h1>
        <p className="text-sm md:text-lg text-slate-500 font-medium">Understand yourself better, one day at a time.</p>
      </div>

      {/* --- CALENDAR SCROLL (STREAK UI UPDATED) --- */}
      <div className="relative group mb-8">
        <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-slate-600 hover:scale-110 hover:bg-white transition-all"><ChevronLeft size={20} /></button>
        
        <div ref={scrollRef} className="w-full flex items-end gap-3 overflow-x-auto md:overflow-x-hidden py-6 px-2 md:px-8 scroll-smooth no-scrollbar snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {daysInMonth.map((day) => {
            const { hasData, isToday, isStreakActive, isSelected } = getDayStatus(day);
            
            // LOGIC WARNA BARU:
            // Default: Abu-abu (Kosong)
            let bgClass = "bg-slate-200 text-slate-400"; 
            let scaleClass = "scale-100";
            
            if (isStreakActive) {
                // KONDISI 1: Streak >= 3 hari -> Warna Oranye
                bgClass = "bg-orange-500 text-white shadow-lg shadow-orange-500/40";
            } else if (hasData) {
                // KONDISI 2: Ada Data tapi < 3 hari -> Warna Biru
                bgClass = "bg-sky-400 text-white shadow-md shadow-sky-400/30";
            }

            // Highlight jika dipilih (border/ring)
            if (isSelected) {
                scaleClass = "scale-110 -translate-y-1";
            }

            return (
              <div key={day} onClick={() => handleDateClick(day)} className="flex flex-col items-center min-w-14 snap-center cursor-pointer relative group/day z-10">
                
                {/* LINGKARAN TANGGAL (Tanpa Icon Api) */}
                <div className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-300 border-2
                  ${bgClass} 
                  ${scaleClass}
                  ${isSelected ? "border-slate-800" : "border-transparent"}
                  ${isToday && !hasData ? "ring-2 ring-blue-300 ring-offset-2" : ""}
                `}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>
        
        <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-slate-600 hover:scale-110 hover:bg-white transition-all"><ChevronRight size={20} /></button>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* CARD 1: DAILY OVERVIEW */}
        <div className={`lg:col-span-4 relative overflow-hidden bg-linear-to-b ${dailyData.bgGradient} rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-white/40 flex flex-col items-center justify-start min-h-125 transition-all duration-500 hover:shadow-2xl`}>
          <div className="w-full flex justify-between items-center z-10 mb-8">
            <h3 className="font-medium text-2xl text-slate-900 tracking-tight">Daily Overview</h3>
            <div className="flex gap-2">
                {dailyData.status !== "No Data" && isViewingToday ? (
                    <>
                        <button onClick={handleEditClick} className="p-2 bg-white/20 hover:bg-slate-900 hover:text-white rounded-full text-slate-600 transition-all backdrop-blur-sm" title="Edit Entry">
                            <Pencil size={20} />
                        </button>
                        <button onClick={handleResetDaily} className="p-2 bg-white/20 hover:bg-red-500 hover:text-white rounded-full text-slate-600 transition-all backdrop-blur-sm" title="Delete Entry">
                            <Trash2 size={20} />
                        </button>
                    </>
                ) : (
                    <Menu size={24} className="text-slate-900 opacity-50"/>
                )}
            </div>
          </div>

          <div className="flex flex-col items-center w-full z-10 grow">
            <h2 className="text-xl md:text-2xl text-slate-800 font-medium mb-4">
               {new Date(selectedDateStr).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h2>
            <div className="text-center mb-6">
                <h4 className={`text-3xl md:text-4xl font-bold ${dailyData.color} mb-1`}>{dailyData.status}</h4>
                <p className="text-sm font-medium text-slate-500">{dailyData.time}</p>
            </div>
            <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-500 mb-8">
               <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-75"></div>
               {dailyData.icon ? (
                    <img src={dailyData.icon} alt="Mood Icon" className={`w-36 h-36 md:w-44 md:h-44 relative z-10 drop-shadow-2xl object-contain ${dailyData.status === 'No Data' ? 'opacity-30 grayscale blur-[2px]' : ''}`} draggable={false} />
               ) : (
                   <div className="w-36 h-36 md:w-44 md:h-44 bg-slate-200/50 rounded-full animate-pulse relative z-10"></div>
               )}
            </div>
            <div className="w-full mt-auto">
                {dailyData.tags && dailyData.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-3 justify-center w-full">
                        {dailyData.tags.map((tag, idx) => (
                        <span key={idx} className="bg-white text-slate-700 px-6 py-2 rounded-full text-sm font-semibold shadow-sm border border-slate-200 min-w-25 text-center">{tag}</span>
                        ))}
                    </div>
                ) : (
                     <div className="flex flex-wrap gap-3 justify-center w-full opacity-50">
                        <div className="bg-white/50 h-10 w-24 rounded-full border border-slate-300/50"></div>
                        <div className="bg-white/50 h-10 w-24 rounded-full border border-slate-300/50"></div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          {/* Card 2: Modules */}
          <div className="bg-linear-to-b from-blue-50 to-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 border border-white/60 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className="bg-white px-4 py-1.5 rounded-xl text-[10px] font-black shadow-sm text-slate-400 tracking-widest border border-slate-100">RECOMMENDED MODULE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative z-10">
              <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-sm hover:shadow-lg hover:border-blue-200 border border-slate-100 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🧘</div>
                <div><h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Maintain Focus</h4><p className="text-xs text-slate-400">10 min • Focus</p></div>
              </div>
              <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-sm hover:shadow-lg hover:border-blue-200 border border-slate-100 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🧠</div>
                <div><h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Deep Learning</h4><p className="text-xs text-slate-400">25 min • Brain</p></div>
              </div>
            </div>
          </div>

          {/* Card 3: Journaling */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-blue-900/5 grow border border-white/60 flex flex-col min-h-50 relative overflow-hidden group hover:shadow-2xl transition-shadow">
             <div className="absolute top-1/2 left-1/2 w-full h-full bg-slate-50/50 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-blue-50/50 transition-colors"></div>
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
    </main>
  );
};

export default Home;