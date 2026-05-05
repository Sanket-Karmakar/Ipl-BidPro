// src/pages/LiveScorecard.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── helpers ──────────────────────────────────────────────
const BALL_COLORS = {
  W: "bg-[#e53935] text-white",        // wicket (red)
  4: "bg-[#43a047] text-white",     // four (green)
  6: "bg-[#1e88e5] text-white",      // six (blue)
  0: "bg-[#f1f1f1] text-[#4a4a4a] border border-[#e3e6e3]", // dot ball
  default: "bg-white text-[#4a4a4a] border border-[#e3e6e3]", // 1,2,3
  wd: "bg-[#fb8c00] text-white",  // wide (orange)
  nb: "bg-[#fdd835] text-black",  // no-ball (yellow)
};

function ballColor(ball) {
  if (ball.wicket || ball.isWicket) return BALL_COLORS.W;
  if (ball.six || ball.isSix) return BALL_COLORS[6];
  if (ball.four || ball.isFour) return BALL_COLORS[4];
  const runs = ball.runs ?? ball.batsman_run ?? ball.run ?? 0;
  if (runs === 0) return BALL_COLORS[0];
  if (ball.wide || ball.isWide) return BALL_COLORS.wd;
  if (ball.noBall || ball.isNoBall) return BALL_COLORS.nb;
  return BALL_COLORS.default;
}

function getBallLabel(ball) {
  if (ball.wicket || ball.isWicket) return "W";
  const runs = ball.runs ?? ball.batsman_run ?? ball.run ?? 0;
  if (ball.wide || ball.isWide) return `${runs}wd`;
  if (ball.noBall || ball.isNoBall) return `${runs}nb`;
  return String(runs);
}

