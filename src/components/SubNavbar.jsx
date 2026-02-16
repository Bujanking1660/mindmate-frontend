import { NavLink } from "react-router-dom";
import { Home, BarChart2 } from "lucide-react";

export const SubNavbar = () => {
  const commonStyle =
    "flex items-center gap-2 font-medium transition-all pb-2 border-b-2";

  const inactiveStyle = "text-gray-400 border-transparent hover:text-[#1E293B]";
  const activeStyle = "text-[#1E293B] font-bold border-[#1E293B]";

  return (
    <div className="flex justify-center gap-8 md:gap-12 mb-6 mt-4">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${commonStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <Home size={20} /> <span>Home</span>
      </NavLink>

      <NavLink
        to="/report"
        className={({ isActive }) =>
          `${commonStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <BarChart2 size={20} /> <span>Report</span>
      </NavLink>
    </div>
  );
};
