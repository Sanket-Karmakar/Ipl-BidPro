// src/components/PlayerList.jsx
import { useState } from "react";

export default function PlayerList({ players, selectedPlayers, toggleSelect }) {
  const [activeRole, setActiveRole] = useState("WK");

  const categorizeRole = (role = "") => {
    role = role.toLowerCase();
    if (role.includes("wk")) return "WK";
    if (role.includes("bat")) return "BAT";
    if (role.includes("allrounder") || role.includes("ar")) return "AR";
    if (role.includes("bowl")) return "BOWL";
    return "Other";
  };

  const groupedPlayers = { WK: [], BAT: [], AR: [], BOWL: [] };
  players.forEach((p) => {
    const cat = categorizeRole(p.role);
    if (groupedPlayers[cat]) groupedPlayers[cat].push(p);
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      {/* Tabs */}
      <div className="flex bg-gray-200 text-gray-700 font-semibold mb-4">
        {["WK", "BAT", "AR", "BOWL"].map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`flex-1 py-2 ${
              activeRole === role
                ? "bg-white border-b-2 border-red-600 text-red-600"
                : "hover:bg-gray-300"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Players */}
      {groupedPlayers[activeRole]?.length ? (
        <div className="space-y-3">
          {groupedPlayers[activeRole].map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between bg-white shadow-md rounded-lg p-3 ${
                selectedPlayers.find((sp) => sp.id === p.id) ? "border-2 border-green-500" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.playerImg || "https://via.placeholder.com/80"}
                  alt={p.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.teamName} • {p.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Pts</p>
                  <p className="font-semibold">{p.points}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Cr</p>
                  <p className="font-semibold">{p.credits}</p>
                </div>
                <button
                  onClick={() => toggleSelect(p)}
                  className={`px-3 py-1 rounded-full font-bold ${
                    selectedPlayers.find((sp) => sp.id === p.id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {selectedPlayers.find((sp) => sp.id === p.id) ? "−" : "+"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center mt-6">
          No {activeRole} players available
        </p>
      )}
    </div>
  );
}
