// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/UserContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-gray-900 px-6 py-3 flex items-center justify-between shadow-md fixed top-0 z-50 h-16">
      {/* Left: Logo + Brand */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(user ? "/home" : "/")}
      >
        <img
          src="https://i.pinimg.com/736x/96/21/49/962149f905f2598b3e71887fafb2708f.jpg"
          alt="CrickBid Logo"
          className="h-10 w-10 object-contain rounded-full"
        />
        <h1 className="text-xl font-bold text-white">CrickBid</h1>
      </div>

      {/* If NOT logged in */}
      {!user && (
        <div className="flex items-center space-x-4">
          <p className="text-gray-300 text-sm hidden sm:block">
            Not a Member Yet?{" "}
            <Link to="/signup" className="text-yellow-400 font-semibold">
              Register Now
            </Link>
          </p>
          <Link
            to="/login"
            className="px-5 py-2 bg-white text-black rounded-full font-medium shadow-md hover:bg-gray-100 transition"
          >
            Log In
          </Link>
        </div>
      )}

      {/* If LOGGED IN */}
      {user && (
        <div className="flex items-center gap-6">
          {/* Nav */}
          <nav className="hidden md:flex gap-6 text-gray-300 font-medium items-center">
            <Link to="/home" className="hover:text-yellow-400 transition">
              Home
            </Link>
            <Link to="/matches" className="hover:text-yellow-400 transition">
              Matches
            </Link>
            <Link to="/compare-players" className="hover:text-[#009270] transition flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Compare
            </Link>
            <Link to="/scorecards" className="hover:text-yellow-400 transition text-red-400 font-bold ml-2">
              IPL Scoreboard
            </Link>
          </nav>

          {/* Wallet */}
          <div 
            onClick={() => navigate('/wallet')}
            className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold shadow cursor-pointer hover:bg-yellow-300 transition"
          >
            ₹ {user?.virtualCash ?? 0}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
            <img
              src={user?.profileImageUrl || user?.profileImage || "https://via.placeholder.com/40"}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border border-gray-300"
            />
              <ChevronDownIcon className="w-4 h-4 text-gray-300" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
