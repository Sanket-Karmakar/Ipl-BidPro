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
