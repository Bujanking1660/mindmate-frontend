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
import AlertModal from "../../components/AlertModal";

const Profile = () => {
  const navigate = useNavigate();

  // --- STATE & LOGIC ---
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [errorState, setErrorState] = useState(false);
  const [reminder, setReminder] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- SUBMIT & ALERT STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

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
  }, [navigate])

  // --- UPDATE DATA ---
  const handleUpdateProfile = async (updatedData) => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Append image file if exists
      if (updatedData.imageFile) {
        formDataToSend.append("file", updatedData.imageFile);
      }

      // Append other data as JSON string in 'data' field
      formDataToSend.append(
        "data",
        JSON.stringify({
          username: updatedData.username,
          // Add other fields here if needed in the future
        }),
      );

      const response = await api.put("/user/edit", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUserData(response.data.data);
      setIsModalOpen(false);

      setAlertConfig({
        isOpen: true,
        title: "Success!",
        message: "Profile successfully updated.",
        type: "success",
      });
    } catch (error) {
      console.error("Update gagal", error);
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui profile";

      setAlertConfig({
        isOpen: true,
        title: "Update Failed",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOGIC STREAK ---
  const streakCount = userData?.currentStreak?.length || 0;
  const isStreakActive = streakCount >= 1;

  // --- RENDER: LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-4 md:p-6">
        <div className="max-w-6xl mx-auto py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // --- RENDER: ERROR ---
  if (errorState || !userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        {/* ... (Kode Error Display tetap sama) ... */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full flex flex-col items-center">
          <WifiOff size={40} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold">Koneksi Bermasalah</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: UTAMA ---
  return (
    <div className="min-h-screen font-sans pb-20 bg-transparent animate-in fade-in duration-500">
      {/* Decorative Background Blob */}
      <div className="fixed top-0 left-0 w-full h-96 bg-linear-to-b from-blue-50 to-transparent -z-10" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Profile Saya
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
            Kelola informasi akun dan preferensi mood kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* --- KOLOM KIRI: Profile Card (Responsive Fix) --- */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-10 -mt-10 md:-mr-16 md:-mt-16 opacity-50 pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 relative z-10">
                {/* 1. Avatar (Responsive Size) */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 md:w-40 md:h-40 bg-slate-100 rounded-full p-1 ring-4 ring-white shadow-lg overflow-hidden">
                    {userData.photoUrl ? (
                      <img
                        src={userData.photoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-full text-slate-400">
                        <User size={40} className="md:w-12 md:h-12" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-4 border-white rounded-full shadow-sm" />
                </div>

                {/* 2. Info Text (Full Width on Mobile) */}
                <div className="text-center sm:text-left flex-1 w-full min-w-0">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-1 truncate">
                    @{userData.username}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6">
                    Moodly Member
                  </div>

                  {/* Info List Items */}
                  <div className="space-y-3 w-full">
                    {/* Username Item */}
                    <div className="flex items-center gap-3 md:gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 shrink-0">
                        <AtSign size={16} className="md:w-[18px] md:h-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Username
                        </p>
                        <p className="font-bold text-slate-700 truncate text-sm md:text-base">
                          {userData.username}
                        </p>
                      </div>
                    </div>

                    {/* Email Item */}
                    <div className="flex items-center gap-3 md:gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 shrink-0">
                        <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Email
                        </p>
                        <p className="font-bold text-slate-700 truncate text-sm md:text-base">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all w-full sm:w-auto justify-center text-sm md:text-base"
                >
                  <Edit3 size={16} className="md:w-[18px] md:h-[18px]" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: Widgets (Span 5) --- */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 1. Streak Card - CONDITIONAL DESIGN */}
            <div
              className={`
              rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden flex-1 min-h-70 flex flex-col justify-between group transition-transform hover:scale-[1.02]
              ${
                isStreakActive
                  ? "bg-linear-to-br from-orange-400 to-rose-500 shadow-orange-500/20"
                  : "bg-slate-400 shadow-none border border-slate-200"
              }
            `}
            >
              {/* Decorative Background (Hanya muncul jika aktif) */}
              {isStreakActive && (
                <>
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                </>
              )}

              <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                  <Flame size={28} fill="currentColor" className="text-white" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${isStreakActive ? "bg-white/20" : "bg-slate-500/30 text-slate-100"}`}
                >
                  {isStreakActive ? "On Fire!" : "No Streak"}
                </span>
              </div>

              <div className="relative z-10 text-center py-4">
                <h3
                  className={`text-7xl font-black mb-1 drop-shadow-sm ${!isStreakActive && "text-slate-200"}`}
                >
                  {streakCount}
                </h3>
                <p className="font-medium text-white/90 text-base md:text-lg">
                  {isStreakActive ? "Hari Berturut-turut" : "Belum ada streak"}
                </p>
              </div>

              <div
                className={`relative z-10 rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-medium backdrop-blur-sm ${isStreakActive ? "bg-black/10 text-white/80" : "bg-black/5 text-slate-100"}`}
              >
                <Calendar size={16} />
                <span>
                  {isStreakActive
                    ? "Jaga mood tetap positif!"
                    : "Ayo mulai hari ini!"}
                </span>
              </div>
            </div>

            {/* Reminder Toggle */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className={`p-3 md:p-4 rounded-2xl transition-colors duration-300 ${reminder ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"}`}
                >
                  <Bell
                    size={20}
                    className="md:w-[24px] md:h-[24px]"
                    fill={reminder ? "currentColor" : "none"}
                  />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base md:text-lg">
                    Notifikasi
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium">
                    Ingatkan saya
                  </p>
                </div>
              </div>

              <button
                onClick={() => setReminder(!reminder)}
                className={`w-14 h-8 md:w-16 md:h-9 rounded-full p-1 transition-all duration-300 shadow-inner ${reminder ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <div
                  className={`w-6 h-6 md:w-7 md:h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${reminder ? "translate-x-6 md:translate-x-7" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={userData}
          onUpdate={handleUpdateProfile}
          isSubmitting={isSubmitting}
        />
      )}

      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default Profile;
