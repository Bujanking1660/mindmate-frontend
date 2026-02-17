import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

// Components
import MoodCalendar from "./components/MoodCalendar";
import DailyOverviewCard from "./components/DailyOverviewCard";
import SideWidgets from "./components/SideWidgets";
import MoodInputModal from "./components/MoodInputModal";
import DashboardSkeleton from "./components/DashboardSkeleton"; 

const Home = () => {
  const navigate = useNavigate();

  // =========================================
  // 1. STATE MANAGEMENT (LOGIC TETAP SAMA)
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
  // 2. STYLES & PRELOAD (Updated Colors)
  // =========================================
  const moodStyles = useMemo(() => ({
    "0": { textColor: "text-red-900", bgGradient: "from-red-400 to-rose-600", shadowColor: "shadow-rose-500/40", image: "/very_sad.png", labelColor: "bg-red-100 text-red-700" },
    "1": { textColor: "text-orange-900", bgGradient: "from-orange-300 to-amber-500", shadowColor: "shadow-orange-500/40", image: "/sad.png", labelColor: "bg-orange-100 text-orange-700" },
    "2": { textColor: "text-blue-900", bgGradient: "from-blue-300 to-indigo-500", shadowColor: "shadow-blue-500/40", image: "/normal.png", labelColor: "bg-blue-100 text-blue-700" },
    "3": { textColor: "text-emerald-900", bgGradient: "from-emerald-300 to-green-500", shadowColor: "shadow-emerald-500/40", image: "/happy.png", labelColor: "bg-emerald-100 text-emerald-700" },
    "4": { textColor: "text-cyan-900", bgGradient: "from-cyan-300 to-blue-500", shadowColor: "shadow-cyan-500/40", image: "/very_happy.png", labelColor: "bg-cyan-100 text-cyan-700" }
  }), []);

  const getMoodStyle = useCallback((id) => {
    return moodStyles[id] || moodStyles[2];
  }, [moodStyles]);

  useEffect(() => {
    Object.values(moodStyles).forEach(style => {
      const img = new Image();
      img.src = style.image;
    });
  }, [moodStyles]);

  // =========================================
  // 3. FETCH DATA
  // =========================================
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("user_token");
      if (!token) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
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
  // 4. AUTO OPEN MODAL
  // =========================================
  useEffect(() => {
    if (!isLoading && moodHistory.length >= 0) {
      const todayStr = new Date().toLocaleDateString('en-CA');
      const hasTodayData = moodHistory.some(item =>
        new Date(item.logDate).toLocaleDateString('en-CA') === todayStr
      );

      if (!hasTodayData) {
        setIsEditing(false);
        setSelectedMood(null);
        setMoodNote("");
        setSelectedTagIds([]);
        setShowMoodModal(true);
      }
    }
  }, [isLoading, moodHistory]);

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
        labelColor: style.labelColor,
        tags: displayTags
      };
    } else {
      return {
        id: null,
        status: "No Data",
        time: "--:--",
        icon: null, // Handle null icon in card
        note: isToday ? "You haven't logged your mood today." : "No data logged for this day.",
        textColor: "text-slate-400",
        bgGradient: "from-slate-100 to-slate-200",
        shadowColor: "shadow-slate-200",
        labelColor: "bg-slate-100 text-slate-500",
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

  const handleMoodChange = (newMood) => {
    if (selectedMood && String(selectedMood?.id) === String(newMood.id)) return;
    const currentTagNames = selectedTagIds.map(id => {
      const tag = allTags.find(t => t.id === id);
      return tag ? tag.tagName : null;
    }).filter(Boolean);

    setSelectedMood(newMood);

    const availableTagsForNewMood = allTags.filter(t => String(t.moodTypeId) === String(newMood.id));
    const matchingTagIds = availableTagsForNewMood
      .filter(t => currentTagNames.includes(t.tagName))
      .map(t => t.id);

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
    if (!dailyData.id) return;
    if (!window.confirm("Hapus data mood ini?")) return;
    try {
      await api.delete(`/mood/${dailyData.id}`);
      const { data } = await api.get("/mood");
      setMoodHistory(data.data || []);
    } catch (error) {
      console.error("Gagal hapus:", error);
      alert("Gagal menghapus data.");
    }
  };

  const isViewingToday = selectedDateStr === new Date().toLocaleDateString('en-CA');

  // =========================================
  // 7. RENDER UI
  // =========================================
  return (
    <div className="min-h-screen font-sans pb-20 animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-96 bg-linear-to-b from-blue-50/50 to-transparent -z-10" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-2">
          <div>
             <h1 className="text-4xl font-black text-slate-800 tracking-tight">Halo, Apa Kabar?</h1>
             <p className="text-slate-500 font-medium text-lg mt-1">Lacak kebiasaan mood harian kamu disini.</p>
          </div>
          <div className="bg-white px-5 py-2 rounded-full shadow-sm border border-slate-100">
             <span className="text-sm font-bold text-slate-600">
                {new Date().toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
             </span>
          </div>
        </div>

        {/* CALENDAR */}
        <MoodCalendar 
          daysInMonth={daysInMonth}
          moodHistory={moodHistory}
          streakDates={streakDates}
          selectedDateStr={selectedDateStr}
          onDateClick={handleDateClick}
        />

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* MAIN CARD (Hero) - Span 5 */}
            <DailyOverviewCard 
              dailyData={dailyData}
              isViewingToday={isViewingToday}
              onEdit={handleEditClick}
              onDelete={handleResetDaily}
              onCreate={handleOpenCreateModal}
              selectedDateStr={selectedDateStr}
            />

            {/* SIDE WIDGETS - Span 7 */}
            <SideWidgets dailyData={dailyData} />
          </div>
        )}
      </main>

      {/* MODAL */}
      <MoodInputModal 
        isOpen={showMoodModal}
        onClose={() => {setShowMoodModal(false); setIsEditing(false);}}
        isEditing={isEditing}
        moodTypes={moodTypes}
        selectedMood={selectedMood}
        onMoodChange={handleMoodChange}
        getMoodStyle={getMoodStyle}
        availableTags={availableTags}
        selectedTagIds={selectedTagIds}
        onToggleTag={toggleTag}
        moodNote={moodNote}
        onNoteChange={setMoodNote}
        onSave={handleSaveMood}
      />
    </div>
  );
};

export default Home;