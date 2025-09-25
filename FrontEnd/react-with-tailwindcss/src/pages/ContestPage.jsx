// src/pages/ContestPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TeamCard from "../components/TeamCard";

export default function ContestPage() {
  const [activeTab, setActiveTab] = useState("contests");
  const { matchId } = useParams();
  const { state } = useLocation(); // 👈 get passed match info
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  const isBlocked =
    state?.matchEnded || state?.status?.toLowerCase().includes("live");

  useEffect(() => {
  async function fetchTeams() {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5001/api/teams/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setTeams(data.data);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  }
  fetchTeams();
}, [matchId, activeTab]);

  const renderContent = () => {
    // 🚫 If match is completed or ongoing → block Create Team
    if (isBlocked) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <img
            src="https://preview.redd.it/are-these-fake-teams-created-by-dream-11-v0-io0lg1hp6asc1.png?width=1080&crop=smart&auto=webp&s=7b6b2b43c299d6782aba8e1cf995f3774ba13a91"
            alt="No Contest"
            className="h-32 w-32 mb-6 opacity-80"
          />
          <p className="text-gray-700 mb-4 font-medium">
            You haven’t joined any contest for this match. <br />
            Join the action for upcoming matches and start winning!
          </p>
<button
  onClick={() =>
    navigate(`/matches/${matchId}/create-team`, {
      state: { contestId: contest._id } // 👈 pass contest id here
    })
  }
  className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600"
>
  VIEW UPCOMING MATCHES
</button>
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
                <p className="text-gray-600 mb-4">
                  You haven’t created a team yet.
                </p>
                <button
                  onClick={() => navigate(`/matches/${matchId}/create-team`)}
                  className="bg-green-500 text-white px-5 py-2 rounded-md font-bold hover:bg-green-600"
                >
                  CREATE A TEAM
                </button>
              </div>
            ) : (
              // Inside case "teams"
teams.map((team, idx) => (
  <TeamCard
    key={idx}
    team={team}
    onEdit={() => navigate(`/matches/${matchId}/create-team`)}
    onView={() => navigate(`/matches/${matchId}/view-team/${idx}`)}
    onRemove={() => {
      const saved = JSON.parse(localStorage.getItem("savedTeams") || "[]");
      const matchTeams = saved.filter((t) => t.matchId === matchId);

      matchTeams.splice(idx, 1); // remove by index
      const newTeams = saved.filter((t) => t.matchId !== matchId).concat(matchTeams);

      localStorage.setItem("savedTeams", JSON.stringify(newTeams));
      setTeams(matchTeams); // refresh UI
    }}
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
      {/* Tabs */}
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