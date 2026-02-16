// src/pages/Home/components/SideWidgets.jsx
const SideWidgets = ({ dailyData }) => {
  return (
    <div className="lg:col-span-8 flex flex-col gap-6 h-full">
      {/* Recommended Module */}
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

      {/* Latest Journal */}
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
  );
};

export default SideWidgets;