// controllers/leaderboard.controller.js
import { Contest } from "../models/contest.models.js";
import { Team } from "../models/team.models.js";
import { getTeamBreakdown } from "../services/scoringEngine.js";

/**
 * GET /api/contests/:contestId/leaderboard
 * Returns the ranked leaderboard for a specific contest.
 */
export const getContestLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId)
      .populate("leaderboard.userId", "username profileImage")
      .populate("leaderboard.teamId", "teamName totalPoints")
      .lean();

    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found." });
    }

    let leaderboard = contest.leaderboard || [];

    // If leaderboard is empty, build it from teams
    if (leaderboard.length === 0) {
      const teams = await Team.find({ contestId })
        .sort({ totalPoints: -1 })
        .populate("userId", "username profileImage")
        .select("teamName totalPoints rank userId")
        .lean();

      leaderboard = teams.map((team, index) => ({
        userId: team.userId,
        teamId: team._id,
        teamName: team.teamName,
        points: team.totalPoints,
        rank: team.rank || index + 1,
      }));
    }

    // Determine match status
    const isLive = contest.status === "Live";
    const isCompleted = contest.status === "Completed";

    res.status(200).json({
      success: true,
      contestId: contest._id,
      contestTitle: contest.title,
      matchId: contest.matchId,
      status: contest.status,
      prizePool: contest.prizePool,
      entryFee: contest.entryFee,
      totalParticipants: contest.joinedUsers?.length || 0,
      isLive,
      isCompleted,
      leaderboard,
    });
  } catch (error) {
    console.error("Get Contest Leaderboard Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * GET /api/contests/:contestId/leaderboard/:teamId/breakdown
 * Returns per-player point breakdown for a team in a contest.
 */
export const getTeamPointBreakdown = async (req, res) => {
  try {
    const { contestId, teamId } = req.params;

    const contest = await Contest.findById(contestId).lean();
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found." });
    }

    const breakdown = await getTeamBreakdown(teamId, contest.matchId);
    if (!breakdown) {
      return res.status(404).json({ success: false, message: "Breakdown not available. Scorecard may not be loaded yet." });
    }

    res.status(200).json({
      success: true,
      teamId,
      contestId,
      totalPoints: breakdown.totalPoints,
      players: breakdown.playerBreakdown,
    });
  } catch (error) {
    console.error("Get Team Breakdown Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * POST /api/contests/:contestId/score   (admin/manual trigger)
 * Manually trigger scoring for a contest's match.
 */
export const triggerScoring = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId).lean();
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found." });
    }

    // Dynamic import to avoid circular deps
    const { scoreMatch } = await import("../services/scoringEngine.js");
    const result = await scoreMatch(contest.matchId);

    res.status(200).json({
      success: true,
      message: `Scoring complete for match ${contest.matchId}`,
      ...result,
    });
  } catch (error) {
    console.error("Trigger Scoring Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
