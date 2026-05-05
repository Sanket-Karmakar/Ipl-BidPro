// src/pages/MyTeams.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeRole, categorizeRole } from "../utils/roleUtils";

export default function MyTeams() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/teams/all/my-teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch teams");
        const data = await res.json();
        setTeams(data.teams || []);
      } catch (err) {
        console.error("Error fetching my teams:", err);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [token]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <p className="text-white text-lg">
          Please{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 cursor-pointer underline"
          >
            login
          </span>{" "}
          to view your teams.
        </p>
      </div>
    );
  }

  // Group teams by matchId
  const grouped = {};
  teams.forEach((t) => {
    if (!grouped[t.matchId]) grouped[t.matchId] = { match: t.matchData, teams: [] };
    grouped[t.matchId].teams.push(t);
  });

  const matchEntries = Object.values(grouped);

  const getRoleCounts = (players) => {
    const counts = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };
    (players || []).forEach((p) => {
      const key = categorizeRole(normalizeRole(p.role));
      if (counts[key] !== undefined) counts[key]++;
    });
    return counts;
  };

  const getStatusColor = (match) => {
    if (!match) return "bg-gray-500";
    if (match.matchEnded) return "bg-emerald-500";
    if (match.matchStarted) return "bg-red-500";
    return "bg-blue-500";
  };

  const getStatusText = (match) => {
    if (!match) return "Unknown";
    if (match.matchEnded) return "Completed";
    if (match.matchStarted) return "Live";
    return "Upcoming";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800/80 via-purple-800/80 to-indigo-800/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            👥 My Teams
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            All your fantasy teams across IPL matches — {teams.length} team
            {teams.length !== 1 ? "s" : ""} in {matchEntries.length} match
            {matchEntries.length !== 1 ? "es" : ""}
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading your teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-6xl mb-4">🏏</p>
            <h2 className="text-2xl font-bold text-white mb-2">No Teams Yet</h2>
            <p className="text-gray-400 mb-6 max-w-sm">
              Head to Matches, pick a match, and create your first fantasy team!
            </p>
            <button
              onClick={() => navigate("/matches")}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Browse Matches
            </button>
          </div>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {matchEntries.map(({ match, teams: matchTeams }, mIdx) => (
              <motion.div
                key={match?.matchId || mIdx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
              >
                {/* Match Header */}
                <div
                  className="p-4 md:p-5 cursor-pointer hover:bg-white/5 transition"
                  onClick={() =>
                    match &&
                    navigate(`/matches/${match.matchId}/contests`, {
                      state: {
                        status: match.status,
                        matchEnded: match.matchEnded,
                      },
                    })
                  }
                >
                  <div className="flex items-start gap-4">
                    {/* Team logos */}
                    <div className="flex items-center gap-2 shrink-0">
                      {match?.teamInfo?.map((t, i) => (
                        <img
                          key={i}
                          src={t.img}
                          alt={t.shortname}
                          className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg bg-white/10 p-1"
                        />
                      ))}
                    </div>

                    {/* Match info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm md:text-base truncate">
                        {match?.name || "Unknown Match"}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">
                        📍 {match?.venue || "—"} •{" "}
                        {match?.dateTimeGMT
                          ? new Date(match.dateTimeGMT).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(
                        match
                      )}`}
                    >
                      {getStatusText(match)}
                    </span>
                  </div>

                  {/* Result line */}
                  {match?.matchEnded && match?.status && (
                    <p className="mt-2 text-emerald-400 text-xs font-semibold pl-[56px] md:pl-[68px]">
                      🏆 {match.status}
                    </p>
                  )}
                </div>

                {/* Teams list */}
                <div className="border-t border-white/10">
                  {matchTeams.map((team) => {
                    const captain = team.players?.find((p) => p.isCaptain);
                    const viceCaptain = team.players?.find(
                      (p) => p.isViceCaptain
                    );
                    const counts = getRoleCounts(team.players);
                    const isExpanded = expandedTeam === team._id;

                    return (
                      <div key={team._id}>
                        <div
                          className="p-4 md:px-5 hover:bg-white/5 transition cursor-pointer"
                          onClick={() =>
                            setExpandedTeam(isExpanded ? null : team._id)
                          }
                        >
                          <div className="flex items-center justify-between">
                            {/* Team name + contest */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-semibold text-sm">
                                  {team.teamName}
                                </h4>
                                {team.rank && (
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      team.rank === 1
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : team.rank <= 3
                                        ? "bg-orange-500/20 text-orange-400"
                                        : "bg-gray-500/20 text-gray-400"
                                    }`}
                                  >
                                    #{team.rank}
                                  </span>
                                )}
                              </div>
                              {team.contestId && (
                                <p className="text-gray-500 text-[11px] mt-0.5 truncate">
                                  {team.contestId.title || "Contest"} • Entry ₹
                                  {team.contestId.entryFee || 0}
                                </p>
                              )}
                            </div>

                            {/* Points */}
                            <div className="text-right shrink-0 ml-3">
                              <p className="text-white font-bold text-lg">
                                {team.totalPoints || 0}
                              </p>
                              <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                                Points
                              </p>
                            </div>

                            {/* Expand chevron */}
                            <motion.span
                              className="ml-3 text-gray-500"
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              ▼
                            </motion.span>
                          </div>

                          {/* Role counts + C/VC */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex gap-2">
                              {Object.entries(counts).map(([role, count]) => (
                                <span
                                  key={role}
                                  className="bg-white/10 text-gray-300 text-[10px] font-semibold px-2 py-0.5 rounded"
                                >
                                  {role} {count}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-3 ml-auto">
                              {captain && (
                                <div className="flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[9px] font-bold">
                                    C
                                  </span>
                                  <span className="text-gray-400 text-[11px]">
                                    {captain.playerName?.split(" ").pop()}
                                  </span>
                                </div>
                              )}
                              {viceCaptain && (
                                <div className="flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[9px] font-bold">
                                    VC
                                  </span>
                                  <span className="text-gray-400 text-[11px]">
                                    {viceCaptain.playerName?.split(" ").pop()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded player list */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 md:px-5">
                                <div className="bg-white/5 rounded-xl p-3">
                                  <div className="grid grid-cols-12 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                                    <div className="col-span-5">Player</div>
                                    <div className="col-span-3 text-center">
                                      Role
                                    </div>
                                    <div className="col-span-4 text-right">
                                      Badge
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    {team.players?.map((p, idx) => (
                                      <div
                                        key={p.playerId || idx}
                                        className="grid grid-cols-12 items-center px-2 py-2 rounded-lg hover:bg-white/5 transition"
                                      >
                                        <div className="col-span-5 text-white text-[13px] font-medium flex items-center gap-2">
                                          <img
                                            src={`https://h.cricapi.com/img/players/${p.playerId}.jpg`}
                                            alt={p.playerName}
                                            className="w-7 h-7 rounded-full object-cover bg-white/10"
                                            onError={(e) => {
                                              e.target.src =
                                                "https://via.placeholder.com/28";
                                            }}
                                          />
                                          <span className="truncate">
                                            {p.playerName}
                                          </span>
                                        </div>
                                        <div className="col-span-3 text-center">
                                          <span className="text-[11px] text-gray-400">
                                            {normalizeRole(p.role)}
                                          </span>
                                        </div>
                                        <div className="col-span-4 text-right">
                                          {p.isCaptain && (
                                            <span className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded mr-1">
                                              C
                                            </span>
                                          )}
                                          {p.isViceCaptain && (
                                            <span className="inline-block bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                              VC
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* View in contest */}
                                {team.contestId?._id && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/contests/${team.contestId._id}/leaderboard`
                                      );
                                    }}
                                    className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold py-2 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition"
                                  >
                                    📊 View Leaderboard
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
