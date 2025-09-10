import { useEffect, useState } from "react";
import MatchCard from "../Components/MatchCard"

const Matches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/matches/upcoming")
      .then((res) => res.json())
      .then((data) => setMatches(data || [])) // API gives [] directly
      .catch((err) => console.error("Error fetching matches:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
        Upcoming Matches
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchCard key={match.matchId} match={match} />
          ))
        ) : (
          <p className="text-gray-600 text-center">No matches available</p>
        )}
      </div>
    </div>
  );
};

export default Matches;
