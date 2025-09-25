// src/pages/ViewTeamPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { categorizeRole, roleLabel, normalizeRole } from "../utils/roleUtils";

export default function ViewTeamPage() {
  const { matchId, teamId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (!token) return;

        const res = await fetch(`http://localhost:5001/api/teams/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch team");
        }

        const data = await res.json();
        const found = data.find((t) => t._id === teamId);

        if (found) {
          found.players = found.players.map((p) => ({
            ...p,
            role: normalizeRole(p.role),
            playerImg: p.playerImg ?? p.image ?? `https://h.cricapi.com/img/players/${p.playerId}.jpg`,
            playerName: p.playerName || p.name || "",
            teamName: p.teamName,
          }));
        }

        setTeam(found);
      } catch (error) {
        console.error("❌ Error fetching team:", error);
      }
    };

    fetchTeam();
  }, [matchId, teamId, token]);

  if (!team) {
    return <p className="text-center mt-10 text-red-500">Team not found!</p>;
  }

  // ✅ Group players
  const grouped = { WK: [], BAT: [], AR: [], BOWL: [] };
  team.players.forEach((p) => {
    const key = categorizeRole(p.role);
    if (grouped[key]) grouped[key].push(p);
    else grouped.BAT.push(p);
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{team.teamName}</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-1 rounded-md"
        >
          Back
        </button>
      </div>

      {/* Team sections */}
      {Object.entries(grouped).map(
        ([role, players]) =>
          players.length > 0 && (
            <div key={role} className="mb-8">
              <h2 className="text-lg font-semibold mb-3">{roleLabel(role)}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {players.map((p) => (
                  <div
                    key={p.playerId}
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center relative hover:shadow-lg transition"
                  >
                    <img
                      src={p.playerImg}
                      alt={p.playerName}
                      className="w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-200"
                    />
                    <p className="text-sm font-semibold">{p.playerName}</p>
                    <p className="text-xs text-gray-500">{p.teamName}</p>

                    {/* C/VC badges */}
                    {p.isCaptain && (
                      <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded">
                        C
                      </span>
                    )}
                    {p.isViceCaptain && (
                      <span className="absolute top-2 left-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded">
                        VC
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
