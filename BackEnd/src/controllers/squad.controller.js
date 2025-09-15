import { Match } from '../models/match.models.js';

export const getSquadsByMatchId = async (req, res) => {
    try {
        const { matchId } = req.params;

        const match = await Match.findOne(
            { matchId },
            { "squads.teamName": 1, "squads.players.id": 1, "squads.players.role": 1, "squads.players.name": 1, "squads.players.playerImg": 1 }
        ).lean();

        if ( !match ){
            return res.status(404).json({ message: "Match not found!" });
        }

        if ( !match.squads || match.squads.length === 0){
            return res.status(404).json({ message: "Squad not found!" });
        }

        return res.json({
            matchId,
            squads: match.squads.map( squad => ({
                teamName: squad.teamName,
                players: squad.players.map( player => ({
                    id: player.id,
                    name: player.name,
                    role: player.role,
                    playerImg: player.playerImg
                }))
            }))
        });
    } catch (error) {
        console.log(`Error fetching squads: ${error}`);
        res.status(500).json({message: 'Server error'});
    }
}