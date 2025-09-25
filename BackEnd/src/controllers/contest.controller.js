// controllers/contestController.js
import { Contest } from "../models/contest.models.js";
import User from "../models/user.models.js";   
import { Transaction } from "../models/transaction.models.js";
import { Team } from "../models/team.models.js";

export const joinContest = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { teamId } = req.body;

    // ---------------- Contest Check ----------------
    const contest = await Contest.findOne({ status: "Upcoming" });
    if (!contest) {
      return res.status(404).json({ message: "No active contest found." });
    }

    // Check if contest has space
    if (contest.joinedUsers.length >= contest.maxTeams) {
      return res.status(400).json({ message: "Contest is full." });
    }

    // Check if already joined
    const alreadyJoined = contest.joinedUsers.some(
      (j) => String(j.userId) === String(userId)
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "User already joined contest." });
    }

    // ---------------- Team Validation ----------------
    const team = await Team.findOne({ _id: teamId, userId, contestId: contest._id });
    if (!team) {
      return res.status(400).json({ message: "Invalid or missing team." });
    }

    // ---------------- User Balance ----------------
    const user = await User.findById(userId);
    if (!user || user.virtualCash < contest.entryFee) {
      return res
        .status(400)
        .json({ message: "Insufficient balance to join contest." });
    }

    // ---------------- Deduct Entry Fee ----------------
    user.virtualCash -= contest.entryFee;
    await user.save();

    // ---------------- Log Transaction ----------------
    const transaction = new Transaction({
      userId,
      amount: contest.entryFee,
      type: "DEBIT",
      purpose: "ENTRY_FEE",
      contestId: contest._id,
      balanceAfter: user.virtualCash,
    });
    await transaction.save();

    // ---------------- Add to Contest ----------------
    contest.joinedUsers.push({ userId, teamId });
    await contest.save();

    res.status(200).json({
      message: "Successfully joined contest.",
      contestId: contest._id,
      teamId: team._id,
      spotsLeft: contest.spotsLeft,
      userBalance: user.virtualCash,
    });
  } catch (error) {
    console.error("Join Contest Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};