import { NavLink } from "react-router-dom";
import { Home, BarChart2 } from "lucide-react";

export const SubNavbar = () => {
  // Base Style untuk Container Kapsul
  const containerStyle = "inline-flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-full border border-slate-200 shadow-inner";

  // Style untuk setiap item
  const itemStyle = "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out";
  
  // Active State: Putih, Shadow, Teks Gelap
  const activeClass = "bg-white text-slate-900 shadow-sm shadow-slate-200 ring-1 ring-black/5 scale-100";
  
  // Inactive State: Transparan, Teks Abu
  const inactiveClass = "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50";

  return (
    <div className="sticky top-16 z-40 w-full flex justify-center py-6 bg-linear-to-b from-slate-50/50 to-transparent pointer-events-none">
      <div className={`pointer-events-auto ${containerStyle}`}>
        
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${itemStyle} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Home size={18} strokeWidth={2.5} className="mb-0.5" /> 
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/report"
          className={({ isActive }) =>
            `${itemStyle} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <BarChart2 size={18} strokeWidth={2.5} className="mb-0.5" /> 
          <span>Report</span>
        </NavLink>

      </div>
    </div>
  );
};