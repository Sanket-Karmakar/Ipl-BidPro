// src/pages/LeaderboardPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/UserContext";

export default function LeaderboardPage() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/contests/${contestId}/leaderboard`);
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json);
        setError("");
      } else {
        setError(json.message || "Failed to load leaderboard");
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setError("Failed to load leaderboard");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard().finally(() => setLoading(false));
  }, [contestId]);

  // Auto-refresh every 30s if live
  useEffect(() => {
    if (!data?.isLive) return;
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [data?.isLive, contestId]);

  const fetchBreakdown = async (teamId) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
      setBreakdown(null);
      return;
    }
    setExpandedTeam(teamId);
    setBreakdownLoading(true);
    try {
      const res = await fetch(`/api/contests/${contestId}/leaderboard/${teamId}/breakdown`);
      const json = await res.json();
      if (res.ok && json.success) {
        setBreakdown(json);
      }
    } catch (err) {
      console.error("Breakdown fetch error:", err);
    } finally {
      setBreakdownLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-32">
        <div className="w-8 h-8 border-4 border-[#009270] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading leaderboard...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-32 px-4">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Leaderboard Unavailable</h2>
        <p className="text-gray-500 mb-6 text-center">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-[#009270] text-white font-medium rounded-lg hover:bg-[#007b5e] transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const leaderboard = data?.leaderboard ?? [];
  const currentUserId = user?._id || user?.id;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-[70px]">
      <div className="max-w-3xl mx-auto px-4 mt-4">

        {/* ── Header Card ──────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="bg-[#009270] px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white font-bold text-[18px]">{data?.contestTitle || "Contest"}</h1>
                <p className="text-green-100 text-[13px] mt-1">
                  {data?.totalParticipants || 0} participants • Prize Pool: ₹{data?.prizePool || 0}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {data?.isLive && (
                  <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[13px] font-semibold">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
                {data?.isCompleted && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[13px] font-semibold">
                    ✅ FINAL
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Leaderboard Table ─────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 border-b border-gray-200 text-[13px] font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-7">Team</div>
            <div className="col-span-4 text-right pr-2">Points</div>
          </div>

          {/* Rows */}
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-[15px]">
              No participants yet. Points will appear once the match starts.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((entry, idx) => {
                const userId = entry.userId?._id || entry.userId;
                const username = entry.userId?.username || "User";
                const teamName = entry.teamId?.teamName || entry.teamName || "Team";
                const teamId = entry.teamId?._id || entry.teamId;
                const isCurrentUser = String(userId) === String(currentUserId);
                const isExpanded = expandedTeam === teamId;

                // Rank badge colors
                let rankBg = "bg-gray-100 text-gray-600";
                if (entry.rank === 1) rankBg = "bg-yellow-100 text-yellow-700";
                else if (entry.rank === 2) rankBg = "bg-gray-200 text-gray-700";
                else if (entry.rank === 3) rankBg = "bg-orange-100 text-orange-700";

                return (
                  <div key={idx}>
                    <div
                      onClick={() => fetchBreakdown(teamId)}
                      className={`grid grid-cols-12 px-4 py-3.5 items-center cursor-pointer transition-colors hover:bg-gray-50 ${
                        isCurrentUser ? "bg-green-50 border-l-4 border-[#009270]" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className="col-span-1 flex justify-center">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold ${rankBg}`}>
                          {entry.rank}
                        </span>
                      </div>

                      {/* User + Team */}
                      <div className="col-span-7 flex flex-col">
                        <span className={`text-[14px] font-semibold ${isCurrentUser ? "text-[#009270]" : "text-gray-800"}`}>
                          {username}
                          {isCurrentUser && <span className="ml-1.5 text-[11px] bg-[#009270] text-white px-1.5 py-0.5 rounded">YOU</span>}
                        </span>
                        <span className="text-[12px] text-gray-400">{teamName}</span>
                      </div>

                      {/* Points */}
                      <div className="col-span-4 text-right pr-2">
                        <span className="text-[16px] font-bold text-gray-800">{entry.points ?? 0}</span>
                        <span className="text-[12px] text-gray-400 ml-1">pts</span>
                      </div>
                    </div>

                    {/* Expanded Breakdown */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            {breakdownLoading ? (
                              <div className="flex justify-center py-4">
                                <div className="w-6 h-6 border-3 border-[#009270] border-t-transparent rounded-full animate-spin" />
                              </div>
                            ) : breakdown?.players ? (
                              <div>
                                <p className="text-[13px] font-semibold text-gray-600 mb-3 uppercase tracking-wide">Player Breakdown</p>
                                <div className="grid grid-cols-12 text-[12px] font-medium text-gray-400 mb-2 px-1">
                                  <div className="col-span-5">Player</div>
                                  <div className="col-span-2 text-center">Role</div>
                                  <div className="col-span-2 text-center">Raw</div>
                                  <div className="col-span-3 text-right">Final</div>
                                </div>
                                <div className="space-y-1">
                                  {breakdown.players
                                    .sort((a, b) => b.finalPoints - a.finalPoints)
                                    .map((p, pIdx) => (
                                    <div key={pIdx} className="grid grid-cols-12 items-center bg-white px-2 py-2 rounded-lg text-[13px]">
                                      <div className="col-span-5 font-medium text-gray-800 flex items-center gap-1">
                                        {p.playerName}
                                        {p.isCaptain && <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1 rounded font-bold">C</span>}
                                        {p.isViceCaptain && <span className="text-[10px] bg-blue-200 text-blue-800 px-1 rounded font-bold">VC</span>}
                                      </div>
                                      <div className="col-span-2 text-center text-gray-400 text-[12px]">{p.role}</div>
                                      <div className="col-span-2 text-center text-gray-500">{p.rawPoints}</div>
                                      <div className="col-span-3 text-right font-bold text-[#009270]">{p.finalPoints}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-[14px] font-bold text-gray-700">
                                  <span>Total</span>
                                  <span className="text-[#009270]">{breakdown.totalPoints} pts</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-400 text-[13px] text-center py-2">Point breakdown not available yet.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Back Button ──────────────────────── */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-[#009270] text-[14px] font-medium hover:underline"
          >
            ← Back to Contest
          </button>
        </div>
      </div>
    </div>
  );
}
