import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import api from "../../api/axiosConfig";
// Pastikan path import ini sesuai dengan struktur foldermu
import AlertModal from "../../components/AlertModal"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- STATE MODAL ---
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false, // Default false (Mode Alert)
    onConfirm: null,   // Aksi naviasi disimpan disini
    confirmText: "Mengerti"
  });

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleGoogleLogin = () => {
    window.location.replace("http://localhost:3000/auth/google");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("auth/login", {
        email: email,
        password: password,
      });

      if (response.status === 200 || response.status === 201) {
        const token = response.data.data.accessToken;
        localStorage.setItem("user_token", token);

        // --- SUKSES ---
        // Kita set navigasi di dalam onConfirm
        setModal({
            isOpen: true,
            title: "Login Berhasil!",
            message: response.data.message || "Selamat datang kembali!",
            type: "success",
            showCancel: false,
            confirmText: "Lanjut ke Dashboard",
            onConfirm: () => {
                navigate("/home"); // Pindah halaman saat tombol diklik
            }
        });
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan sistem";
      
      // --- ERROR ---
      setModal({
        isOpen: true,
        title: "Login Gagal",
        message: errorMsg,
        type: "error",
        showCancel: false,
        confirmText: "Coba Lagi",
        onConfirm: null // Tidak ada aksi, cuma tutup
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    // BACKGROUND: Gradient halus dari warna aslimu (#E0F2FE)
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#E0F2FE] via-[#eff8ff] to-[#d6eaff] px-4 font-sans">
      
      {/* CARD: Warna asli (#CDE9FF) dengan sentuhan Glassmorphism & Shadow Halus */}
      <div className="w-full max-w-md bg-linear-to-b from-[#CDE9FF] to-[#E0F2FE] rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-200/50 border border-white/60 relative overflow-hidden">
        
        {/* Dekorasi Background (Glow halus di pojok) */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/30 rounded-full blur-3xl"></div>

        {/* Header Section */}
        <div className="relative flex flex-col items-center mb-8 text-center z-10">
          <div className="w-24 h-24 mb-4 drop-shadow-lg transition-transform hover:scale-105 duration-300">
            <img
              src="/icon.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">
            Let's Get Started
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Let's dive in into your account!
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          
          {/* Input Email */}
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#334155] transition-colors duration-300"
              size={20}
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 border border-white/50 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100/50 outline-none text-slate-700 font-medium transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-slate-400"
            />
          </div>

          {/* Input Password */}
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#334155] transition-colors duration-300"
              size={20}
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 border border-white/50 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100/50 outline-none text-slate-700 font-medium transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-slate-400"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#334155] hover:bg-[#1E293B] text-white font-bold py-4 rounded-2xl mt-6 transition-all duration-300 shadow-lg shadow-slate-400/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
                <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
                </>
            ) : "Login"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-8 relative z-10">
          <div className="grow border-t border-slate-300/40"></div>
          <span className="px-4 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
            OR
          </span>
          <div className="grow border-t border-slate-300/40"></div>
        </div>

        {/* Social Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white/60 hover:bg-white flex items-center justify-center gap-3 py-3.5 rounded-2xl text-[#1E293B] font-bold transition-all border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 relative z-10 backdrop-blur-sm"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 mt-8 font-medium relative z-10">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#1E293B] font-extrabold cursor-pointer hover:text-blue-700 transition-colors decoration-2 underline-offset-4 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* --- ALERT MODAL --- */}
        <AlertModal 
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          showCancel={modal.showCancel}
          onConfirm={modal.onConfirm}
          confirmText={modal.confirmText}
        />

      </div>
    </div>
  );
};

export default Login;