/**
 * Scoring Engine — the heart of fantasy auto-scoring.
 *
 * scoreMatch(matchId):
 *   1. Reads cached scorecardData from the Match document
 *   2. Extracts per-player stats (batting, bowling, fielding)
 *   3. Scores every fantasy Team linked to this match
 *   4. Updates contest leaderboards
 */

import { Match } from "../models/match.models.js";
import { Team } from "../models/team.models.js";
import { Contest } from "../models/contest.models.js";
import { calculatePlayerPoints, applyMultiplier } from "../utils/fantasyPoints.js";

// ═══════════════════════════════════════════════════════════
// 1. EXTRACT PLAYER STATS FROM SCORECARD
// ═══════════════════════════════════════════════════════════

/**
 * Parses CricAPI scorecardData and returns a map:
 *   { normalizedName → { runs, balls, fours, sixes, isOut, wickets, maidens, overs, catches, stumpings, runOutsDirect, runOutsIndirect } }
 */
export function extractPlayerStats(scorecardData) {
  const statsMap = {};  // key = lowercase trimmed name

  const ensure = (name) => {
    const key = normalizeName(name);
    if (!key) return null;
    if (!statsMap[key]) {
      statsMap[key] = {
        name: name.trim(),
        runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false,
        wickets: 0, maidens: 0, overs: 0,
        catches: 0, stumpings: 0, runOutsDirect: 0, runOutsIndirect: 0,
      };
    }
    return statsMap[key];
  };

  const innings = scorecardData?.scorecard ?? scorecardData?.innings ?? [];
  const inningsArr = Array.isArray(innings) ? innings : [innings];

  for (const inn of inningsArr) {
    // ── Batting ────────────────────────────
    const batters = inn.batsman ?? inn.batting ?? [];
    for (const bat of batters) {
      const name = bat.name ?? bat.batsman?.name ?? bat.batsman;
      if (!name) continue;

      const s = ensure(name);
      if (!s) continue;

      s.runs  += bat.r ?? bat.runs ?? 0;
      s.balls += bat.b ?? bat.balls ?? 0;
      s.fours += bat["4s"] ?? bat.fours ?? 0;
      s.sixes += bat["6s"] ?? bat.sixes ?? 0;

      const dismissal = (bat["dismissal-text"] ?? bat.dismissal ?? bat.howOut ?? "").toLowerCase();
      if (dismissal && dismissal !== "not out" && dismissal !== "batting" && dismissal !== "") {
        s.isOut = true;
      }

      // ── Parse fielding from dismissal text ──
      parseFieldingFromDismissal(dismissal, ensure);
    }

    // ── Bowling ───────────────────────────
    const bowlers = inn.bowler ?? inn.bowling ?? [];
    for (const b of bowlers) {
      const name = b.name ?? b.bowler?.name ?? b.bowler;
      if (!name) continue;

      const s = ensure(name);
      if (!s) continue;

      s.wickets += b.w ?? b.wickets ?? 0;
      s.maidens += b.m ?? b.maidens ?? 0;
      s.overs   += parseFloat(b.o ?? b.overs ?? 0);
    }
  }

  return statsMap;
}

/**
 * Parse fielding contributions from dismissal text.
 * Examples:
 *   "c Virat Kohli b Romario Shepherd"     → Kohli gets a catch
 *   "st Philip Salt b Krunal Pandya"        → Salt gets a stumping
 *   "run out (Anukul Roy)"                  → Roy gets a direct run-out
 *   "run out (Rinku Singh/Sunil Narine)"    → first gets direct, second gets indirect
 */
