import { User, LogOut, ChevronDown } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import api from '../api/axiosConfig';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Custom confirm dialog could be used here, but native is fine for now
    const confirmed = window.confirm("Yakin ingin keluar?");
    if (!confirmed) return;

    try {
        await api.post("/auth/logout"); 
    } catch (error) {
        console.warn("Logout server gagal, membersihkan sesi lokal...", error);
    } finally {
        // Cleanup storage regardless of server response
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("user_name");
        navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
        
        {/* Kiri: Logo */}
        <NavLink to="/home" className="flex items-center gap-3 group">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
             <img src="/icon.png" alt="logo" className="w-8 h-8 object-contain relative z-10 drop-shadow-sm transition-transform group-hover:scale-110" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800 hidden xs:block font-sans">
            Moodly
          </span>
        </NavLink>

        {/* Kanan: Profile & Action */}
        <div className="flex items-center gap-3">
          
          {/* Profile Pill */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 ${
                isActive 
                  ? "bg-slate-100 border-slate-200" 
                  : "bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100"
              }`
            }
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 shadow-sm border border-white">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-slate-600 hidden sm:block">Profile</span>
          </NavLink>

          {/* Divider Kecil */}
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Keluar Aplikasi"
          >
            <LogOut size={20} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};