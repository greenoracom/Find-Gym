import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
