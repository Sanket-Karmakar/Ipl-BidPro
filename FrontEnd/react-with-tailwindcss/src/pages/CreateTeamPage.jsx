// src/pages/CreateTeamPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlayerList from "../components/PlayerList";

export default function CreateTeamPage() {
  const { matchId } = useParams();
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSquads() {
      try {
        const res = await fetch(`http://localhost:5001/api/matches/${matchId}/squads`);
        const data = await res.json();

        if (data?.squads?.length) {
          const merged = data.squads.flatMap((team) =>
            team.players.map((p) => ({
              ...p,
              teamName: team.teamName,
              teamFlag: team.teamFlag,
              credits: (Math.random() * (9 - 6.5) + 6.5).toFixed(1),
              points: 0,
            }))
          );
          setPlayers(merged);
        }
      } catch (err) {
        console.error("Error fetching squads", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSquads();
  }, [matchId]);

  const toggleSelect = (player) => {
    setSelectedPlayers((prev) => {
      if (prev.find((p) => p.id === player.id)) {
        return prev.filter((p) => p.id !== player.id);
      } else if (prev.length < 11) {
        return [...prev, player];
      }
      return prev;
    });
  };

  // Selection Rules
  const teamCount = selectedPlayers.reduce((acc, p) => {
    acc[p.teamName] = (acc[p.teamName] || 0) + 1;
    return acc;
  }, {});

  const totalCredits = selectedPlayers.reduce((sum, p) => sum + parseFloat(p.credits), 0);

  const isValidTeam =
    selectedPlayers.length === 11 &&
    totalCredits <= 100 &&
    Object.values(teamCount).every((count) => count >= 4 && count <= 7);

  if (loading) return <p className="text-center mt-10">Loading squads...</p>;
  if (!players.length) return <p className="text-center mt-10">No squads found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="font-bold">Create Your Team</h1>
        <div className="text-sm font-semibold text-blue-600">
          {selectedPlayers.length}/11 • {totalCredits.toFixed(1)}/100 Cr
        </div>
      </div>

      {/* Player List */}
      <PlayerList
        players={players}
        selectedPlayers={selectedPlayers}
        toggleSelect={toggleSelect}
      />

      {/* Bottom Bar */}
      <div className="sticky bottom-0 left-0 w-full flex justify-between p-4 bg-white shadow-md">
        <button className="bg-gray-200 px-6 py-2 rounded-lg font-semibold">
          Preview
        </button>
        <button
  disabled={!isValidTeam}
  onClick={() =>
    navigate(`/matches/${matchId}/select-cvc`, {
      state: { selectedPlayers, matchId }, // ✅ pass matchId in state
    })
  }
  className={`px-6 py-2 rounded-lg font-semibold ${
    !isValidTeam
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`}
>
  Next
</button>

      </div>
    </div>
  );
}