// ── MAIN COMPONENT ──────────────────────────────────────
export default function LiveScorecard() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("scorecard"); // scorecard | squads | commentary
  const [activeInnings, setActiveInnings] = useState(0);
  const [scorecard, setScorecard] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [bbbData, setBbbData] = useState(null);
  const [squadData, setSquadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bbbLoading, setBbbLoading] = useState(false);
  const [squadLoading, setSquadLoading] = useState(false);
  const [error, setError] = useState("");
  const bbbEndRef = useRef(null);

  const isLive = matchInfo?.matchStarted && !matchInfo?.matchEnded;

  const fetchScorecard = async () => {
    try {
      const res = await fetch(`/api/matches/${matchId}/scorecard`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Scorecard not available");
        return;
      }
      setScorecard(json.data);
      setMatchInfo(json.matchInfo);
      setError("");
    } catch (err) {
      console.error("Error fetching scorecard:", err);
      setError("Failed to load scorecard");
    }
  };

  const fetchBBB = async () => {
    setBbbLoading(true);
    try {
      const res = await fetch(`/api/matches/${matchId}/bbb`);
      const json = await res.json();
      if (res.ok && json.success) {
        setBbbData(json.data);
      }
    } catch (err) {
      console.error("Error fetching bbb:", err);
    } finally {
      setBbbLoading(false);
    }
  };

  const fetchSquads = async () => {
    setSquadLoading(true);
    try {
      const res = await fetch(`/api/matches/${matchId}/squad`);
      const json = await res.json();
      if (res.ok && json.success) {
        setSquadData(json.data);
      }
    } catch (err) {
      console.error("Error fetching squad:", err);
    } finally {
      setSquadLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchScorecard().finally(() => setLoading(false));
  }, [matchId]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      fetchScorecard();
      if (activeTab === "commentary") fetchBBB();
    }, 30000); 
    return () => clearInterval(interval);
  }, [isLive, activeTab, matchId]);

  useEffect(() => {
    if (activeTab === "commentary" && !bbbData) {
      fetchBBB();
    }
    if (activeTab === "squads" && !squadData) {
      fetchSquads();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "commentary" && bbbEndRef.current) {
      bbbEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bbbData, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center pt-32">
        <div className="w-8 h-8 border-4 border-[#009270] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-medium">Loading scorecard...</p>
      </div>
    );
  }

  const innings = scorecard?.scorecard ?? scorecard?.innings ?? scorecard ?? [];
  const inningsArr = Array.isArray(innings) ? innings : [innings];

  return (
    <div className="min-h-screen bg-white pb-20 pt-[70px]">
      <div className="max-w-5xl mx-auto border border-[#e3e6e3] rounded-lg mt-4 shadow-sm overflow-hidden">
        
        {/* ── MATCH HEADER (Cricbuzz Style) ──────────────── */}
        <div className="bg-white px-6 py-4 border-b border-[#e3e6e3]">
          <h1 className="text-[20px] font-bold text-[#1f2024] mb-2">
            {matchInfo?.name}, Indian Premier League 2026
          </h1>
          <div className="text-[13px] text-[#666666] flex flex-wrap gap-x-4 gap-y-1 mb-4">
            <span><span className="font-medium text-[#4a4a4a]">Series:</span> Indian Premier League 2026</span>
            <span><span className="font-medium text-[#4a4a4a]">Venue:</span> {matchInfo?.venue || "TBD"}</span>
          </div>

          {/* Basic Score Summary (Fallback if full scorecard isn't there, or just nice context) */}
          {matchInfo?.score && matchInfo.score.length > 0 && (
            <div className="flex flex-col gap-2 mt-4 bg-gray-50 p-4 rounded-md border border-gray-100">
              {matchInfo.score.map((s, idx) => (
                 <div key={idx} className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{s.inning || `Team ${idx + 1}`}</span>
                    <span className="font-bold text-lg text-gray-900">
                       {s.r}-{s.w} <span className="text-gray-500 font-medium text-sm">({s.o} ov)</span>
                    </span>
                 </div>
              ))}
            </div>
          )}
        </div>

        {/* ── TABS ───────────────────────────────────── */}
        <div className="bg-white px-6 flex gap-6 border-b border-[#e3e6e3] text-[15px] font-semibold">
          {["scorecard", "squads", "commentary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 capitalize transition-all ${
                activeTab === tab
                  ? "text-[#009270] border-b-[3px] border-[#009270]"
                  : "text-[#4a4a4a] hover:text-[#009270] border-b-[3px] border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── CONTENT ────────────────────────────────── */}
        <div className="p-6">
          {/* Match Status text */}
          <div className="mb-4">
             <span className={`text-[15px] ${isLive ? 'text-[#e53935] font-bold' : 'text-[#006cb7]'}`}>
               {matchInfo?.status}
             </span>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "scorecard" ? (
              <motion.div key="scorecard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                
                {/* Innings Pill Tabs */}
                {inningsArr.length > 1 && (
                  <div className="flex gap-3 mb-6">
                    {inningsArr.map((inn, idx) => {
                      let teamName = inn.inning || `Innings ${idx + 1}`;
                      // Try to map to team shortname if available
                      if (teamName.toLowerCase().includes("inning")) {
                         const rawTeam = teamName.split(' ')[0];
                         const tInfo = matchInfo?.teamInfo?.find(t => t.name.includes(rawTeam) || rawTeam.includes(t.name));
                         if (tInfo && tInfo.shortname) {
                            teamName = `${tInfo.shortname} (${idx === 0 ? '1st Inn' : '2nd Inn'})`;
                         }
                      }
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveInnings(idx)}
                          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition border ${
                            activeInnings === idx
                              ? "bg-[#009270] text-white border-[#009270]"
                              : "bg-[#f1f1f1] text-[#4a4a4a] border-[#e3e6e3] hover:bg-[#e2e2e2]"
                          }`}
                        >
                          {teamName}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Render Selected Inning */}
                {inningsArr.length > 0 ? (
                  inningsArr[activeInnings] && renderInningsScorecard(inningsArr[activeInnings], activeInnings)
                ) : (
                  <p className="text-[#666666] text-center py-10">Scorecard details are currently unavailable.</p>
                )}
              </motion.div>
            ) : activeTab === "squads" ? (
              <motion.div key="squads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {renderSquads()}
              </motion.div>
            ) : (
              <motion.div key="commentary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {renderCommentary()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // ── SCORECARD RENDERING ────────────────────────────────
  // ═══════════════════════════════════════════════════════
  function renderInningsScorecard(inningData, inningIdx) {
    const batting = inningData.batsman ?? inningData.batting ?? [];
    const bowling = inningData.bowler ?? inningData.bowling ?? [];
    const extras = inningData.extras ?? inningData.extra ?? null;
    
    const matchingScore = matchInfo?.score?.find(s => 
      s.inning === inningData.inning || 
      s.inning.toLowerCase().includes(inningData.inning?.toLowerCase())
    ) || matchInfo?.score?.[inningIdx];

    // Try to find the team name for the green header
    const rawTeam = (inningData.inning || '').split(' ')[0];
    const teamFull = matchInfo?.teamInfo?.find(t => t.name.includes(rawTeam) || rawTeam.includes(t.name))?.name || rawTeam;

    // --- Dynamic Totals Fallback Logic ---
    let totalRuns = 0;
    let totalWickets = 0;
    let totalOvers = 0;

    if (matchingScore) {
      totalRuns = matchingScore.r;
      totalWickets = matchingScore.w;
      totalOvers = matchingScore.o;
    } else {
      // Calculate manually if API 'totals' is empty and matchInfo.score doesn't have it
      const batterRuns = batting.reduce((sum, bat) => sum + (bat.r ?? bat.runs ?? 0), 0);
      const extraRuns = extras?.r ?? extras?.total ?? 0;
      totalRuns = batterRuns + extraRuns;

      totalWickets = batting.filter(bat => {
        const dismissal = (bat["dismissal-text"] ?? bat.dismissal ?? bat.howOut ?? "").toLowerCase();
        return dismissal && dismissal !== "not out" && dismissal !== "batting";
      }).length;

      const oversArr = bowling.map(b => parseFloat(b.o ?? b.overs ?? 0));
      totalOvers = oversArr.length > 0 ? Math.max(...oversArr) : 0;
    }

    return (
      <div className="space-y-6">
        
        {/* ── BATTING TABLE ──────────────── */}
        <div className="border border-[#e3e6e3] rounded overflow-hidden">
          {/* Green Header */}
          <div className="px-4 py-2 bg-[#009270] text-white flex justify-between items-center text-[15px]">
            <span className="font-bold">{teamFull}</span>
            <span className="font-bold">
               {totalRuns}-{totalWickets} <span className="font-normal text-[13px]">({totalOvers} Ov)</span>
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#f1f1f1] text-[#4a4a4a] text-[13px] font-semibold border-b border-[#e3e6e3]">
                  <th className="px-4 py-2 w-[25%] font-medium">Batter</th>
                  <th className="px-2 py-2 w-[40%] font-medium"></th> {/* For dismissal text */}
                  <th className="text-right px-3 py-2 font-medium w-[8%]">R</th>
                  <th className="text-right px-3 py-2 font-medium w-[8%]">B</th>
                  <th className="text-right px-3 py-2 font-medium w-[8%]">4s</th>
                  <th className="text-right px-3 py-2 font-medium w-[8%]">6s</th>
                  <th className="text-right px-4 py-2 font-medium w-[8%]">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e6e3]">
                {batting.map((bat, idx) => {
                  const runs = bat.r ?? bat.runs ?? 0;
                  const balls = bat.b ?? bat.balls ?? 0;
                  const fours = bat["4s"] ?? bat.fours ?? 0;
                  const sixes = bat["6s"] ?? bat.sixes ?? 0;
                  const sr = bat.sr ?? bat.strikeRate ?? (balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00");
                  const dismissal = bat["dismissal-text"] ?? bat.dismissal ?? bat.howOut ?? "";
                  const isNotOut = dismissal.toLowerCase() === "not out" || dismissal === "batting" || dismissal === "";

                  return (
                    <tr key={idx} className="bg-white hover:bg-[#f9f9f9] transition-colors text-[14px]">
                      <td className="px-4 py-3">
                         <span 
                           className="text-[#006cb7] cursor-pointer hover:underline"
                           onClick={() => navigate(`/player/${encodeURIComponent(bat.name || bat.batsman?.name || bat.batsman || 'Unknown')}`)}
                         >
                           {bat.name || bat.batsman?.name || bat.batsman || "Unknown"}
                           {isNotOut && <span className="ml-1">*</span>}
                         </span>
                      </td>
                      <td className="px-2 py-3 text-[#666666] text-[13px]">
                        {dismissal === "batting" ? "batting" : dismissal}
                      </td>
                      <td className="text-right px-3 py-3 font-bold text-[#1f2024]">{runs}</td>
                      <td className="text-right px-3 py-3 text-[#4a4a4a]">{balls}</td>
                      <td className="text-right px-3 py-3 text-[#4a4a4a]">{fours}</td>
                      <td className="text-right px-3 py-3 text-[#4a4a4a]">{sixes}</td>
                      <td className="text-right px-4 py-3 text-[#4a4a4a]">{sr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Extras & Total */}
          <div className="border-t border-[#e3e6e3] divide-y divide-[#e3e6e3]">
            {extras && (
              <div className="px-4 py-2.5 flex items-center text-[14px]">
                <div className="w-[65%] text-[#1f2024] font-medium">
                  Extras
                </div>
                <div className="flex-1 flex gap-2 font-bold text-[#1f2024]">
                  {extras.r ?? extras.total ?? 0}
                  <span className="text-[#666666] font-normal text-[13px] ml-2">
                    (b {extras.b ?? 0}, lb {extras.lb ?? 0}, w {extras.w ?? 0}, nb {extras.nb ?? 0}, p {extras.p ?? 0})
                  </span>
                </div>
              </div>
            )}
            
            <div className="px-4 py-2.5 flex items-center text-[14px] bg-[#f9f9f9]">
              <div className="w-[65%] text-[#1f2024] font-bold">Total</div>
              <div className="flex-1 font-bold text-[#1f2024]">
                {totalRuns} <span className="font-normal text-[13px] text-[#666666] ml-2">({totalWickets} wkts, {totalOvers} Ov)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOWLING TABLE ──────────────── */}
        <div className="border border-[#e3e6e3] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#f1f1f1] text-[#4a4a4a] text-[13px] font-semibold border-b border-[#e3e6e3]">
                  <th className="px-4 py-2 w-[65%] font-medium">Bowler</th>
                  <th className="text-right px-3 py-2 font-medium w-[7%]">O</th>
                  <th className="text-right px-3 py-2 font-medium w-[7%]">M</th>
                  <th className="text-right px-3 py-2 font-medium w-[7%]">R</th>
                  <th className="text-right px-3 py-2 font-medium w-[7%]">W</th>
                  <th className="text-right px-4 py-2 font-medium w-[7%]">ECON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e6e3]">
                {bowling.map((b, idx) => {
                  return (
                    <tr key={idx} className="bg-white hover:bg-[#f9f9f9] transition-colors text-[14px]">
                      <td 
                        className="px-4 py-3 text-[#006cb7] cursor-pointer hover:underline"
                        onClick={() => navigate(`/player/${encodeURIComponent(b.name || b.bowler?.name || b.bowler || 'Unknown')}`)}
                      >
                        {b.name || b.bowler?.name || b.bowler || "Unknown"}
                      </td>
                      <td className="text-right px-3 py-3 text-[#4a4a4a]">{b.o ?? b.overs ?? 0}</td>
                      <td className="text-right px-3 py-3 text-[#4a4a4a]">{b.m ?? b.maidens ?? 0}</td>
                      <td className="text-right px-3 py-3 text-[#1f2024]">{b.r ?? b.runs ?? 0}</td>
                      <td className="text-right px-3 py-3 text-[#1f2024] font-bold">{b.w ?? b.wickets ?? 0}</td>
                      <td className="text-right px-4 py-3 text-[#4a4a4a]">{b.eco ?? b.economy ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FALL OF WICKETS ──────────── */}
        {inningData.fow && inningData.fow.length > 0 && (
          <div className="border border-[#e3e6e3] rounded overflow-hidden">
             <div className="bg-[#f1f1f1] px-4 py-2 border-b border-[#e3e6e3] text-[#4a4a4a] font-medium text-[13px]">
               Fall of Wickets
             </div>
             <div className="p-4 text-[13px] text-[#4a4a4a] leading-relaxed bg-white">
              {inningData.fow.map((f, idx) => (
                <span key={idx} className="mr-3 inline-block mb-1">
                  {f.r ?? f.score ?? "?"}-{idx + 1} 
                  <span className="text-[#666666] ml-1">
                    ({f.batsman?.name ?? f.name ?? "Unknown"}, {f.o ?? f.over ?? "?"})
                  </span>
                  {idx < inningData.fow.length - 1 && ","}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // ── SQUADS RENDERING ───────────────────────────────────
  // ═══════════════════════════════════════════════════════
  function renderSquads() {
    if (squadLoading && !squadData) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#009270] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!squadData || squadData.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-[#666666] text-[15px]">Squad details not available yet</p>
        </div>
      );
    }

    const team1 = squadData[0];
    const team2 = squadData[1];

    if (!team1 || !team2) return null;

    // Sort players: Captain first, then Role (Batsman > All-rounder > Bowler), then image availability
    const sortPlayers = (players) => {
      if (!players) return [];

      const getRolePriority = (role = "") => {
        const r = role.toLowerCase();
        if (r.includes("batsman") || r.includes("batter")) return 1;
        if (r.includes("allrounder") || r.includes("all-rounder")) return 2;
        if (r.includes("bowler")) return 3;
        return 4;
      };

      return [...players].sort((a, b) => {
        // 1. Captain priority
        const aIsCap = a.isCaptain || (a.role && a.role.toLowerCase().includes('captain')) || a.name.toLowerCase().includes('(c)');
        const bIsCap = b.isCaptain || (b.role && b.role.toLowerCase().includes('captain')) || b.name.toLowerCase().includes('(c)');
        
        if (aIsCap && !bIsCap) return -1;
        if (!aIsCap && bIsCap) return 1;

        // 2. Role priority
        const aRolePrio = getRolePriority(a.role);
        const bRolePrio = getRolePriority(b.role);

        if (aRolePrio !== bRolePrio) {
          return aRolePrio - bRolePrio;
        }

        // 3. Image priority (within the same role)
        const aHasImg = a.playerImg && !a.playerImg.includes("icon512.png");
        const bHasImg = b.playerImg && !b.playerImg.includes("icon512.png");
        
        if (aHasImg && !bHasImg) return -1;
        if (!aHasImg && bHasImg) return 1;

        return 0;
      });
    };

    const team1Players = sortPlayers(team1.players);
    const team2Players = sortPlayers(team2.players);

    // Use Playing XI layout side-by-side
    // Find the max length of players array to align rows
    const maxPlayers = Math.max(team1Players.length, team2Players.length);

    return (
      <div className="border border-[#e3e6e3] rounded overflow-hidden">
        <div className="bg-[#f1f1f1] px-4 py-3 flex justify-between border-b border-[#e3e6e3]">
          <div className="flex items-center gap-2 font-bold text-[#1f2024]">
            {team1.teamimg && <img src={team1.teamimg} alt={team1.teamName} className="w-6 h-6 object-contain bg-white rounded-full p-0.5" />}
            {team1.teamName}
          </div>
          <div className="flex items-center gap-2 font-bold text-[#1f2024]">
            {team2.teamName}
            {team2.teamimg && <img src={team2.teamimg} alt={team2.teamName} className="w-6 h-6 object-contain bg-white rounded-full p-0.5" />}
          </div>
        </div>

        <div className="text-center py-3 bg-white border-b border-[#e3e6e3] font-bold text-[#1f2024] text-[15px]">
          Squad
        </div>

        <div className="flex divide-x divide-[#e3e6e3] bg-white">
          {/* Team 1 Players */}
          <div className="flex-1 divide-y divide-[#f9f9f9]">
            {Array.from({ length: maxPlayers }).map((_, i) => {
              const player = team1Players[i];
              if (!player) return <div key={i} className="px-4 py-3 flex items-center gap-3 min-h-[60px]" />;
              
              const isCap = player.isCaptain || (player.role && player.role.toLowerCase().includes('captain')) || player.name.toLowerCase().includes('(c)');
              const displayName = isCap && !player.name.toLowerCase().includes('(c)') ? `${player.name} (C)` : player.name;

              return (
                <div key={i} className="px-4 py-3 flex items-center gap-3 min-h-[60px]">
                  <img 
                    src={player.playerImg || "https://h.cricapi.com/img/icon512.png"} 
                    alt={player.name} 
                    className="w-10 h-10 rounded-full bg-gray-100 object-cover border border-gray-200"
                    onError={(e) => { e.target.src = "https://h.cricapi.com/img/icon512.png" }}
                  />
                  <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/player/${encodeURIComponent(player.name)}`)}>
                    <span className="text-[14px] font-medium text-[#006cb7] hover:underline">{displayName}</span>
                    <span className="text-[12px] text-[#666666]">{player.role || player.battingStyle || "Player"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Team 2 Players */}
          <div className="flex-1 divide-y divide-[#f9f9f9]">
            {Array.from({ length: maxPlayers }).map((_, i) => {
              const player = team2Players[i];
              if (!player) return <div key={i} className="px-4 py-3 flex items-center justify-end gap-3 min-h-[60px] text-right" />;
              
              const isCap = player.isCaptain || (player.role && player.role.toLowerCase().includes('captain')) || player.name.toLowerCase().includes('(c)');
              const displayName = isCap && !player.name.toLowerCase().includes('(c)') ? `${player.name} (C)` : player.name;

              return (
                <div key={i} className="px-4 py-3 flex items-center justify-end gap-3 min-h-[60px] text-right">
                  <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/player/${encodeURIComponent(player.name)}`)}>
                    <span className="text-[14px] font-medium text-[#006cb7] hover:underline">{displayName}</span>
                    <span className="text-[12px] text-[#666666]">{player.role || player.battingStyle || "Player"}</span>
                  </div>
                  <img 
                    src={player.playerImg || "https://h.cricapi.com/img/icon512.png"} 
                    alt={player.name} 
                    className="w-10 h-10 rounded-full bg-gray-100 object-cover border border-gray-200"
                    onError={(e) => { e.target.src = "https://h.cricapi.com/img/icon512.png" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // ── COMMENTARY RENDERING ───────────────────────────────
  // ═══════════════════════════════════════════════════════
  function renderCommentary() {
    if (bbbLoading && !bbbData) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#009270] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!bbbData) {
      return (
        <div className="text-center py-16">
          <p className="text-[#666666] text-[15px]">Commentary not available yet</p>
        </div>
      );
    }

    const ballsArray = Array.isArray(bbbData)
      ? bbbData
      : bbbData.bbb ?? bbbData.balls ?? bbbData.data ?? [];

    if (!Array.isArray(ballsArray) || ballsArray.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-[#666666] text-[15px]">No commentary available yet</p>
        </div>
      );
    }

    const overGroups = {};
    ballsArray.forEach((ball) => {
      const overNum = ball.over ?? ball.overNumber ?? Math.floor(ball.overs ?? 0);
      if (!overGroups[overNum]) overGroups[overNum] = [];
      overGroups[overNum].push(ball);
    });

    const sortedOvers = Object.keys(overGroups).map(Number).sort((a, b) => b - a);

    return (
      <div className="space-y-4">
        {sortedOvers.map((overNum) => {
          const balls = overGroups[overNum];
          const overRuns = balls.reduce(
            (sum, b) => sum + (b.runs ?? b.batsman_run ?? b.run ?? 0) + (b.extras ?? b.extra_run ?? 0),
            0
          );

          return (
            <div key={overNum} className="border border-[#e3e6e3] rounded overflow-hidden">
              <div className="px-4 py-2 bg-[#f1f1f1] border-b border-[#e3e6e3] flex items-center gap-4">
                <span className="text-[#1f2024] font-bold text-[14px]">
                  Ov {overNum + 1}
                </span>
                <span className="text-[#666666] text-[13px]">
                  {overRuns} runs
                </span>
              </div>

              <div className="p-4 bg-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {balls.map((ball, bIdx) => (
                    <div
                      key={bIdx}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${ballColor(ball)}`}
                      title={ball.commentary ?? ball.comment ?? ""}
                    >
                      {getBallLabel(ball)}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {balls.map((ball, bIdx) => {
                    let commentary = ball.commentary ?? ball.comment ?? ball.text ?? "";
                    
                    if (!commentary) {
                      const batterName = ball.batsman?.name || "Batter";
                      const bowlerName = ball.bowler?.name || "Bowler";
                      const runs = ball.runs ?? ball.batsman_run ?? ball.run ?? 0;
                      
                      if (ball.wicket || ball.isWicket || ball.dismissal) {
                         commentary = `${bowlerName} to ${batterName}, OUT!`;
                      } else if (ball.six || ball.isSix || runs === 6) {
                         commentary = `${bowlerName} to ${batterName}, SIX runs!`;
                      } else if (ball.four || ball.isFour || runs === 4) {
                         commentary = `${bowlerName} to ${batterName}, FOUR runs!`;
                      } else if (ball.penalty) {
                         const penaltyType = ball.penalty.replace('_', ' ');
                         commentary = `${bowlerName} to ${batterName}, ${penaltyType}. (${ball.extras ?? 1} extra)`;
                      } else {
                         commentary = `${bowlerName} to ${batterName}, ${runs > 0 ? runs + (runs === 1 ? ' run' : ' runs') : 'no run'}.`;
                      }
                    }

                    if (!commentary) return null;
                    return (
                      <div key={bIdx} className="flex gap-3 text-[14px] border-t border-[#f1f1f1] pt-3 first:border-0 first:pt-0">
                        <span className="text-[#666666] font-medium min-w-[35px]">
                          {overNum}.{ball.ball ?? ball.ballNumber ?? bIdx + 1}
                        </span>
                        <p className="text-[#1f2024] leading-relaxed">
                          {commentary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bbbEndRef} />
      </div>
    );
  }
}
