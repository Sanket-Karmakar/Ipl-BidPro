import { Contest } from "../models/contest.models.js";
import User from "../models/user.models.js";
import { Transaction } from "../models/transaction.models.js";
import { Team } from "../models/team.models.js";

// ✅ Fetch available contests (unchanged)
export const getAvailableContests = async (req, res) => {
  try {
    const contests = await Contest.find({ status: "Upcoming" }).select("-__v").lean();

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

// ✅ Join contest (now takes userId from body instead of JWT)
export const joinContest = async (req, res) => {
  try {
    const { userId, teamId } = req.body; // userId is now passed directly

    if (!userId || !teamId) {
      return res.status(400).json({ message: "userId and teamId are required." });
    }

    const contest = await Contest.findOne({ status: "Upcoming" });
    if (!contest) {
      return res.status(404).json({ message: "No active contest found." });
    }

    if (contest.joinedUsers.length >= contest.maxTeams) {
      return res.status(400).json({ message: "Contest is full." });
    }

    const alreadyJoined = contest.joinedUsers.some(
      (j) => String(j.userId) === String(userId)
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "User already joined contest." });
    }

    const team = await Team.findOne({ _id: teamId, userId, contestId: contest._id });
    if (!team) {
      return res.status(400).json({ message: "Invalid or missing team." });
    }

    const user = await User.findById(userId);
    if (!user || user.virtualCash < contest.entryFee) {
      return res.status(400).json({ message: "Insufficient balance to join contest." });
    }

    user.virtualCash -= contest.entryFee;
    await user.save();

    const transaction = new Transaction({
      userId,
      amount: contest.entryFee,
      type: "DEBIT",
      purpose: "ENTRY_FEE",
      contestId: contest._id,
      balanceAfter: user.virtualCash,
    });
    await transaction.save();

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

// ✅ Get contests joined by a user (now takes userId from query)
export const getUserContests = async (req, res) => {
  try {
    const { userId } = req.query; // userId passed in query

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const contests = await Contest.find({ "joinedUsers.userId": userId })
      .populate("joinedUsers.teamId", "name players")
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
