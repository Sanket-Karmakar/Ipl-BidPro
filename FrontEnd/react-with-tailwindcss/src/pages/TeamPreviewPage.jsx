import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function TeamPreviewPage() {
  const { teamId } = useParams(); // we'll pass index or id of team
  const navigate = useNavigate();

  // Fetch teams from localStorage
  const allTeams = JSON.parse(localStorage.getItem("savedTeams") || "[]");
  const team = allTeams[teamId]; // teamId is index in savedTeams array

  if (!team) {
    return <p className="text-center mt-10">Team not found!</p>;
  }

  // Group players
  const grouped = {
    WK: [],
    BAT: [],
    AR: [],
    BOWL: [],
  };

  team.players.forEach((p) => {
    const role = p.role.toLowerCase();
    if (role.includes("wk")) grouped.WK.push(p);
    else if (role.includes("bat")) grouped.BAT.push(p);
    else if (role.includes("allrounder") || role.includes("ar")) grouped.AR.push(p);
    else if (role.includes("bowl")) grouped.BOWL.push(p);
  });

  // Count players from each country
  const teamCount = team.players.reduce((acc, p) => {
    acc[p.teamName] = (acc[p.teamName] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(teamCount);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow px-4 py-3 rounded-md mb-4">
        <h1 className="font-bold text-lg">{team.teamName}</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-red-500 font-semibold"
        >
          ✖ Close
        </button>
      </div>

      {/* Team Distribution */}
      <div className="flex justify-between text-sm font-semibold bg-gray-200 px-4 py-2 rounded mb-4">
        <p>Players: {team.players.length}/11</p>
        {entries.length === 2 && (
          <p>
            {entries[0][0]} {entries[0][1]} : {entries[1][0]} {entries[1][1]}
          </p>
        )}
      </div>

      {/* Player Groups */}
      {Object.entries(grouped).map(([role, players]) => (
        <div key={role} className="mb-6">
          <h2 className="text-center font-bold text-gray-700 mb-3">{role}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex flex-col items-center bg-white shadow rounded-lg p-3 relative"
              >
                <img
                  src={p.playerImg || "https://via.placeholder.com/80"}
                  alt={p.name}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-gray-500">{p.credits} Cr</p>

                {/* Captain / Vice-Captain badges */}
                {team.captain?.id === p.id && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    C
                  </span>
                )}
                {team.viceCaptain?.id === p.id && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    VC
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
