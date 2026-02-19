import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Report from "./pages/Report/Report";
import Profile from "./pages/Profile/Profile";
import MainLayout from "./layouts/MainLayout";
import Register from "./pages/Register/Register";
import GoogleCallback from "./pages/Oauth/GoogleCallback";
import LandingPage from "./pages/LandingPage/LandingPage";
import NotFound from "./pages/NotFound";

// Komponen Guard untuk rute yang butuh login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("user_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Komponen Guard agar user yang sudah login tidak bisa ke Login/Register lagi
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("user_token");
  if (token) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik Terbuka */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Rute yang HANYA bisa diakses jika BELUM login */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Rute yang HANYA bisa diakses jika SUDAH login */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;