import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () => {
const [showPassword, setShowPassword] = useState(false);

return ( <div className="min-h-screen flex">

```
  {/* Left Side */}
  <div
    className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48')",
    }}
  >
    <div className="absolute inset-0 bg-black/60"></div>

    <div className="relative z-10 flex flex-col justify-center px-16">
      <h1 className="text-6xl font-bold text-white leading-tight">
        Transform Your
        <span className="text-blue-500"> Fitness Journey</span>
      </h1>

      <p className="mt-6 text-xl text-gray-300">
        Discover gyms, trainers and fitness centers near you.
      </p>
    </div>
  </div>

  {/* Right Side */}
  <div className="flex-1 flex items-center justify-center bg-[#000000] px-6">

    <div className="w-full max-w-md">

      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <h2 className="text-4xl font-bold text-white text-center">
          Welcome Back
        </h2>

        <p className="text-center text-gray-400 mt-2">
          Sign in to continue
        </p>

        <form className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-gray-700 text-white outline-none focus:border-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-4 rounded-xl bg-white/5 border border-gray-700 text-white outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-4 text-gray-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex justify-between text-sm">
            <label className="text-gray-400">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-blue-400"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
          >
            Sign In
          </button>

          <button
            type="button"
            className="w-full py-4 rounded-xl border border-gray-700 text-white"
          >
            Continue with Google
          </button>

          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400"
            >
              Register
            </Link>
          </p>

        </form>

      </div>

    </div>

  </div>
</div>

);
};

export default UserLogin;
