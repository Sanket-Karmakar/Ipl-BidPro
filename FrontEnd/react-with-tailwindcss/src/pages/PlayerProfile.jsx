// src/pages/PlayerProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PlayerProfile() {
  const { name } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlayer() {
      try {
        setLoading(true);
        const res = await fetch(`/api/players/by-name/${encodeURIComponent(name)}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load player");
        }

        setPlayer(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayer();
  }, [name]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading player...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">⚠️ {error}</p>;
  if (!player) return <p className="text-center mt-10">No player found.</p>;

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const age = new Date(difference).getUTCFullYear() - 1970;
    return `(${age} years)`;
  };

  // Helper to dynamically get available formats for a given function (batting/bowling)
  const getAvailableFormats = (fn) => {
    if (!player.stats) return [];
    const formats = new Set();
    player.stats.forEach((s) => {
      if (s.fn === fn) formats.add(s.matchType);
    });
    const order = ["Test", "ODI", "T20I", "T20", "IPL"];
    return Array.from(formats).sort((a, b) => {
      let indexA = order.indexOf(a);
      let indexB = order.indexOf(b);
      if (indexA === -1) indexA = 99;
      if (indexB === -1) indexB = 99;
      return indexA - indexB;
    });
  };

  // Helper to render the transposed career summary tables
  const renderCareerSummary = (fn) => {
    const formats = getAvailableFormats(fn);
    if (formats.length === 0) return <p className="text-gray-500">No {fn} stats available.</p>;

    let rows = [];
    if (fn === "batting") {
      rows = [
        { label: "Matches", key: "matches" },
        { label: "Innings", key: "innings" },
        { label: "Runs", key: "runs" },
        { label: "Balls", key: "ballsFaced" },
        { label: "Highest", key: "highScore" },
        { label: "Average", key: "average" },
        { label: "SR", key: "strikeRate" },
        { label: "Not Out", key: "notOuts" },
        { label: "Fours", key: "fours" },
        { label: "Sixes", key: "sixes" },
        { label: "50s", key: "fifties" },
        { label: "100s", key: "hundreds" },
        { label: "200s", key: "doubleHundreds" },
      ];
    } else {
      rows = [
        { label: "Matches", key: "matches" },
        { label: "Innings", key: "innings" },
        { label: "Balls", key: "ballsBowled" },
        { label: "Runs", key: "runs" },
        { label: "Wickets", key: "wickets" },
        { label: "BBI", key: "bestInnings" },
        { label: "BBM", key: "bestMatch" },
        { label: "Econ", key: "economy" },
        { label: "Avg", key: "average" },
        { label: "SR", key: "strikeRate" },
        { label: "5w", key: "fiveWicketHaul" },
        { label: "10w", key: "tenWicketHaul" },
      ];
    }

    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700 bg-white"></th>
              {formats.map((fmt) => (
                <th key={fmt} className="px-4 py-3 font-semibold text-gray-700 text-center uppercase">
                  {fmt}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, idx) => (
              <tr key={row.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-800">{row.label}</td>
                {formats.map((fmt) => {
                  const statObj = player.stats.find(
                    (s) => s.matchType === fmt && s.fn === fn && s.stat === row.key
                  );
                  return (
                    <td key={`${row.key}-${fmt}`} className="px-4 py-3 text-center text-gray-600">
                      {statObj ? statObj.value || "-" : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar - Profile Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={player.playerImg || "https://via.placeholder.com/150"}
                alt={player.name}
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
                <p className="text-gray-500 font-medium">{player.country || "Unknown Country"}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 font-medium">Born</p>
                <p className="text-gray-800 font-semibold">
                  {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "N/A"} {calculateAge(player.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Birth Place</p>
                <p className="text-gray-800 font-semibold">{player.placeOfBirth || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Role</p>
                <p className="text-gray-800 font-semibold">{player.role || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Batting Style</p>
                <p className="text-gray-800 font-semibold">{player.battingStyle || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Bowling Style</p>
                <p className="text-gray-800 font-semibold">{player.bowlingStyle || "N/A"}</p>
              </div>
            </div>
          </div>
          
          {/* AI Biography Summary */}
          {player.biography && (
            <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 bg-yellow-50 border-b border-yellow-100">
                <h2 className="text-xl font-semibold text-yellow-900">Career Summary</h2>
              </div>
              <div className="p-6 text-gray-800 leading-relaxed whitespace-pre-line">
                {player.biography}
              </div>
            </div>
          )}
        </div>

        {/* Right Content - Stats Tables */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800 inline-block">Batting Career Summary</h2>
            {renderCareerSummary("batting")}
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800 inline-block">Bowling Career Summary</h2>
            {renderCareerSummary("bowling")}
          </div>
        </div>

      </div>
    </div>
  );
}
