// src/pages/ViewTeamPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { categorizeRole, roleLabel } from "../utils/roleUtils";

export default function ViewTeamPage() {
  const { matchId, teamIndex } = useParams();
  const navigate = useNavigate();

  // Load teams from localStorage
  const saved = JSON.parse(localStorage.getItem("savedTeams") || "[]");
  const matchTeams = saved.filter((t) => t.matchId === matchId);
  const team = matchTeams[teamIndex];

  if (!team) {
    return <p className="text-center mt-10 text-red-500">Team not found!</p>;
  }

  // Group players by corrected roles
  const grouped = { WK: [], BAT: [], AR: [], BOWL: [] };
  team.players.forEach((p) => {
    const key = categorizeRole(p.role);
    if (grouped[key]) grouped[key].push(p);
    else grouped.BAT.push(p); // fallback → BAT
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
      {Object.entries(grouped).map(([role, players]) => (
        players.length > 0 && (
          <div key={role} className="mb-6">
            <h2 className="text-lg font-semibold mb-3">{roleLabel(role)}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg shadow p-3 flex flex-col items-center relative"
                >
                  <img
                    src={p.playerImg || "https://via.placeholder.com/80"}
                    alt={p.name}
                    className="w-16 h-16 rounded-full mb-2 object-cover"
                  />
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.teamName}</p>

                  {/* Show C / VC badges */}
                  {team.captain?.id === p.id && (
                    <span className="absolute top-1 right-2 bg-blue-100 text-blue-600 text-xs font-bold px-1.5 py-0.5 rounded">
                      C
                    </span>
                  )}
                  {team.viceCaptain?.id === p.id && (
                    <span className="absolute top-1 left-2 bg-green-100 text-green-600 text-xs font-bold px-1.5 py-0.5 rounded">
                      VC
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
