import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeamCard from "../components/TeamCard";

export default function ContestPage() {
  const [activeTab, setActiveTab] = useState("contests");
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedTeams") || "[]");
    const matchTeams = saved.filter((t) => t.matchId === matchId);
    setTeams(matchTeams);
  }, [matchId, activeTab]);

  const renderContent = () => {
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
              teams.map((team, idx) => (
                <TeamCard
                  key={idx}
                  team={team}
                  onEdit={() => navigate(`/matches/${matchId}/create-team`)}
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
              activeTab === tab ? "text-red-600 border-b-2 border-red-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "mycontests" ? "My Contests (0)" : tab === "teams" ? `Teams (${teams.length})` : "Contests"}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
