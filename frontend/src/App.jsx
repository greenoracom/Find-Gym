import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { VerticalNavbar, MobileBottomNav } from './components/VerticalNavbar';
import Home from './components/Home';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import FindGym from './components/FindGym';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';

// Conditional Navbar wrapper
const Navigation = () => {
  const location = useLocation();
  if (location.pathname === '/gyms') return null;
  return <Navbar />;
};

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  useEffect(() => {
    const handleCollapse = (e) => {
      setSidebarCollapsed(e.detail);
    };
    window.addEventListener("sidebar-collapse-change", handleCollapse);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.removeEventListener("sidebar-collapse-change", handleCollapse);
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black">
        <VerticalNavbar />
        <MobileBottomNav />
        <Navigation />
        <div className={`flex-grow pb-[70px] lg:pb-0 transition-all duration-300 ${sidebarCollapsed ? "lg:pr-0" : "lg:pr-[100px]"}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gyms" element={<FindGym />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </div>
        <div className={`pb-[70px] lg:pb-0 transition-all duration-300 ${sidebarCollapsed ? "lg:pr-0" : "lg:pr-[100px]"}`}>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
