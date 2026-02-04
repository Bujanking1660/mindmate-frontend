import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Flame, 
  Bell, 
  Moon, 
  Edit2, 
  ChevronRight 
} from "lucide-react";
// import api from "../api/axiosConfig";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // State untuk Data User (Mock Data sementara, nanti diganti response API)
  const [userData, setUserData] = useState({
    name: "JokoWi",
    email: "jokowi@gmail.com",
    gender: "Male",
    joinDate: "January 2014",
    streak: 7
  });

  // State untuk Toggle
  const [darkMode, setDarkMode] = useState(false);
  const [reminder, setReminder] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Cek token dulu
        const token = localStorage.getItem("user_token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Panggil API Profile (Sesuaikan endpoint dengan backend kamu)
        // const response = await api.get("/user/profile");
        // setUserData(response.data.data); // Uncomment kalau backend sudah siap
        
        setLoading(false);
      } catch (error) {
        console.error("Gagal ambil data profile", error);
        // navigate("/login"); // Opsional: redirect kalau error
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#E0F2FE]">Loading...</div>;

  return (
    <div className="min-h-screen font-sans pb-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-8">User Profile</h1>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* KOLOM KIRI: Profile Info */}
          <div className="bg-[#CDE9FF] rounded-3xl p-8 border border-white/50 shadow-sm flex flex-col h-full relative">
            
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center mb-3 shadow-md border-4 border-white">
                <User className="text-white w-12 h-12" />
              </div>
              <h2 className="text-xl font-bold text-[#1E293B]">{userData.name}</h2>
              <p className="text-gray-500 text-sm">Member Since {userData.joinDate}</p>
            </div>

            {/* Form Inputs (Read Only Style) */}
            <div className="space-y-4 grow">
              <div>
                <label className="block text-gray-500 text-xs font-bold mb-1 ml-1">Name</label>
                <div className="bg-white rounded-2xl px-4 py-3 text-[#1E293B] font-medium shadow-sm">
                  {userData.name}
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-xs font-bold mb-1 ml-1">Email</label>
                <div className="bg-white rounded-2xl px-4 py-3 text-[#1E293B] font-medium shadow-sm truncate">
                  {userData.email}
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-xs font-bold mb-1 ml-1">Gender</label>
                <div className="bg-white rounded-2xl px-4 py-3 text-[#1E293B] font-medium shadow-sm">
                  {userData.gender}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button className="mt-8 flex items-center justify-center gap-2 text-[#1E293B] font-semibold hover:underline">
              <Edit2 size={16} /> Edit profile
            </button>
          </div>

          {/* Streak */}
          <div className="bg-[#CDE9FF] rounded-3xl p-8 border border-white/50 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-75">
            <h3 className="text-lg font-bold text-[#1E293B] mb-4">Current Streak</h3>
            
            <div className="mb-4 drop-shadow-lg">
               <Flame fill="black" className="w-32 h-32 text-black" />
            </div>

            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">{userData.streak} Days in a Row</h2>
            <p className="text-gray-600 text-sm px-4">
              You've been consistently tracking your mood. Keep up the good rhythm
            </p>
          </div>

          {/* Settings */}
          <div className="flex flex-col gap-6 h-full">
            
            {/* Card 1: App Appearance */}
            <div className="bg-[#CDE9FF] rounded-3xl p-6 border border-white/50 shadow-sm flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Moon className="text-[#1E293B]" size={24} fill="currentColor" />
                <h3 className="font-bold text-[#1E293B]">App Appearance</h3>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="pr-4">
                  <p className="font-semibold text-[#1E293B]">Calm Mode (Dark Mode)</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Helps reduce eye strain and feels more comfortable at night.
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${darkMode ? 'bg-[#1E293B]' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Daily Reminder */}
            <div className="bg-[#CDE9FF] rounded-3xl p-6 border border-white/50 shadow-sm flex-1">
               <div className="flex items-center gap-3 mb-4">
                <Bell className="text-[#1E293B]" size={24} fill="currentColor" />
                <h3 className="font-bold text-[#1E293B]">Daily Reminder</h3>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="pr-4">
                  <p className="font-semibold text-[#1E293B]">Enable Reminder</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    This reminder helps you stay aware of your emotional state every day.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                   {/* Time Badge */}
                   <span className="bg-white/50 text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-400/30">
                      12.00
                   </span>

                   {/* Custom Toggle Switch */}
                   <button 
                    onClick={() => setReminder(!reminder)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${reminder ? 'bg-[#1E293B]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${reminder ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;