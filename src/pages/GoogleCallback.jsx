import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true; // Tandai langsung biar gak jalan 2x

    const handleGoogleCallback = () => {
      const token = searchParams.get("token");
      const userParam = searchParams.get("user");
      const error = searchParams.get("error");

      console.log("🔍 Callback Params:", { token, userParam, error });

      // 1. Handle Error dari URL
      if (error) {
        alert("Login Google Gagal: " + error);
        navigate("/login");
        return;
      }

      // 2. Handle Success
      if (token) {
        try {
          // A. Simpan Token
          localStorage.setItem("user_token", token);

          // B. Handle User Data (Nama untuk Navbar)
          if (userParam) {
            try {
              // Coba decode dan parse JSON
              const userDataString = decodeURIComponent(userParam);
              const userData = JSON.parse(userDataString);
              
              console.log("👤 User Data Parsed:", userData);

              // Simpan data lengkap (opsional)
              localStorage.setItem("user_data", JSON.stringify(userData));

              // --- PENTING BUAT NAVBAR ---
              // Ambil nama dari object user (sesuaikan key dari backend: .name / .username / .displayName)
              const userName = userData.name || userData.username || userData.email.split("@")[0];
              localStorage.setItem("user_name", userName); 

            } catch (jsonError) {
              console.warn("⚠️ Gagal parse JSON userParam, menggunakan token saja.", jsonError);
              // Fallback: Jika gagal parse, biarkan user_name kosong atau ambil dari token nanti
              localStorage.setItem("user_name", "User");
            }
          } else {
             // Jika token ada tapi userParam gak ada (kasus jarang)
             localStorage.setItem("user_name", "User");
          }

          console.log("✅ Login Berhasil, Redirecting...");
          
          // Beri jeda sedikit agar LocalStorage tersimpan sempurna sebelum redirect
          setTimeout(() => {
            navigate("/home", { replace: true });
            // Reload halaman agar Navbar membaca localStorage terbaru
            window.location.reload(); 
          }, 100);

        } catch (err) {
          console.error("💥 Error processing login:", err);
          navigate("/login");
        }
      } else {
        console.warn("❌ Parameter Token tidak ditemukan di URL");
        // Jangan langsung redirect jika sedang debugging, biar bisa liat console
        // navigate("/login"); 
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#E0F2FE]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
      <p className="text-gray-700 font-medium">Sedang memproses login...</p>
      <p className="text-xs text-gray-400 mt-2">Mohon tunggu sebentar</p>
    </div>
  );
};

export default GoogleCallback;