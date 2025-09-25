// src/pages/CVCSelectionPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SavedTeamModal from "../Components/SavedTeamModal.jsx";
import { useAuth } from "../context/UserContext.jsx";
import { normalizeRole } from "../utils/roleUtils.js";

export default function CVCSelectionPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const editTeam = state?.editTeam || null;
  const matchId = state?.matchId;
  const initialSelected = state?.selectedPlayers || [];
  const [selectedPlayers, setSelectedPlayers] = useState(initialSelected);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token } = useAuth();

  // If editing, preselect C/VC from editTeam
  useEffect(() => {
    if (editTeam) {
      // if editTeam has captain set via isCaptain flags, find them
      const cap = editTeam.players.find((p) => p.isCaptain)?.playerId;
      const vice = editTeam.players.find((p) => p.isViceCaptain)?.playerId;
      if (cap) setCaptain(cap);
      if (vice) setViceCaptain(vice);

      // ensure selectedPlayers are in the same shape (if we didn't get from CreateTeamPage)
      if (!initialSelected.length) {
        setSelectedPlayers(
          editTeam.players.map((p) => ({
            id: p.playerId,
            name: p.playerName,
            playerImg: p.playerImg ?? "",
            role: p.role ?? "",
            teamName: p.teamName ?? "",
            credits: p.credits ?? 8,
          }))
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTeam]);

  const handleSave = async () => {
    try {
      if (!token) {
        alert("You must be logged in to save a team.");
        return;
      }

      const teamName = editTeam ? editTeam.teamName : `MyTeam (T${Date.now()})`;

      // Prepare players with consistent keys
      const formattedPlayers = selectedPlayers.map((p) => ({
        playerId: p.id ?? p.playerId,
        playerName: p.name ?? p.playerName,
        role: normalizeRole(p.role ?? p.roleName ?? ""),
        isCaptain: captain === (p.id ?? p.playerId),
        isViceCaptain: viceCaptain === (p.id ?? p.playerId),
        playerImg: p.playerImg ?? p.image ?? "`https://h.cricapi.com/img/players/${p.playerId}.jpg`",
        teamName: p.teamName || "",
      }));

      const payload = { matchId, teamName, players: formattedPlayers };
      console.log("Formatted Players before save:", formattedPlayers);

      let res;
      if (editTeam) {
        res = await fetch(`http://localhost:5001/api/teams/${editTeam._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:5001/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

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
      <h1 className="text-xl font-bold text-center mb-4">Select Captain & Vice Captain</h1>

      <div className="space-y-3">
        {selectedPlayers.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-white shadow rounded-lg p-3">
            <div className="flex items-center gap-3">
              <img src={p.playerImg || "https://via.placeholder.com/80"} alt={p.name ?? p.playerName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{p.name ?? p.playerName}</p>
                <p className="text-xs text-gray-500">{normalizeRole(p.role)}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setCaptain(p.id)} className={`px-3 py-1 rounded-full ${captain === p.id ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}>C</button>
              <button onClick={() => setViceCaptain(p.id)} className={`px-3 py-1 rounded-full ${viceCaptain === p.id ? "bg-green-600 text-white" : "bg-gray-200 text-black"}`}>VC</button>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 left-0 w-full flex justify-center p-4 bg-white shadow-md">
        <button disabled={!captain || !viceCaptain} onClick={handleSave} className={`px-6 py-2 rounded-lg font-semibold ${!captain || !viceCaptain ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {editTeam ? "Update Team" : "Save Team"}
        </button>
      </div>

      <SavedTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDone={() => {
          setIsModalOpen(false);
          navigate(`/matches/${matchId}/contests`);
        }}
        team={{
          teamName: editTeam ? editTeam.teamName : "My Fantasy XI",
          players: selectedPlayers,
          captain: selectedPlayers.find((p) => p.id === captain),
          viceCaptain: selectedPlayers.find((p) => p.id === viceCaptain),
        }}
      />
    </div>
  );
}
