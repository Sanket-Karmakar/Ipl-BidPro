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
          <nav className="hidden md:flex gap-6 text-gray-300 font-medium">
            <Link to="/home" className="hover:text-yellow-400 transition">
              Home
            </Link>
            <Link to="/matches" className="hover:text-yellow-400 transition">
              Matches
            </Link>
          </nav>

          {/* Wallet */}
          <div className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold shadow cursor-pointer hover:bg-yellow-300">
            $ 1000
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
            <img
  src={user?.profileImage ? `http://localhost:5001${user.profileImage}` : "/default-avatar.png"}
  alt="Profile"
  className="h-10 w-10 rounded-full object-cover"
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
