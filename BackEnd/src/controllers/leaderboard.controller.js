// controllers/contestLeaderboardController.js
import { Contest } from "../models/contestModel.js";
import { Team } from "../models/teamModel.js";

export const getLeaderboard = async (req, res) => {
  try {
    const contest = await Contest.findOne({ status: { $in: ["Live", "Completed"] } })
      .populate("leaderboard.userId", "username")
      .populate("leaderboard.teamId", "teamName totalPoints");

    if (!contest) {
      return res.status(404).json({ message: "No active or completed contest found." });
    }

    // If leaderboard is empty (e.g., before contest end), fallback to teams sorted by points
    let leaderboard = contest.leaderboard;

    if (!leaderboard || leaderboard.length === 0) {
      const teams = await Team.find({ contestId: contest._id })
        .sort({ totalPoints: -1 })
        .populate("userId", "username")
        .select("teamName totalPoints rank userId");

      leaderboard = teams.map((team, index) => ({
        userId: team.userId,
        teamId: team._id,
        teamName: team.teamName,
        points: team.totalPoints,
        rank: team.rank || index + 1,
      }));
    }

    res.status(200).json({
      contestId: contest._id,
      leaderboard,
    });
  } catch (error) {
    console.error("Get Leaderboard Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
