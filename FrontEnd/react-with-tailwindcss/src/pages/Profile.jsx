import { useAuth } from "../context/UserContext";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-white p-8">
      {/* Profile Header */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-yellow-400 to-orange-500">
          <img
            src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="User Avatar"
            className="absolute -bottom-12 left-8 h-24 w-24 rounded-full border-4 border-white object-cover"
          />
        </div>

        {/* User Info */}
        <div className="mt-16 px-8 pb-6">
          <h1 className="text-2xl font-bold">{user?.fullname || user?.username}</h1>
          <p className="text-gray-600">@{user?.username}</p>
          <p className="text-gray-500">{user?.email}</p>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-gray-800">12</p>
              <p className="text-xs text-gray-500">Matches Played</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-green-600">8</p>
              <p className="text-xs text-gray-500">Wins</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-red-500">4</p>
              <p className="text-xs text-gray-500">Losses</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
