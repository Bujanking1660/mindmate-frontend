import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Flame,
  Bell,
  WifiOff,
  Mail,
  AtSign,
  Edit3,
  Calendar,
} from "lucide-react";
import api from "../../api/axiosConfig";
import EditProfileModal from "./components/EditProfileModal";
import DashboardSkeleton from "./components/DashboardSkeleton";

const Profile = () => {
  const navigate = useNavigate();
  
  // --- STATE & LOGIC ---
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [errorState, setErrorState] = useState(false);

  const [reminder, setReminder] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("user_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/user");
        setUserData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Critical Error:", error);
        setErrorState(true);
        setLoading(false);

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("user_token");
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await api.put("/user/edit", {
        username: updatedData.username,
      });

      setUserData(response.data.data);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Update gagal", error);

      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui username";
      alert(errorMessage);
    }
  };

  // --- LOGIC STREAK (Baru Ditambahkan) ---
  // Kita hitung di sini agar JSX di bawah lebih rapi
  const streakCount = userData?.currentStreak?.length || 0;
  const isStreakActive = streakCount > 0;

  // --- RENDER LOGIC ---

  // 1. TAMPILAN LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-6">
        <div className="max-w-6xl mx-auto py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // 2. TAMPILAN ERROR
  if (errorState || !userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 max-w-md w-full flex flex-col items-center border border-slate-100">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 ring-8 ring-red-50/50">
            <WifiOff size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">
            Koneksi Terputus
          </h2>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            Gagal memuat data profil. Pastikan koneksi internet aman atau server
            sedang dalam perbaikan.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-300/50 active:scale-95"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  // 3. TAMPILAN UTAMA
  return (
    <div className="min-h-screen font-sans pb-20 bg-transparent animate-in fade-in duration-500">
      
      {/* Decorative Background Blob */}
      <div className="fixed top-0 left-0 w-full h-96 bg-linear-to-b from-blue-50 to-transparent -z-10" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              Profile Saya
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Kelola informasi akun dan preferensi mood kamu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- KOLOM KIRI: Profile Card (Span 7) --- */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                {/* Avatar with Ring */}
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-full p-1 ring-4 ring-white shadow-lg overflow-hidden">
                    {userData.photoUrl ? (
                      <img
                        src={userData.photoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-full text-slate-400">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  {/* Status Indicator */}
                  <div
                    className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-sm"
                    title="Online"
                  />
                </div>

                {/* Name & Title */}
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-3xl font-black text-slate-800 mb-1">
                    @{userData.username}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                    Moodly Member
                  </div>

                  {/* Info List */}
                  <div className="space-y-3 w-full">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400">
                        <AtSign size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Username
                        </p>
                        <p className="font-bold text-slate-700 truncate">
                          {userData.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400">
                        <Mail size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Email
                        </p>
                        <p className="font-bold text-slate-700 truncate">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: Widgets (Span 5) --- */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 1. Streak Card - CONDITIONAL DESIGN */}
            <div className={`
              rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden flex-1 min-h-70 flex flex-col justify-between group transition-transform hover:scale-[1.02]
              ${isStreakActive 
                ? "bg-linear-to-br from-orange-400 to-rose-500 shadow-orange-500/20" 
                : "bg-slate-400 shadow-none border border-slate-200"}
            `}>
              
              {/* Decorative Background (Hanya muncul jika aktif) */}
              {isStreakActive && (
                <>
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/20 to-transparent" />
                </>
              )}

              <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                   <Flame size={28} fill="currentColor" className="text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${isStreakActive ? "bg-white/20" : "bg-slate-500/30 text-slate-100"}`}>
                  {isStreakActive ? "On Fire!" : "No Streak"}
                </span>
              </div>

              <div className="relative z-10 text-center py-4">
                <h3 className={`text-7xl font-black mb-1 drop-shadow-sm ${!isStreakActive && "text-slate-200"}`}>
                   {streakCount}
                </h3>
                <p className="font-medium text-white/90 text-lg">
                  {isStreakActive ? "Hari Berturut-turut" : "Belum ada streak"}
                </p>
              </div>

              <div className={`relative z-10 rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-medium backdrop-blur-sm ${isStreakActive ? "bg-black/10 text-white/80" : "bg-black/5 text-slate-100"}`}>
                <Calendar size={16} />
                <span>
                   {isStreakActive ? "Jaga mood tetap positif!" : "Ayo mulai hari ini!"}
                </span>
              </div>
            </div>

            {/* 2. Reminder Toggle - Clean Switch Design */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-2xl transition-colors duration-300 ${reminder ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"}`}
                >
                  <Bell size={24} fill={reminder ? "currentColor" : "none"} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">
                    Notifikasi
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Ingatkan saya setiap hari
                  </p>
                </div>
              </div>

              {/* Custom Switch */}
              <button
                onClick={() => setReminder(!reminder)}
                className={`w-16 h-9 rounded-full p-1 transition-all duration-300 shadow-inner ${reminder ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <div
                  className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${reminder ? "translate-x-7" : "translate-x-0"}`}
                >
                  {/* Small dot inside switch for detail */}
                  <div
                    className={`w-2 h-2 rounded-full ${reminder ? "bg-blue-600" : "bg-slate-300"}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={userData}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default Profile;
