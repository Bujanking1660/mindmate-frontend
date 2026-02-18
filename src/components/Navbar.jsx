import { useState } from "react";
import { User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import api from '../api/axiosConfig';

// 1. Import Component Modal
import AlertModal from "./AlertModal";

export const Navbar = () => {
  const navigate = useNavigate();

  // 2. Setup State Modal
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    onConfirm: null,
    confirmText: "Mengerti"
  });

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // 3. Pisahkan Logic Logout (yang akan dipanggil kalau user klik "Ya")
  const performLogout = async () => {
    try {
        await api.post("/auth/logout"); 
    } catch (error) {
        console.warn("Logout server gagal, membersihkan sesi lokal...", error);
    } finally {
        // Hapus data local
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("user_name");
        
        // Redirect ke login
        navigate("/login");
    }
  };

  // 4. Handler saat tombol Logout diklik (Hanya buka Modal)
  const handleLogoutClick = () => {
    setModal({
        isOpen: true,
        title: "Konfirmasi Logout",
        message: "Apakah Anda yakin ingin keluar dari aplikasi?",
        type: "warning",   // Pakai tipe warning biar icon-nya segitiga oren
        showCancel: true,  // PENTING: Aktifkan tombol Batal
        confirmText: "Ya, Keluar",
        onConfirm: performLogout // Masukkan fungsi logout di sini
    });
  };

  return (
    <>
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 shadow-sm border border-white">
                <User size={16} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-600 hidden sm:block">Profile</span>
            </NavLink>

            {/* Divider Kecil */}
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* Tombol Logout */}
            <button
              onClick={handleLogoutClick} // Panggil handler buka modal
              className="group flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Keluar Aplikasi"
            >
              <LogOut size={20} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* 5. Render Modal di luar Nav tapi masih di dalam Component */}
      <AlertModal 
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel} // Ini akan bernilai TRUE
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
      />
    </>
  );
};