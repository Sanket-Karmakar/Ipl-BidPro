import { Contest } from "../models/contest.models.js";
import User from "../models/user.models.js";
import { Transaction } from "../models/transaction.models.js";
import { Team } from "../models/team.models.js";

// ✅ Fetch available contests (unchanged)
// controllers/contest.controller.js
export const getAvailableContests = async (req, res) => {
  try {
    const { matchId } = req.query;

    const query = { status: "Upcoming" };
    if (matchId) query.matchId = matchId; // filter by match

    const contests = await Contest.find(query).select("-__v").lean();

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
// ✅ Join contest (fixed version)
export const joinContest = async (req, res) => {
  try {
    const { userId, teamId, contestId, matchId } = req.body;

    // ---------------- Validate Input ----------------
    if (!userId || !teamId || !contestId || !matchId) {
      return res.status(400).json({ message: "userId, teamId, contestId, and matchId are required." });
    }

    // ---------------- Contest Validation ----------------
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }
    if (contest.status !== "Upcoming") {
      return res.status(400).json({ message: "Contest is not open for joining." });
    }
    if (contest.joinedUsers.length >= contest.maxTeams) {
      return res.status(400).json({ message: "Contest is full." });
    }

    // ---------------- Team Validation ----------------
    const team = await Team.findOne({ _id: teamId, userId, matchId });
    if (!team) {
      return res.status(400).json({ message: "Invalid team or team does not belong to this match." });
    }

    // Check if user already joined with this team
    const alreadyJoined = contest.joinedUsers.some(
      (j) => String(j.userId) === String(userId) && String(j.teamId) === String(teamId)
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "You already joined this contest with this team." });
    }

    // ---------------- User Validation ----------------
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.virtualCash < contest.entryFee) {
      return res.status(400).json({ message: "Insufficient balance to join contest." });
    }

    // ---------------- Deduct Entry Fee ----------------
    user.virtualCash -= contest.entryFee;
    await user.save();

    // ---------------- Log Transaction ----------------
    await Transaction.create({
      userId,
      amount: contest.entryFee,
      type: "DEBIT",
      purpose: "ENTRY_FEE",
      contestId: contest._id,
      balanceAfter: user.virtualCash,
    });

    // ---------------- Add User to Contest ----------------
    await Contest.findByIdAndUpdate(
      contestId,
      { $push: { joinedUsers: { userId, teamId } } }, // ✅ direct update → no schema revalidation
      { new: true }
    );

    res.status(200).json({
      message: "Successfully joined contest.",
      contestId,
      teamId,
      userBalance: user.virtualCash,
    });
  } catch (error) {
    console.error("❌ Join Contest Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get contests joined by a user (now takes userId from query)
// ✅ Get contests joined by a user for a specific match
export const getUserContests = async (req, res) => {
  try {
    const { userId, matchId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const query = { "joinedUsers.userId": userId };
    if (matchId) query.matchId = matchId;

    const contests = await Contest.find(query)
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

