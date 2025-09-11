import { useEffect, useState } from "react";
import MatchCard from "../Components/MatchCard";

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Live" },
  { key: "completed", label: "Completed" },
];

const MatchesPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5001/api/matches/${activeTab}`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Cricket Matches
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full font-medium ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Matches Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading matches...</p>
      ) : matches.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {matches.map((match) => (
            <MatchCard key={match.matchId} match={match} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No matches found</p>
      )}
    </div>
  );
};

export default MatchesPage;
