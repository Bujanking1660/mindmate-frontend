import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import api from "../../api/axiosConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        // access token
        const token = response.data.data.accessToken;
        localStorage.setItem("user_token", token);

        alert(response.data.message);
        navigate("/home");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0F2FE] px-4 font-sans">
      <div className="w-full max-w-md bg-[#CDE9FF] rounded-4xl p-8 md:p-10 shadow-xl border border-white/40">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-20 h-20 mb-4 drop-shadow-md">
            <img
              src="/icon.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B]">
            Let's Get Started
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Let's dive in into your account!
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              required
              value={email} // Controlled component
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-transparent focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none text-gray-700 transition-all shadow-sm"
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="password"
              required
              value={password} // Controlled component
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-transparent focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none text-gray-700 transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#334155] hover:bg-[#1E293B] text-white font-bold py-3.5 rounded-2xl mt-4 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="grow border-t border-gray-400/20"></div>
          <span className="px-3 text-gray-400 text-[10px] font-bold tracking-widest">
            OR
          </span>
          <div className="grow border-t border-gray-400/20"></div>
        </div>

        {/* Social Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white/50 hover:bg-white flex items-center justify-center gap-3 py-3 rounded-2xl text-[#1E293B] font-semibold transition-all border border-white/20 shadow-sm"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#1E293B] font-bold cursor-pointer hover:underline transition-all underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
