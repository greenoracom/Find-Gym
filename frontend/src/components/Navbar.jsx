import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  React.useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);
    window.addEventListener("toggle-sidebar", handleToggle);
    window.addEventListener("close-sidebar", handleClose);
    return () => {
      window.removeEventListener("toggle-sidebar", handleToggle);
      window.removeEventListener("close-sidebar", handleClose);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".register-dropdown-container")) {
        setRegisterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHamburgerClick = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        w-full
        lg:w-[calc(100%-100px)]
        z-50
        bg-black/20
        backdrop-blur-xl
        border-b
        border-white/10
        shadow-lg
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Find <span className="text-[#FF7A00]">Gym</span>
              </h1>
            </Link>
          </div>



          {/* Right Area (Desktop + Mobile handles) */}
          <div className="flex items-center gap-2 md:gap-4 justify-end">
            
            {/* Mobile Location button */}
            <button
              className="
                flex
                md:hidden
                items-center
                gap-1.5
                px-3
                py-1.5
                rounded-full
                border
                border-white/20
                bg-white/10
                backdrop-blur-md
                text-white
                text-xs
                font-bold
              "
            >
              <span>PUNE</span>
              📍
            </button>

            {/* Desktop Right (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-4">
              <button
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  backdrop-blur-md
                  text-white
                  hover:bg-white/20
                  transition-all
                "
              >
                <span className="font-semibold text-sm">PUNE</span>
                📍
              </button>


              <div className="relative register-dropdown-container">
                <button
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  className="
                    px-6
                    py-2.5
                    rounded-full
                    bg-[#FF7A00]
                    hover:bg-[#E66E00]
                    text-white
                    font-medium
                    shadow-lg
                    hover:scale-105
                    transition-all
                    cursor-pointer
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <span>Register</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${registerDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {registerDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-black/95 border border-zinc-800/80 backdrop-blur-xl shadow-2xl p-2.5 z-50 flex flex-col gap-1.5 animate-fadeIn">
                    <Link
                      to="/gym-owner/login"
                      onClick={() => setRegisterDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#FF7A00] hover:bg-white/[0.05] rounded-xl transition-all font-semibold text-xs text-left"
                    >
                      <span className="text-base">🏋️</span>
                      <span>Owner Login / Register</span>
                    </Link>
                    <Link
                      to="/trainer/register"
                      onClick={() => setRegisterDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#a3ff12] hover:bg-white/[0.05] rounded-xl transition-all font-semibold text-xs text-left"
                    >
                      <span className="text-base">👥</span>
                      <span>Register as Trainer</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setRegisterDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#FF7A00] hover:bg-white/[0.05] rounded-xl transition-all font-semibold text-xs text-left border-t border-zinc-800/60"
                    >
                      <span className="text-base">👤</span>
                      <span>Normal Register</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              className="md:hidden text-white p-1"
              onClick={handleHamburgerClick}
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;