function parseFieldingFromDismissal(dismissal, ensure) {
  if (!dismissal) return;

  // Caught: "c FielderName b BowlerName"
  const caughtMatch = dismissal.match(/^c\s+(.+?)\s+b\s+/i);
  if (caughtMatch) {
    const fielderName = caughtMatch[1].trim();
    // Skip "c (sub)" style or "c & b" (caught and bowled — bowler gets it via wicket)
    if (!fielderName.includes("sub") && !fielderName.includes("&")) {
      const s = ensure(fielderName);
      if (s) s.catches++;
    }
    return;
  }

  // Stumped: "st FielderName b BowlerName"
  const stumpedMatch = dismissal.match(/^st\s+(.+?)\s+b\s+/i);
  if (stumpedMatch) {
    const fielderName = stumpedMatch[1].trim();
    if (!fielderName.includes("sub")) {
      const s = ensure(fielderName);
      if (s) s.stumpings++;
    }
    return;
  }

  // Run out: "run out (Name)" or "run out (Name1/Name2)"
  const runOutMatch = dismissal.match(/run\s*out\s*\(([^)]+)\)/i);
  if (runOutMatch) {
    const names = runOutMatch[1].split("/").map(n => n.trim());
    if (names.length === 1 && names[0]) {
      const s = ensure(names[0]);
      if (s) s.runOutsDirect++;
    } else if (names.length >= 2) {
      const s1 = ensure(names[0]);
      if (s1) s1.runOutsDirect++;
      const s2 = ensure(names[1]);
      if (s2) s2.runOutsIndirect++;
    }
    return;
  }
}

// ═══════════════════════════════════════════════════════════
// 2. NAME MATCHING
// ═══════════════════════════════════════════════════════════

function normalizeName(name) {
  if (!name || typeof name !== "string") return "";
  return name.trim().toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ");
}

/**
 * Find the best matching key in statsMap for a given squad player name.
 * Uses exact match first, then substring/partial match.
 */
function findPlayerInMap(playerName, statsMap) {
  const normalized = normalizeName(playerName);
  if (!normalized) return null;

  // 1. Exact match
  if (statsMap[normalized]) return normalized;

  // 2. Check if one contains the other (handles "Virat Kohli" vs "V Kohli")
  const keys = Object.keys(statsMap);
  
  // Last name match (most reliable partial)
  const parts = normalized.split(" ");
  const lastName = parts[parts.length - 1];
  
  const candidates = keys.filter(k => {
    const kParts = k.split(" ");
    const kLast = kParts[kParts.length - 1];
    return kLast === lastName;
  });

  if (candidates.length === 1) return candidates[0];

  // 3. Substring match
  for (const key of keys) {
    if (key.includes(normalized) || normalized.includes(key)) return key;
  }

  return null;
}

// ═══════════════════════════════════════════════════════════
// 3. SCORE A SINGLE TEAM
// ═══════════════════════════════════════════════════════════

/**
 * Calculate total fantasy points for a team.
 * Returns { totalPoints, playerBreakdown: [{ playerName, points, stats }] }
 */
function scoreTeam(team, statsMap) {
  let totalPoints = 0;
  const playerBreakdown = [];

  for (const pick of team.players) {
    const mapKey = findPlayerInMap(pick.playerName, statsMap);
    const stats = mapKey ? statsMap[mapKey] : null;

    let rawPoints = 0;
    if (stats) {
      rawPoints = calculatePlayerPoints(stats);
    }

    const finalPoints = applyMultiplier(rawPoints, {
      isCaptain: pick.isCaptain,
      isViceCaptain: pick.isViceCaptain,
    });

    totalPoints += finalPoints;

    playerBreakdown.push({
      playerId: pick.playerId,
      playerName: pick.playerName,
      role: pick.role,
      isCaptain: pick.isCaptain,
      isViceCaptain: pick.isViceCaptain,
      rawPoints,
      finalPoints,
      stats: stats || null,
    });
  }

  return { totalPoints, playerBreakdown };
}

// ═══════════════════════════════════════════════════════════
// 4. MAIN ENTRY POINT — scoreMatch
// ═══════════════════════════════════════════════════════════

/**
 * Score all fantasy teams for a given match and update leaderboards.
 *
 * @param {string} matchId
 * @returns {{ teamsScored, contestsUpdated }}
 */
