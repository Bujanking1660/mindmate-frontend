import { NavLink } from "react-router-dom";
import { Home, BarChart2, Box } from "lucide-react";

export const SubNavbar = () => {
  const baseStyle =
    "flex items-center gap-2 font-medium text-gray-400 hover:text-[#1E293B] transition pb-2 border-b-2 border-transparent";
  const activeStyle = "text-[#1E293B] font-bold border-[#1E293B]";

  return (
    <div className="flex justify-center gap-8 md:gap-12 mb-6 mt-4">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? `${baseStyle} ${activeStyle}` : baseStyle
        }
      >
        <Home size={20} /> <span>Home</span>
      </NavLink>

      <NavLink
        to="/report"
        className={({ isActive }) =>
          isActive ? `${baseStyle} ${activeStyle}` : baseStyle
        }
      >
        <BarChart2 size={20} /> <span>Report</span>
      </NavLink>
    </div>
  );
};
