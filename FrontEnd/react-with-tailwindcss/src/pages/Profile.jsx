// src/pages/Profile.jsx
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { User, Mail, Award, LogOut, Edit3, Wallet } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-36 bg-gradient-to-r from-red-500 to-orange-500">
          <img
            src={
              user?.profileImage
                ? `http://localhost:5001${user.profileImage}`
                : "/default-avatar.png"
            }
            alt="User Avatar"
            className="absolute -bottom-12 left-8 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
          />
        </div>

        {/* User Info */}
        <div className="mt-16 px-8 pb-6">
          <h1 className="text-2xl font-bold">{user?.fullname || user?.username}</h1>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <User size={16} /> @{user?.username}
          </p>
          <p className="text-gray-500 flex items-center gap-2">
            <Mail size={16} /> {user?.email}
          </p>

          {/* Wallet & Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
              <Wallet className="mx-auto text-yellow-500 mb-1" size={20} />
              <p className="text-lg font-bold text-gray-800">₹500</p>
              <p className="text-xs text-gray-500">Wallet Balance</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
              <Award className="mx-auto text-green-600 mb-1" size={20} />
              <p className="text-lg font-bold text-gray-800">12</p>
              <p className="text-xs text-gray-500">Matches Played</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
              <p className="text-lg font-bold text-green-600">8</p>
              <p className="text-xs text-gray-500">Wins</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
              <p className="text-lg font-bold text-red-500">4</p>
              <p className="text-xs text-gray-500">Losses</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-700 mb-2">Level Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: "65%" }} // example progress
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Level 5 • 65% to next</p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Edit3 size={16} /> Edit Profile
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
