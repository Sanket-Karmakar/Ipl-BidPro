import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import SavedTeamModal from "../Components/SavedTeamModal.jsx";

export default function CVCSelectionPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const matchId = state?.matchId;
  const selectedPlayers = state?.selectedPlayers || [];
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token"); // 👈 JWT
      if (!token) {
        alert("You must be logged in to save a team.");
        return;
      }

      const teamName = `MyTeam (T${Date.now()})`;

      const formattedPlayers = selectedPlayers.map((p) => ({
        playerId: p.id,
        playerName: p.name,
        role: p.role,
        isCaptain: captain === p.id,
        isViceCaptain: viceCaptain === p.id,
      }));

      const res = await fetch("http://localhost:5001/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId,
          teamName,
          players: formattedPlayers,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save team");
      }

      await res.json();
      setIsModalOpen(true);
    } catch (error) {
      console.error("❌ Error saving team:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-bold text-center mb-4">
        Select Captain & Vice Captain
      </h1>

      <div className="space-y-3">
        {selectedPlayers.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-white shadow rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.playerImg || "https://via.placeholder.com/80"}
                alt={p.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-gray-500">{p.role}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCaptain(p.id)}
                className={`px-3 py-1 rounded-full ${
                  captain === p.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                C
              </button>
              <button
                onClick={() => setViceCaptain(p.id)}
                className={`px-3 py-1 rounded-full ${
                  viceCaptain === p.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                VC
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 left-0 w-full flex justify-center p-4 bg-white shadow-md">
        <button
          disabled={!captain || !viceCaptain}
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg font-semibold ${
            !captain || !viceCaptain
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Save Team
        </button>
      </div>

      {/* ✅ Popup */}
      <SavedTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDone={() => {
          setIsModalOpen(false);
          navigate(`/matches/${matchId}/contests`);
        }}
        team={{
          teamName: "My Fantasy XI",
          players: selectedPlayers,
          captain: selectedPlayers.find((p) => p.id === captain),
          viceCaptain: selectedPlayers.find((p) => p.id === viceCaptain),
        }}
      />
    </div>
  );
}
