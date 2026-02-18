import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
// Import konstanta maskot yang kamu buat
import { MASKOT_IMAGES } from "../utils/assetsConfig";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-6">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-blue-50 to-transparent -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />

      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-lg w-full text-center animate-in fade-in zoom-in duration-500">
        
        {/* Mascot Section */}
        <div className="relative mb-8">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-slate-100 rounded-full -z-10" />
            <img 
              src={MASKOT_IMAGES.detective}
              alt="Mascot Lost" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto transition-transform hover:scale-110 duration-300"
              style={{ animation: 'bounce 3s infinite' }}
            />
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-2 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-slate-700 mb-3">
          Waduh, Kamu Tersesat?
        </h2>
        
        <p className="text-slate-500 font-medium leading-relaxed mb-8">
          Detektif Chick sudah mencari ke mana-mana, tapi halaman ini tetap nggak ketemu. Yuk, kita balik ke rute yang benar!
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Kembali ke Beranda
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 px-6 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;