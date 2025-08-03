import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Utility function to normalize stats
function normalizePlayerStats(raw) {
  const result = { batting: {}, bowling: {} };
  if (!raw?.stats) return result;

  raw.stats.forEach(entry => {
    const matchType = entry.matchType; // e.g., "ipl"
    entry.stats.forEach(s => {
      const category = s.type.toLowerCase(); // "batting" or "bowling"
      const statKey = s.stat.trim().toLowerCase().replace(/\s+/g, "");
      const rawValue = s.value?.trim() ?? "";
      const value = isNaN(Number(rawValue)) ? rawValue : Number(rawValue);

      if (!result[category][matchType]) result[category][matchType] = {};
      result[category][matchType][statKey] = value;
    });
  });

  return result;
}

const PlayerAnalysis = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [normalizedStats, setNormalizedStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Adjust the URL to match your backend route & port
        const res = await fetch(`http://localhost:5001/api/players/${id}`);
        if (!res.ok) throw new Error("Failed to fetch player data");

        const json = await res.json();
        const playerData = json.data || json; // adapt if backend wraps in { data }

        setPlayer(playerData);
        setNormalizedStats(normalizePlayerStats(playerData));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPlayer();
    }
  }, [id]);

  if (loading) return <div className="text-white p-4">Loading player data...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!player || !normalizedStats) return <div className="text-white p-4">No player data found</div>;

  const battingIPL = normalizedStats.batting?.ipl || {};
  const bowlingIPL = normalizedStats.bowling?.ipl || {};

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-900 to-black min-h-screen text-white">
      {/* Player Profile */}
      <div className="flex items-center gap-6 mb-6">
        {player.playerImg && (
          <img
            src={player.playerImg}
            alt={player.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{player.name}</h1>
          <p className="text-lg">{player.role}</p>
          <p className="text-gray-300">{player.country}</p>
        </div>
      </div>

      {/* IPL Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batting Stats */}
        <div className="bg-black/30 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Batting (IPL)</h2>
          <p>Average: {battingIPL.avg ?? "N/A"}</p>
          <p>Strike Rate: {battingIPL.sr ?? battingIPL.strikerate ?? "N/A"}</p>
          <p>100s: {battingIPL["100s"] ?? battingIPL["100"] ?? "N/A"}</p>
          <p>50s: {battingIPL["50s"] ?? battingIPL["50"] ?? "N/A"}</p>
          <p>Runs: {battingIPL.runs ?? "N/A"}</p>
        </div>

        {/* Bowling Stats */}
        <div className="bg-black/30 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Bowling (IPL)</h2>
          <p>Average: {bowlingIPL.avg ?? "N/A"}</p>
          <p>Economy: {bowlingIPL.econ ?? bowlingIPL.economy ?? "N/A"}</p>
          <p>Wickets: {bowlingIPL.wkts ?? bowlingIPL.wickets ?? "N/A"}</p>
          <p>Strike Rate: {bowlingIPL.sr ?? "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerAnalysis;
