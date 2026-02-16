import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User,
  Flame, 
  Bell, 
} from "lucide-react";
import api from "../../api/axiosConfig";
import EditProfileModal from "./components/EditProfileModal";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [reminder, setReminder] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/user");
        setUserData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal ambil data profile", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Logic API Update bisa ditaruh di sini
      // await api.put("/user", updatedData);
      
      setUserData({ ...userData, ...updatedData });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Update gagal", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    // Bagian Utama menggunakan bg-transparent
    <div className="min-h-screen font-sans pb-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-[#1E293B]">Profile Saya</h1>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* KOLOM KIRI: Profile Info */}
          <div className="bg-[#CDE9FF] rounded-[40px] p-8 border border-white shadow-sm flex flex-col relative">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-white overflow-hidden">
                {userData.photoUrl ? (
                  <img src={userData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-blue-300 w-16 h-16" />
                )}
              </div>
              <h2 className="text-2xl font-black text-[#1E293B] mt-4">@{userData.username}</h2>
              <p className="text-blue-600 font-semibold text-sm">Pengguna Moodly</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-black text-blue-500 uppercase tracking-widest ml-1 mb-2 block">Username</label>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-4 text-[#1E293B] font-bold shadow-sm border border-white">
                  {userData.username}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-blue-500 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-4 text-[#1E293B] font-bold shadow-sm border border-white">
                  {userData.email}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-10 w-full py-4 bg-white text-[#1E293B] font-black rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-blue-400"
            >
              Ubah Data Akun
            </button>
          </div>

          {/* KOLOM KANAN: Streak & Reminder */}
          <div className="flex flex-col gap-8">
            {/* Streak Card */}
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full" />
              <h3 className="text-lg font-black text-slate-800 mb-6 relative z-10">Mood Streak Kamu</h3>
              <div className="relative mb-6">
                <Flame size={100} className="text-orange-500 relative z-10" fill="currentColor" />
              </div>
              <h2 className="text-5xl font-black text-slate-900 mb-2 relative z-10">
                {userData.currentStreak?.length || 0}
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs relative z-10">Hari Berturut-turut</p>
            </div>

            {/* Daily Reminder Card */}
            <div className="bg-[#CDE9FF] rounded-[40px] p-8 border border-white shadow-sm">
               <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                  <Bell size={24} fill="currentColor" />
                </div>
                <h3 className="font-black text-[#1E293B] text-xl">Pengingat Harian</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="pr-6">
                  <p className="font-bold text-[#1E293B]">Aktifkan Notifikasi</p>
                </div>
                <button 
                  onClick={() => setReminder(!reminder)}
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-300 flex items-center ${reminder ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${reminder ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Profile */}
      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={userData}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
}

export default Profile;