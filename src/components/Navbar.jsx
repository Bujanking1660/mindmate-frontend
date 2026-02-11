import { User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import api from '../api/axiosConfig';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
        await api.post("/auth/logout"); 
    } catch (error) {
        console.warn("Logout server gagal, melanjutkan hapus sesi lokal...", error);
    } finally {
        localStorage.removeItem("user_token");
        // Hapus data user lain jika ada
        navigate("/login");
    }
  };

  return (
    <nav className="w-full h-16 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-between items-center sticky top-0 z-50">
      {/* Kiri: Logo */}
      <div className="flex items-center gap-2">
        <img src="/icon.png" alt="logo" className="w-8 h-8 object-contain" />
        <span className="font-bold text-[#1E293B] hidden xs:block">Moodly</span>
      </div>

      {/* Kanan: Profile & Action */}
      <div className="flex items-center gap-2 sm:gap-6">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2 p-1 sm:p-2 rounded-xl transition-all ${
              isActive ? "bg-blue-50" : "hover:bg-gray-50"
            }`
          }
          title="Profile" 
        >
          {/* Avatar Icon Saja (Tanpa Teks) */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-blue-100 flex items-center justify-center bg-blue-50 text-blue-600 shadow-sm shrink-0">
            <User size={18} className="sm:size-5" />
          </div>
        </NavLink>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl flex items-center gap-2 group"
          title="Logout"
        >
          <LogOut size={20} />
          <span className="text-sm font-semibold hidden lg:block">Logout</span>
        </button>
      </div>
    </nav>
  );
};