export async function scoreMatch(matchId) {
  const match = await Match.findOne({ matchId }).lean();
  if (!match) throw new Error(`Match ${matchId} not found`);
  if (!match.scorecardData) {
    console.log(`⏭ No scorecard data for ${matchId} — skipping scoring.`);
    return { teamsScored: 0, contestsUpdated: 0 };
  }

  // 1. Extract player stats
  const statsMap = extractPlayerStats(match.scorecardData);
  const playerCount = Object.keys(statsMap).length;
  if (playerCount === 0) {
    console.log(`⏭ No player stats extracted for ${matchId} — skipping.`);
    return { teamsScored: 0, contestsUpdated: 0 };
  }

  // 2. Find all teams for this match
  const teams = await Team.find({ matchId });
  if (teams.length === 0) {
    return { teamsScored: 0, contestsUpdated: 0 };
  }

  // 3. Score each team
  const teamUpdates = [];
  const teamBreakdowns = new Map(); // teamId → breakdown

  for (const team of teams) {
    const { totalPoints, playerBreakdown } = scoreTeam(team, statsMap);
    teamUpdates.push({
      updateOne: {
        filter: { _id: team._id },
        update: { $set: { totalPoints } },
      },
    });
    teamBreakdowns.set(String(team._id), { totalPoints, playerBreakdown });
  }

  // Bulk update all teams at once
  if (teamUpdates.length > 0) {
    await Team.bulkWrite(teamUpdates);
  }

  // 4. Update contest leaderboards
  const contestIds = [...new Set(teams.filter(t => t.contestId).map(t => String(t.contestId)))];
  let contestsUpdated = 0;

  for (const contestId of contestIds) {
    const contestTeams = teams.filter(t => String(t.contestId) === contestId);
    
    // Build leaderboard sorted by points desc
    const leaderboardEntries = contestTeams
      .map(t => {
        const bd = teamBreakdowns.get(String(t._id));
        return {
          userId: t.userId,
          teamId: t._id,
          points: bd?.totalPoints ?? 0,
          rank: 0,
        };
      })
      .sort((a, b) => b.points - a.points);

    // Assign ranks (handle ties)
    let currentRank = 1;
    for (let i = 0; i < leaderboardEntries.length; i++) {
      if (i > 0 && leaderboardEntries[i].points < leaderboardEntries[i - 1].points) {
        currentRank = i + 1;
      }
      leaderboardEntries[i].rank = currentRank;
    }

    await Contest.findByIdAndUpdate(contestId, {
      $set: { leaderboard: leaderboardEntries },
    });

    contestsUpdated++;
  }

  console.log(`✅ Scored ${teams.length} teams across ${contestsUpdated} contests for match ${matchId}`);
  return { teamsScored: teams.length, contestsUpdated };
}

/**
 * Get detailed point breakdown for a specific team.
 * Used by the leaderboard API to show per-player scoring.
 */
export async function getTeamBreakdown(teamId, matchId) {
  const team = await Team.findById(teamId).lean();
  if (!team) return null;

  const match = await Match.findOne({ matchId }).lean();
  
  // If we have scorecard data, use the real scoring engine
  if (match?.scorecardData) {
    const statsMap = extractPlayerStats(match.scorecardData);
    return scoreTeam(team, statsMap);
  }

  // Fallback for dummy/completed matches without scorecard data
  // We just show the players from the team and their assigned total points
  // We distribute points roughly: Captain 2x, VC 1.5x, others 1x
  const total = team.totalPoints || 0;
  let weightSum = 0;
  team.players.forEach(p => {
    if (p.isCaptain) weightSum += 2;
    else if (p.isViceCaptain) weightSum += 1.5;
    else weightSum += 1;
  });

  const playerBreakdown = team.players.map(p => {
    let multiplier = 1;
    if (p.isCaptain) multiplier = 2;
    else if (p.isViceCaptain) multiplier = 1.5;

    const raw = Math.floor((total / weightSum));
    const final = Math.floor(raw * multiplier);

    return {
      playerId: p.playerId,
      playerName: p.playerName,
      role: p.role,
      isCaptain: p.isCaptain,
      isViceCaptain: p.isViceCaptain,
      rawPoints: raw,
      finalPoints: final,
      stats: null
    };
  });

  return { 
    totalPoints: total, 
    playerBreakdown 
  };
}
