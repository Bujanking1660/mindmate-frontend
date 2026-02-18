import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axiosConfig";
import DashboardSkeleton from "../Home/components/DashboardSkeleton";
import ReportCharts from "./components/ReportCharts";
import MoodStabilityCard from "./components/MoodStabilityCard";
import MoodTriggersCard from "./components/MoodTriggersCard";
import MoodCalendar from "./components/MoodCalendar";
import LogDetailModal from "./components/LogDetailModal";

const Report = () => {
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodTypes, setMoodTypes] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [stabilityData, setStabilityData] = useState(null);
  const [triggersData, setTriggersData] = useState(null);

  // Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // --- 1. DATA FETCHING ---
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [typesRes, tagsRes, moodRes, stabilityRes, triggersRes] = await Promise.all([
        api.get("/mood-type").catch(() => ({ data: { data: [] } })),
        api.get("/feelings").catch(() => ({ data: { data: [] } })),
        api.get("/mood").catch(() => ({ data: { data: [] } })),
        api.get("/analytics/stability").catch(() => ({ data: { data: null } })),
        api.get("/analytics/top-triggers").catch(() => ({ data: { data: null } })),
      ]);

      setMoodTypes(typesRes.data.data || []);
      setAllTags(tagsRes.data.data || []);
      setStabilityData(stabilityRes.data.data || null);
      setTriggersData(triggersRes.data?.data || null);

      const sortedHistory = (moodRes.data.data || []).sort(
        (a, b) => new Date(a.logDate) - new Date(b.logDate)
      );
      setMoodHistory(sortedHistory);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- 2. MODAL HANDLER ---
  const handleLogClick = (logEntry) => {
    const type = moodTypes.find((t) => t.id === logEntry.moodTypeId);
    let tags = [];
    if (logEntry.moodLogTags && Array.isArray(logEntry.moodLogTags)) {
      tags = logEntry.moodLogTags
        .map((t) => {
          const fullTag = allTags.find((at) => at.id === t.feelingTagId);
          return fullTag ? fullTag.tagName : null;
        })
        .filter(Boolean);
    }

    setSelectedLog({
      ...logEntry,
      moodName: type ? type.moodName : "Unknown",
      iconUrl: type ? type.iconUrl : null,
      displayTags: tags,
      formattedDate: new Date(logEntry.logDate).toLocaleDateString("en-US", {
        weekday: "long", day: "numeric", month: "long",
      }),
    });
    setShowDetailModal(true);
  };
  
  return (
    <div className="min-h-screen bg-transparent font-sans pb-20">
      
      {/* Modal Overlay */}
      <LogDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        data={selectedLog} 
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* LOGIKA PERBAIKAN DI SINI */}
        {loading ? (
            // 1. Jika Loading: Tampilkan Skeleton SAJA
            <DashboardSkeleton />
        ) : (
            // 2. Jika Selesai Loading: Tampilkan Konten Asli
            <div className="animate-in fade-in duration-500 space-y-6">
                
                {/* Charts Section */}
                <ReportCharts moodHistory={moodHistory} moodTypes={moodTypes} />

                {/* Stability Section */}
                <MoodStabilityCard stabilityData={stabilityData} />

                {/* Triggers Section */}
                <MoodTriggersCard triggersData={triggersData} />

                {/* Calendar Section */}
                <MoodCalendar 
                    moodHistory={moodHistory} 
                    moodTypes={moodTypes} 
                    onDayClick={handleLogClick} 
                />
            </div>
        )}

      </main>
    </div>
  );
};

export default Report;