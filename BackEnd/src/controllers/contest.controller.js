// controllers/contest.controller.js
import { Contest } from "../models/contest.models.js";
import User from "../models/user.models.js";   
import { Transaction } from "../models/transaction.models.js";
import { Team } from "../models/team.models.js";

// ✅ Fetch available contests
export const getAvailableContests = async (req, res) => {
  try {
    const contests = await Contest.find({ status: "Upcoming" })
      .select("-__v") // optional: exclude internal fields
      .lean();

    if (!contests || contests.length === 0) {
      return res.status(404).json({ message: "No available contests." });
    }

    res.status(200).json({
      message: "Available contests fetched successfully.",
      contests,
    });
  } catch (error) {
    console.error("Get Available Contests Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Join contest
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


export const getUserContests = async (req, res) => {
  try {
    const userId = req.user._id; // comes from auth middleware

    const contests = await Contest.find({ "joinedUsers.userId": userId })
      .populate("joinedUsers.teamId", "name players") // optional: populate team info
      .select("-__v")
      .lean();

    if (!contests || contests.length === 0) {
      return res.status(404).json({ message: "User has not joined any contests." });
    }

    res.status(200).json({
      message: "Joined contests fetched successfully.",
      contests,
    });
  } catch (error) {
    console.error("Get User Contests Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};