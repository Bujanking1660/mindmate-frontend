import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3B82F6", "#64748B", "#EAB308", "#F97316", "#EC4899"];

const ReportCharts = ({ moodHistory, moodTypes }) => {
  // Process Data inside Component
  const { lineData, pieData } = useMemo(() => {
    const last7Days = moodHistory.slice(-7);
    const line = last7Days.map((item) => {
      const type = moodTypes.find((t) => t.id === item.moodTypeId);
      return {
        day: new Date(item.logDate).toLocaleDateString("en-US", { weekday: "short" }),
        score: item.moodTypeId,
        moodName: type ? type.moodName : "Unknown",
      };
    });

    const counts = {};
    moodHistory.forEach((item) => counts[item.moodTypeId] = (counts[item.moodTypeId] || 0) + 1);
    
    const pie = Object.keys(counts).map((key) => {
      const type = moodTypes.find((t) => String(t.id) === String(key));
      return { name: type ? type.moodName : `Type ${key}`, value: counts[key] };
    });

    return { lineData: line, pieData: pie };
  }, [moodHistory, moodTypes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Line Chart */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Moods</h2>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={10} />
              <YAxis hide domain={[0, 6]} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
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
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="text-center">
               <span className="text-3xl font-bold text-slate-700">{moodHistory.length}</span>
               <p className="text-xs text-slate-400 font-medium uppercase">Total</p>
             </div>
          </div>
        </div>
        {/* Legend */}
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
  );
};

export default ReportCharts;