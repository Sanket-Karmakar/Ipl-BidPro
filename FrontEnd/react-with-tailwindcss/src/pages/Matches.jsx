// src/pages/Matches.jsx
import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";

function Matches() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let endpoint = "";
    if (activeTab === "upcoming") endpoint = "/api/matches/upcoming";
    if (activeTab === "ongoing") endpoint = "/api/matches/ongoing";
    if (activeTab === "completed") endpoint = "/api/matches/completed";

    setLoading(true);
    fetch(`http://localhost:5001${endpoint}`)
      .then((res) => res.json())
      .then((data) => {
        // Some APIs return [] others return {}
        setMatches(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex justify-around border-b mb-4">
        {["upcoming", "ongoing", "completed"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500">Loading matches...</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500 mt-8 font-bold">
          {activeTab === "ongoing"
            ? "No ongoing matches are live right now ⚡"
            : "No matches available"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;
