import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import api from "../api/axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201 || response.data.status === "success") {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0F2FE] px-4 font-sans">
      <div className="w-full max-w-md bg-[#CDE9FF] rounded-4xl p-8 md:p-10 shadow-xl border border-white/40">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-20 h-20 mb-4 drop-shadow-md">
             <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B]">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join us and start your journey!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Username Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-transparent focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none text-gray-700 transition-all shadow-sm"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-transparent focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none text-gray-700 transition-all shadow-sm"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-transparent focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none text-gray-700 transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#334155] hover:bg-[#1E293B] text-white font-bold py-3.5 rounded-2xl mt-4 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1E293B] font-bold cursor-pointer hover:underline transition-all underline-offset-4">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;