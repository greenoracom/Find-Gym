import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

  {/* Left */}
  <div className="w-1/4">
    <Link to="/">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Find Gym
      </h1>
    </Link>
  </div>

  {/* Center Search */}
  <div className="hidden md:flex justify-center flex-1 px-8">
    <div className="relative w-full max-w-xl">

      <input
        type="text"
        placeholder="Search gyms, trainers..."
        className="
          w-full
          pl-11
          pr-4
          py-3
          rounded-full
          border
          border-gray-200
          bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0011.15 11.15z"
        />
      </svg>

    </div>
  </div>

  {/* Right */}
  <div className="hidden md:flex items-center gap-4 w-1/4 justify-end">

    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200">
      <span className="font-semibold">PUNE</span>
      📍
    </button>

    <Link
      to="/login"
      className="text-gray-700 hover:text-blue-600 font-medium"
    >
      Login
    </Link>

    <Link
      to="/register"
      className="px-5 py-2 rounded-full bg-blue-600 text-white"
    >
      Register
    </Link>

  </div>

</div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search gyms, trainers..."
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  border
                  border-gray-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0011.15 11.15z"
                />
              </svg>
            </div>

            {/* Location */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200">
              <span className="font-semibold">PUNE</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Login */}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="
                block
                text-center
                px-4 py-3
                rounded-lg
                bg-blue-600
                text-white
                hover:bg-blue-700
              "
            >
              Register
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;