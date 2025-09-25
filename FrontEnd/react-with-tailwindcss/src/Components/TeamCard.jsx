// src/components/TeamCard.jsx
import { normalizeRole } from "../utils/roleUtils";

export default function TeamCard({ team, onEdit, onView, onRemove }) {
  const { teamName, players } = team;

  // Find captain and vice-captain from players[]
  const captain = players.find((p) => p.isCaptain);
  const viceCaptain = players.find((p) => p.isViceCaptain);

  // Count roles (with normalization)
  const counts = players.reduce(
    (acc, p) => {
      const role = normalizeRole(p.role);
      if (role === "Wicket-Keeper") acc.WK++;
      else if (role === "Batsman") acc.BAT++;
      else if (role === "All-Rounder") acc.AR++;
      else if (role === "Bowler") acc.BOWL++;
      return acc;
    },
    { WK: 0, BAT: 0, AR: 0, BOWL: 0 }
  );

  return (
    <div className="border rounded-lg shadow bg-gradient-to-r from-green-50 to-white p-4 mb-4">
      {/* Team Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold">{teamName}</h2>
        <div className="flex gap-3">
          <button
            onClick={onView}
            className="text-blue-600 text-sm font-semibold"
          >
            👀 View
          </button>
          <button
            onClick={onEdit}
            className="text-yellow-600 text-sm font-semibold"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to remove this team?")) {
                onRemove();
              }
            }}
            className="text-red-600 text-sm font-semibold"
          >
            ❌ Remove
          </button>
        </div>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-4 text-center text-xs font-semibold mb-3">
        <p>WK {counts.WK}</p>
        <p>BAT {counts.BAT}</p>
        <p>AR {counts.AR}</p>
        <p>BOWL {counts.BOWL}</p>
      </div>

      {/* Captain + Vice Captain */}
      <div className="flex gap-6 items-center justify-center">
        {captain && (
          <div className="flex flex-col items-center">
            <img
              src={captain.playerImg || "https://via.placeholder.com/60"}
              alt={captain.playerName}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <p className="text-xs font-semibold">{captain.playerName}</p>
            <span className="text-[10px] text-blue-600 font-bold">C</span>
          </div>
        )}

        {viceCaptain && (
          <div className="flex flex-col items-center">
            <img
              src={viceCaptain.playerImg || "https://via.placeholder.com/60"}
              alt={viceCaptain.playerName}
              className="w-12 h-12 rounded-full border-2 border-green-500"
            />
            <p className="text-xs font-semibold">{viceCaptain.playerName}</p>
            <span className="text-[10px] text-green-600 font-bold">VC</span>
          </div>
        )}
      </div>
    </div>
  );
}
