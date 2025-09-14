// src/pages/PlayerProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlayer() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5001/api/players/${id}`);
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
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading player...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">⚠️ {error}</p>;
  if (!player) return <p className="text-center mt-10">No player found.</p>;

  // helper
  const renderTable = (fn) => (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-200 text-gray-800">
            <th className="border border-gray-300 px-3 py-2">Format</th>
            <th className="border border-gray-300 px-3 py-2">Matches</th>
            <th className="border border-gray-300 px-3 py-2">Innings</th>
            {fn === "batting" ? (
              <>
                <th className="border border-gray-300 px-3 py-2">Runs</th>
                <th className="border border-gray-300 px-3 py-2">Avg</th>
                <th className="border border-gray-300 px-3 py-2">SR</th>
                <th className="border border-gray-300 px-3 py-2">100s</th>
                <th className="border border-gray-300 px-3 py-2">50s</th>
              </>
            ) : (
              <>
                <th className="border border-gray-300 px-3 py-2">Wickets</th>
                <th className="border border-gray-300 px-3 py-2">Economy</th>
                <th className="border border-gray-300 px-3 py-2">BBI</th>
                <th className="border border-gray-300 px-3 py-2">5W</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {["Test", "ODI", "T20I", "IPL"].map((format) => {
            const stats = player.stats?.filter(
              (s) => s.matchType?.toLowerCase() === format.toLowerCase() && s.fn === fn
            );
            if (!stats?.length) return null;

            const find = (stat) => stats.find((s) => s.stat === stat)?.value || "-";

            return (
              <tr key={format} className="text-center">
                <td className="border border-gray-300 px-3 py-2 font-semibold">{format}</td>
                <td className="border border-gray-300 px-3 py-2">{find("matches")}</td>
                <td className="border border-gray-300 px-3 py-2">{find("innings")}</td>
                {fn === "batting" ? (
                  <>
                    <td className="border border-gray-300 px-3 py-2">{find("runs")}</td>
                    <td className="border border-gray-300 px-3 py-2">{find("average")}</td>
                    <td className="border border-gray-300 px-3 py-2">{find("strikeRate")}</td>
                    <td className="border border-gray-300 px-3 py-2">{find("hundreds")}</td>
                    <td className="border border-gray-300 px-3 py-2">{find("fifties")}</td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-300 px-3 py-2">{find("wickets")}</td>
                    <td className="border border-gray-300 px-3 py-2">{find("economy")}</td>
                    <td className="border border-gray-300 px-3 py-2">{find("bestBowlingInnings")}</td>
                    <td className="border border-gray-300 px-3 py-2">{find("fiveWicketHaul")}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <img
            src={player.playerImg || "https://via.placeholder.com/150"}
            alt={player.name}
            className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold">{player.name}</h1>
            <p className="text-lg">{player.role} | {player.country}</p>
            <p className="text-sm">Batting: {player.battingStyle} | Bowling: {player.bowlingStyle}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3">Personal Info</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><b>Date of Birth:</b> {new Date(player.dateOfBirth).toDateString()}</p>
            <p><b>Place of Birth:</b> {player.placeOfBirth || "N/A"}</p>
          </div>
        </div>

        {/* Batting Stats */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3">Batting Career</h2>
          {renderTable("batting")}
        </div>

        {/* Bowling Stats */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3">Bowling Career</h2>
          {renderTable("bowling")}
        </div>
      </div>
    </div>
  );
}
