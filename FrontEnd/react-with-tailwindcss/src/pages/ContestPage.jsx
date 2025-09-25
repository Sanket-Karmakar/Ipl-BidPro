// src/pages/ContestPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import TeamCard from "../components/TeamCard";
import { normalizeRole } from "../utils/roleUtils";

export default function ContestPage() {
  const [activeTab, setActiveTab] = useState("contests");
  const { matchId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const { token } = useAuth();

  const isBlocked =
    state?.matchEnded || state?.status?.toLowerCase().includes("live");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (!token) return;
        const res = await fetch(`http://localhost:5001/api/teams/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch teams");
        }

        let data = await res.json();

        data = data.map((t) => ({
          ...t,
          players: t.players.map((p) => ({
            ...p,
            role: normalizeRole(p.role),
          })),
        }));

        setTeams(data);
      } catch (error) {
        console.error("❌ Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [matchId, activeTab, token]);

  const handleRemove = async (teamId) => {
    try {
      if (!token) return;

      const res = await fetch(`http://localhost:5001/api/teams/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete team");
      }

      setTeams((prev) => prev.filter((t) => t._id !== teamId));
    } catch (error) {
      console.error("❌ Error deleting team:", error);
      alert(error.message);
    }
  };

  const renderContent = () => {
    if (isBlocked) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <p className="text-gray-700 mb-4 font-medium">
            You haven’t joined any contest for this match.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "contests":
        return <div className="p-6 text-center">No Available Contests</div>;

      case "teams":
        return (
          <div className="p-6">
            {teams.length === 0 ? (
              <div className="flex flex-col items-center text-center">
                <p className="text-gray-600 mb-4">You haven’t created a team yet.</p>
                <button
                  onClick={() => navigate(`/matches/${matchId}/create-team`)}
                  className="bg-green-500 text-white px-5 py-2 rounded-md font-bold hover:bg-green-600"
                >
                  CREATE A TEAM
                </button>
              </div>
            ) : (
              teams.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
                  onEdit={() =>
                    navigate(`/matches/${matchId}/create-team`, {
                      state: { editTeam: team },
                    })
                  }
                  onView={() =>
                    navigate(`/matches/${matchId}/view-team/${team._id}`)
                  }
                  onRemove={() => handleRemove(team._id)}
                />
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex border-b bg-white">
        {["contests", "mycontests", "teams"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 font-semibold ${
              activeTab === tab
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "mycontests"
              ? "My Contests (0)"
              : tab === "teams"
              ? `Teams (${teams.length})`
              : "Contests"}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}
