import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // PROTEKSI HALAMAN: Jika token tidak ada di localStorage, tendang user ke /login.
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, []);

  return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div>
          <h1>Report Page</h1>
        </div>
      </main>
  );
};
export default Report;
