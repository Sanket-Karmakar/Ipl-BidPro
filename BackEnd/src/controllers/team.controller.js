// src/controllers/team.controller.js
import { Team } from "../models/team.models.js";

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req, res) => {
  try {
    const userId = req.user._id; // 👈 from auth middleware
    const { matchId, contestId, teamName, players } = req.body;

    if (!matchId || !players || players.length !== 11) {
      return res.status(400).json({ message: "MatchId and exactly 11 players are required." });
    }

    const newTeam = await Team.create({
      userId,
      matchId,
      contestId: contestId || null,
      teamName,
      players
    });

    res.status(201).json(newTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get teams for a match (by logged-in user)
// @route   GET /api/teams/:matchId
// @access  Private
export const getUserTeamsByMatch = async (req, res) => {
  try {
    const userId = req.user._id; // 👈 from auth middleware
    const { matchId } = req.params;

    const teams = await Team.find({ userId, matchId }).sort({ createdAt: -1 });

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};


export const deleteTeam = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { teamId } = req.params;

    const team = await Team.findOne({ _id: teamId, userId });
    if (!team) {
      return res.status(404).json({ message: "Team not found or not authorized" });
    }

    await team.deleteOne();

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};