import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import api from "../api/axiosConfig";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Calendar,
  Smile,
  Frown,
  Meh,
  Lock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Report = () => {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodTypes, setMoodTypes] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // Chart Data
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [stabilityData, setStabilityData] = useState(null);
  const [triggersData, setTriggersData] = useState(null);
  const [activeTriggerTab, setActiveTriggerTab] = useState("negative"); // default negative

  // Calendar & Streak State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Modal Detail State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const COLORS = ["#3B82F6", "#64748B", "#EAB308", "#F97316", "#EC4899"];

  // --- CHART PROCESSING ---
  const processChartData = (history, types) => {
    const last7Days = history.slice(-7);
    const lineData = last7Days.map((item) => {
      const type = types.find((t) => t.id === item.moodTypeId);
      return {
        day: new Date(item.logDate).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        score: item.moodTypeId,
        moodName: type ? type.moodName : "Unknown",
      };
    });
    setChartData(lineData);

    const counts = {};
    history.forEach((item) => {
      const id = item.moodTypeId;
      counts[id] = (counts[id] || 0) + 1;
    });
    const pieChartData = Object.keys(counts).map((key) => {
      const type = types.find((t) => String(t.id) === String(key));
      return {
        name: type ? type.moodName : `Type ${key}`,
        value: counts[key],
        id: parseInt(key),
      };
    });
    setPieData(pieChartData);
  };

  // 🔥 OPTIMASI 1: Promise.all untuk mencegah Waterfall API Fetching
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [typesRes, tagsRes, moodRes, stabilityRes, triggersRes] =
        await Promise.all([
          api.get("/mood-type").catch(() => ({ data: { data: [] } })),
          api.get("/feelings").catch(() => ({ data: { data: [] } })),
          api.get("/mood").catch(() => ({ data: { data: [] } })),
          api
            .get("/analytics/stability")
            .catch(() => ({ data: { data: null } })),
          api
            .get("/analytics/top-triggers")
            .catch(() => ({ data: { data: null } })),
        ]);

      const typesData = typesRes.data.data || [];
      const tagsData = tagsRes.data.data || [];
      const historyData = moodRes.data.data || [];
      const stability = stabilityRes.data.data || null;

      setMoodTypes(typesData);
      setAllTags(tagsData);
      setStabilityData(stability);
      setTriggersData(triggersRes.data?.data || null);

      const sortedHistory = [...historyData].sort(
        (a, b) => new Date(a.logDate) - new Date(b.logDate),
      );
      setMoodHistory(sortedHistory);

      processChartData(sortedHistory, typesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- CALENDAR GRID GENERATION ---
  useEffect(() => {
    const now = currentDate; // Use currentDate for calendar generation
    const year = now.getFullYear();
    const month = now.getMonth();

    const days = [];
    // Get start of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Days from previous month to fill the first row
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        currentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Days of current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Days from next month to fill the grid (42 cells total for 6 rows, or 35 for 5)
    // Let's stick to a standard 6-row grid (42 cells) to handle all month start/end combos
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    setDaysInMonth(days);
  }, [currentDate]);

  // Calendar Navigation
  const prevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  // 🔥 OPTIMASI 2: Hash Map untuk pencarian data kalender O(1)
  const historyDict = useMemo(() => {
    const dict = {};
    moodHistory.forEach((log) => {
      const dateStr = new Date(log.logDate).toLocaleDateString("en-CA");
      dict[dateStr] = {
        ...log,
        mood_name:
          moodTypes.find((type) => type.id === log.moodTypeId)?.moodName ||
          "Unknown",
      };
    });
    return dict;
  }, [moodHistory, moodTypes]);

  const prepareModalData = (logEntry) => {
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
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    });
    setShowDetailModal(true);
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
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-20"
            >
              <X size={20} className="text-slate-500" />
            </button>

            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-blue-50 to-white z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center mt-2">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                {selectedLog.formattedDate}
              </span>

              <div className="w-24 h-24 mb-4 drop-shadow-xl">
                {selectedLog.iconUrl ? (
                  <img
                    src={selectedLog.iconUrl}
                    alt="Mood"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 rounded-full animate-pulse"></div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {selectedLog.moodName}
              </h2>

              {selectedLog.displayTags &&
                selectedLog.displayTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {selectedLog.displayTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

              <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-1">
                  <Calendar size={12} /> Journal Note
                </p>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  {selectedLog.journalNote
                    ? `"${selectedLog.journalNote}"`
                    : "No note added."}
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
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              Recent Moods
            </h2>
            <div className="h-62.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis hide domain={[0, 6]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#6366f1",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold text-slate-800 mb-4 self-start w-full">
              Mood Count
            </h2>
            <div className="h-50 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-3xl font-bold text-slate-700">
                    {moodHistory.length}
                  </span>
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Total
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {pieData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-xs text-slate-500"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- MOOD STABILITY CARD --- */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Mood Stability
            </h2>
            {stabilityData && (
              <span className="text-xs font-bold tracking-wide text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase">
                {stabilityData.period}
              </span>
            )}
          </div>

          {stabilityData ? (
            <div className="relative min-h-[220px] flex items-center">
              {/* --- Content Layer (Real or Dummy) --- */}
              <div
                className={`w-full transition-all duration-500 ${!stabilityData.isEnoughData ? "filter blur-md opacity-40 select-none pointer-events-none grayscale-50" : ""}`}
              >
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 justify-start">
                  {/* Donut Chart */}
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="80"
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="10"
                      />
                      {/* Render Chart */}
                      <circle
                        cx="50%"
                        cy="50%"
                        r="80"
                        fill="transparent"
                        stroke={
                          (stabilityData.isEnoughData
                            ? stabilityData.stabilityScore
                            : 85) > 75
                            ? "#22c55e"
                            : (stabilityData.isEnoughData
                                  ? stabilityData.stabilityScore
                                  : 85) > 40
                              ? "#eab308"
                              : "#ef4444"
                        }
                        strokeWidth="10"
                        strokeDasharray={502} /* 2 * PI * 80 approx 502 */
                        strokeDashoffset={
                          502 -
                          (502 *
                            (stabilityData.isEnoughData
                              ? stabilityData.stabilityScore
                              : 85)) /
                            100
                        }
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className={`text-5xl font-black tracking-tighter ${
                          (stabilityData.isEnoughData
                            ? stabilityData.stabilityScore
                            : 85) > 75
                            ? "text-green-500"
                            : (stabilityData.isEnoughData
                                  ? stabilityData.stabilityScore
                                  : 85) > 40
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {stabilityData.isEnoughData
                          ? stabilityData.stabilityScore
                          : 85}
                      </span>
                      <span className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">
                        / 100
                      </span>
                    </div>
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 text-center md:text-left max-w-lg">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                      {stabilityData.isEnoughData
                        ? stabilityData.stabilityLabel
                        : "Mood Sangat Stabil"}
                    </h3>
                    <p className="text-slate-500 text-base leading-relaxed mb-6">
                      Your mood stability score is calculated based on the
                      variance of your mood logs over the last 30 days. A higher
                      score indicates more stable moods.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 flex flex-col min-w-[100px]">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-0.5">
                          Total Logs
                        </span>
                        <span className="text-xl font-bold text-slate-700">
                          {stabilityData.isEnoughData
                            ? stabilityData.totalLogs
                            : 30}
                        </span>
                      </div>

                      {!stabilityData.isEnoughData && (
                        <div className="bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100 flex flex-col min-w-[100px]">
                          <span className="text-[10px] text-blue-400 uppercase font-extrabold tracking-widest mb-0.5">
                            Target
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            4+ Logs
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Overlay (Only if Not Enough Data) --- */}
              {!stabilityData.isEnoughData && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-sm transition-all duration-300">
                  <div className="bg-white p-4 rounded-full shadow-xl shadow-slate-200/50 mb-4 text-orange-500 animate-bounce-slow border border-orange-50">
                    <Lock size={28} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Analisis Belum Tersedia
                  </h3>
                  <p className="text-slate-600 font-medium max-w-sm leading-relaxed">
                    {stabilityData.stabilityLabel ||
                      "Catat mood-mu minimal 4 kali minggu ini untuk membuka fitur ini."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-300 animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
              <span className="font-medium">Loading stability data...</span>
            </div>
          )}
        </div>

        {/* --- TOP TRIGGERS CARD --- */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Pemicu Emosi
              </h2>
              <p className="text-slate-500 text-sm">
                {activeTriggerTab === "positive" &&
                  "Pemicu kebahagiaan terbesarmu"}
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

          <div className="min-h-[200px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 animate-pulse">
                Loading triggers...
              </div>
            ) : triggersData && triggersData[activeTriggerTab] ? (
              triggersData[activeTriggerTab].isEnoughData ? (
                <div className="flex flex-col gap-4">
                  {triggersData[activeTriggerTab].tags.map((tag, idx) => {
                    let barColor = "bg-slate-200";
                    if (activeTriggerTab === "positive")
                      barColor = "bg-green-500";
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

        {/* --- MOOD CALENDAR (Replaces Date Strip & History Log) --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((dayItem, idx) => {
                const dateStr = dayItem.date.toLocaleDateString("en-CA");
                const log = historyDict[dateStr];
                const isToday =
                  new Date().toLocaleDateString("en-CA") === dateStr;

                // Determine Styling based on Mood
                let bgClass = "bg-white hover:bg-slate-50";
                let textClass = "text-slate-600";
                let dotClass = null; // No dot by default

                if (log) {
                  const moodName = log.mood_name;
                  // Map mood names to colors (Approximate based on 5-scale)
                  if (
                    moodName === "Very Happy" ||
                    moodName === "Sangat Senang"
                  ) {
                    bgClass = "bg-green-100 hover:bg-green-200 ring-green-200";
                    textClass = "text-green-700 font-bold";
                    dotClass = "bg-green-500";
                  } else if (moodName === "Happy" || moodName === "Senang") {
                    bgClass = "bg-blue-100 hover:bg-blue-200 ring-blue-200";
                    textClass = "text-blue-700 font-bold";
                    dotClass = "bg-blue-500";
                  } else if (moodName === "Neutral" || moodName === "Biasa") {
                    bgClass = "bg-slate-100 hover:bg-slate-200 ring-slate-200";
                    textClass = "text-slate-700 font-bold";
                    dotClass = "bg-slate-500";
                  } else if (moodName === "Sad" || moodName === "Sedih") {
                    bgClass =
                      "bg-yellow-100 hover:bg-yellow-200 ring-yellow-200";
                    textClass = "text-yellow-700 font-bold";
                    dotClass = "bg-yellow-500";
                  } else if (
                    moodName === "Very Sad" ||
                    moodName === "Sangat Sedih"
                  ) {
                    bgClass = "bg-red-100 hover:bg-red-200 ring-red-200";
                    textClass = "text-red-700 font-bold";
                    dotClass = "bg-red-500";
                  } else {
                    // Fallback
                    bgClass = "bg-indigo-50 hover:bg-indigo-100";
                    textClass = "text-indigo-700";
                    dotClass = "bg-indigo-400";
                  }
                } else if (!dayItem.currentMonth) {
                  textClass = "text-slate-300";
                  bgClass = "bg-transparent";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      /* 
                                      Trigger Modal Logic existing in Report.jsx
                                      Usually it might be setSelectedDate or similar.
                                      For now we just log, or try to use existing function if known.
                                      Existing code used handleDateClick or prepareModalData.
                                    */
                      if (log) {
                        prepareModalData(log);
                      } else {
                        // handleDateClick({ fullDate: dateStr, hasData: false, logData: null });
                        console.log("No data for", dateStr);
                      }
                    }}
                    className={`
                                    relative aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                                    ${bgClass}
                                    ${!log && dayItem.currentMonth ? "hover:scale-105 hover:shadow-md border border-transparent hover:border-slate-100" : ""}
                                    ${log ? "hover:scale-105 hover:shadow-md ring-0 hover:ring-2" : ""}
                                    ${isToday && !log ? "ring-2 ring-slate-200" : ""}
                                `}
                  >
                    <span
                      className={`text-sm ${textClass} ${dayItem.currentMonth ? "" : "opacity-50"}`}
                    >
                      {dayItem.day}
                    </span>

                    {/* Mood Dot Indicator */}
                    {dotClass && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${dotClass}`}
                      ></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend / Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-center gap-6 text-xs text-slate-500 font-medium overflow-x-auto">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>Very
              Happy
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>Happy
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400"></div>Neutral
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>Sad
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>Very Sad
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;
