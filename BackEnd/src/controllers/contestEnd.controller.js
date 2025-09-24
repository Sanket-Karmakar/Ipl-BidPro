// controllers/contestEndController.js
import { Contest } from "../models/contestModel.js";
import { User } from "../models/userModel.js";
import { Transaction } from "../models/transactionModel.js";
import { Team } from "../models/teamModel.js";

export const endContest = async (req, res) => {
  try {
    // Fetch the contest (only one active contest to complete)
    const contest = await Contest.findOne({ status: "Live" })
      .populate("leaderboard.userId", "username virtualCash")
      .populate("leaderboard.teamId", "teamName totalPoints");

    if (!contest) {
      return res.status(404).json({ message: "No live contest found." });
    }

    // Ensure contest has participants
    if (contest.joinedUsers.length === 0) {
      contest.status = "Completed";
      await contest.save();
      return res.status(200).json({ message: "Contest completed with no participants." });
    }

    // --------------- Calculate Prize Pool ---------------
    const totalPool = contest.joinedUsers.length * contest.entryFee;
    const firstPrize = Math.floor(totalPool * 0.5);
    const secondPrize = Math.floor(totalPool * 0.3);
    const thirdPrize = Math.floor(totalPool * 0.2);

    // --------------- Fetch Teams & Rank Them ---------------
    const teams = await Team.find({ contestId: contest._id }).sort({ totalPoints: -1 });

    if (teams.length === 0) {
      return res.status(400).json({ message: "No teams found for this contest." });
    }

    // Assign rank based on sorted points
    teams.forEach((team, index) => {
      team.rank = index + 1;
    });

    await Promise.all(teams.map(team => team.save()));

    // Update contest leaderboard
    contest.leaderboard = teams.map((team) => ({
      userId: team.userId,
      teamId: team._id,
      points: team.totalPoints,
      rank: team.rank,
    }));

    // --------------- Distribute Prizes ---------------
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const user = await User.findById(team.userId);

      if (!user) continue;

      let prize = 0;
      if (team.rank === 1) prize = firstPrize;
      if (team.rank === 2) prize = secondPrize;
      if (team.rank === 3) prize = thirdPrize;

      if (prize > 0) {
        user.virtualCash += prize;
        await user.save();

        // Log transaction
        const transaction = new Transaction({
          userId: user._id,
          amount: prize,
          type: "CREDIT",
          purpose: "PRIZE",
          contestId: contest._id,
          balanceAfter: user.virtualCash,
        });
        await transaction.save();
      }
    }

    // Mark contest completed
    contest.status = "Completed";
    await contest.save();

    res.status(200).json({
      message: "Contest ended successfully. Prizes distributed.",
      contestId: contest._id,
      totalPool,
      prizes: { firstPrize, secondPrize, thirdPrize },
      leaderboard: contest.leaderboard,
    });
  } catch (error) {
    console.error("End Contest Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
