import { useEffect, useRef } from "react"; // Tambah useRef untuk safety strict mode
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Ref untuk mencegah useEffect jalan 2x di React.StrictMode (Development)
  const processedRef = useRef(false);

  useEffect(() => {
    // Jika sudah diproses, jangan jalankan lagi
    if (processedRef.current) return;

    const handleGoogleCallback = () => {
      const token = searchParams.get("token");
      const userParam = searchParams.get("user");
      const error = searchParams.get("error");

      console.log("🔍 Callback Params:", { token, userParam, error });

      // 1. Handle Error
      if (error) {
        alert("Login Google Gagal: " + error);
        navigate("/login");
        return;
      }

      // 2. Handle Success
      if (token && userParam) {
        try {
          // Tandai sudah diproses agar tidak loop
          processedRef.current = true;

          // Decode user data (karena di URL biasanya di-encode)
          // Format userParam biasanya JSON string yang di encodeURI
          const userDataString = decodeURIComponent(userParam);
          const userData = JSON.parse(userDataString);

          // --- PENGGANTI REDUX ADA DISINI ---
          // Langsung simpan ke LocalStorage
          localStorage.setItem("user_token", token); // Sesuaikan key dgn Login.jsx
          localStorage.setItem("user_data", JSON.stringify(userData)); // Opsional, buat nampilin nama/foto

          console.log("✅ Login Berhasil, Token disimpan.");

          // Redirect ke Home
          // Gunakan replace: true agar user gak bisa back ke halaman callback ini
          navigate("/home", { replace: true });
        } catch (err) {
          console.error("💥 Error parsing user data:", err);
          navigate("/login");
        }
      } else {
        // Jika parameter tidak lengkap
        console.warn("Parameter URL tidak lengkap");
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#E0F2FE]">
      <div className="text-center">
        {/* Loading Spinner sederhana */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">Memproses login Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
