// src/pages/ScorecardHub.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ScorecardHub() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIplMatches = () => {
      fetch("/api/matches/series/ipl2026")
        .then((res) => res.json())
        .then((data) => {
          setMatches(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };

    fetchIplMatches();
    const intervalId = setInterval(fetchIplMatches, 60000); // refresh every minute

    return () => clearInterval(intervalId);
  }, []);

  // Group matches by Date
  const groupedMatches = matches.reduce((acc, match) => {
    // Attempt to use dateTimeGMT, fallback to date
    const dateStr = match.dateTimeGMT || match.date;
    if (!dateStr) return acc;
    
    const d = new Date(dateStr);
    // Format: "SUN, MAR 29 2026"
    const formattedDate = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    }).toUpperCase().replace(/,/g, '');

    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(match);
    return acc;
  }, {});

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-8 pt-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header section (Cricbuzz style) */}
        <div className="bg-[#009270] rounded-t-lg px-4 py-3 text-white flex gap-6 text-[15px] font-medium shadow-sm">
          <span>MATCHES</span>
          <span className="text-[#a4d4c4]">Indian Premier League 2026</span>
        </div>

        <div className="bg-white shadow-sm rounded-b-lg p-6 min-h-[500px]">
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="w-8 h-8 border-4 border-[#009270] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : Object.keys(groupedMatches).length === 0 ? (
            <p className="text-center text-gray-500 mt-12 font-bold text-lg">
              No matches found for IPL 2026.
            </p>
          ) : (
            Object.keys(groupedMatches).map((dateKey) => (
              <div key={dateKey} className="mb-8">
                {/* Date Header */}
                <div className="bg-[#e2e6e4] px-4 py-2 font-bold text-[#4a4a4a] text-[15px] mb-4 tracking-wide">
                  {dateKey}
                </div>

                {/* Match List for the date */}
                <div className="space-y-6">
                  {groupedMatches[dateKey].map((match, idx) => {
                    // Extract data safely
                    const isLive = match.matchStarted && !match.matchEnded;
                    const teams = match.teamInfo || [];
                    const scores = match.score || [];

                    return (
                      <div 
                        key={match.matchId || idx}
                        onClick={() => navigate(`/matches/${match.matchId}/scorecard`)}
                        className="group flex flex-col gap-2 cursor-pointer border-b border-gray-100 pb-5 hover:bg-gray-50 p-2 -mx-2 rounded transition"
                      >
                        {/* Meta info row */}
                        <div className="flex justify-between text-[#666666] text-[13px] font-medium">
                          <span>{match.name || "Match"} • {match.venue || "Venue TBD"}</span>
                          {isLive && (
                             <span className="text-red-500 font-bold px-2 py-0.5 bg-red-50 rounded-full animate-pulse text-[11px]">LIVE</span>
                          )}
                        </div>

                        {/* Teams row */}
                        <div className="flex flex-col gap-2 mt-2">
                          {/* Team 1 */}
                          {teams[0] && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {teams[0].img && (
                                  <img src={teams[0].img} alt={teams[0].name} className="w-6 h-6 object-contain" />
                                )}
                                <span className={`text-[15px] ${!match.matchEnded ? "font-semibold" : ""}`}>
                                  {teams[0].name}
                                </span>
                              </div>
                              {scores[0] && (
                                <span className="font-bold text-[15px]">
                                  {scores[0].r}-{scores[0].w} <span className="text-[#4a4a4a] font-normal">({scores[0].o})</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Team 2 */}
                          {teams[1] && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {teams[1].img && (
                                  <img src={teams[1].img} alt={teams[1].name} className="w-6 h-6 object-contain" />
                                )}
                                <span className={`text-[15px] ${match.matchEnded ? "font-semibold" : ""}`}>
                                  {teams[1].name}
                                </span>
                              </div>
                              {scores[1] && (
                                <span className="font-bold text-[15px]">
                                  {scores[1].r}-{scores[1].w} <span className="text-[#4a4a4a] font-normal">({scores[1].o})</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Fallback when score array empty for completed matches */}
                          {match.matchEnded && scores.length === 0 && (
                            <p className="text-[12px] text-gray-400 italic text-center mt-1">Score data syncing...</p>
                          )}
                        </div>

                        {/* Status row */}
                        <div className="mt-1">
                          <span className={`text-[13px] font-medium ${isLive ? 'text-red-500' : 'text-[#006cb7]'}`}>
                            {match.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ScorecardHub;
