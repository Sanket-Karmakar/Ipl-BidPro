// src/controllers/team.controller.js
import { Team } from "../models/team.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createTeam = async (req, res) => {
  try {
    const userId = req.user._id;
    const { matchId, contestId, teamName, players } = req.body;

    const team = new Team({
      userId,
      matchId,
      contestId: contestId || null, // ✅ allow null
      teamName,
      players,
    });

    await team.save();

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    console.error("Create team error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamsByMatch = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { matchId } = req.params;

  const teams = await Team.find({ matchId, userId });
  return res
    .status(200)
    .json(new ApiResponse(200, teams, "Teams fetched successfully"));
});



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

// @desc Update an existing team
// @route PUT /api/teams/:teamId
// @access Private
export const updateTeam = async (req, res) => {
  try {
    const userId = req.user._id;
    const { teamId } = req.params;

    const team = await Team.findOne({ _id: teamId, userId });
    if (!team) {
      return res.status(404).json({ message: "Team not found or not authorized" });
    }

    // update fields
    team.players = req.body.players || team.players;
    team.teamName = req.body.teamName || team.teamName;
    team.matchId = req.body.matchId || team.matchId;
    team.contestId = req.body.contestId || team.contestId;

    await team.save();

    res.status(200).json(team);
  } catch (error) {
    console.error("Update team error:", error);
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

