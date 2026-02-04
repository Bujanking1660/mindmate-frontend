import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { SubNavbar } from '../components/SubNavbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#E4F7FF] via-[#EDFAFF] to-[#F5FAFF]">
      <Navbar />
      <SubNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;