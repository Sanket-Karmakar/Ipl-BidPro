import React, { useEffect, useState } from "react";
import { fetchPlayer } from "../services/playerService";
import { normalizePlayerStats } from "../utils/normalizePlayerStats";

const PlayerStatsSimple = ({ playerId, format = "ipl" }) => {
  const [player, setPlayer] = useState(null);
  const [normalized, setNormalized] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await fetchPlayer(playerId);
        setPlayer(raw);
        const norm = normalizePlayerStats(raw);
        setNormalized(norm);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [playerId]);

  if (loading) return <div className="text-white">Loading player...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!player || !normalized) return <div className="text-white">No data</div>;

  const batting = normalized.batting?.[format] || {};
  const bowling = normalized.bowling?.[format] || {};

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 max-w-md shadow-md">
      <div className="flex items-center gap-4 mb-3">
        {player.playerImg && (
          <img
            src={player.playerImg}
            alt={player.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{player.name}</h2>
          <p className="text-sm">{player.role}</p>
          <p className="text-xs text-gray-400">{player.country}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-1">Batting ({format.toUpperCase()})</h3>
          <p>Avg: {batting.avg ?? "N/A"}</p>
          <p>SR: {batting.sr ?? batting.strikerate ?? "N/A"}</p>
          <p>100s: {batting["100s"] ?? batting["100"] ?? "N/A"}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Bowling ({format.toUpperCase()})</h3>
          <p>Avg: {bowling.avg ?? "N/A"}</p>
          <p>Eco: {bowling.econ ?? bowling.economy ?? "N/A"}</p>
          <p>Wkts: {bowling.wkts ?? bowling.wickets ?? "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsSimple;
