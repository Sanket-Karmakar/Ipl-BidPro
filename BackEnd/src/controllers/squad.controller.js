import { getOrFetchSquads } from "../services/squadsService.js";

export const getSquadsByMatchId = async (req, res) => {
  try {
    const { matchId } = req.params;
    const squads = await getOrFetchSquads(matchId);

    if (!squads || squads.length === 0) {
      return res.status(404).json({ message: "Squad not found!" });
    }

    return res.json({
      matchId,
      squads: squads.map((squad) => ({
        teamName: squad.teamName,
        shortname: squad.shortname,
        img: squad.img,
        players: squad.players.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role,
          battingStyle: p.battingStyle,
          bowlingStyle: p.bowlingStyle,
          country: p.country,
          playerImg: p.playerImg
        }))
      }))
    });
  } catch (error) {
    console.error(`Error in getSquadsByMatchId: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
