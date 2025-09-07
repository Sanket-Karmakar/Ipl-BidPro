import { Match } from '../models/match.models.js';

export const getAllMatches = async (req, res) => {
    try { 
        const upcomingMatches = await Match.find({
            matchStarted: false,
            $and: [
                { "teams.0": { $ne: "TBC" } },
                { "teams.1": { $ne: "TBC" } },
                { venue: { $ne: "TBC, TBC" } }
            ]
        }).sort({dateTimeGMT: 1});
        res.status(200);
        return res.json(upcomingMatches);
    } catch (error) {
        res.status(500);
        return res.json({ 
            message: `Error fetching matches`, 
            error : error.message
        });
    }
};

export const getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            res.status(404);
            return res.json({
                message: `Match not found`
            });
        }
        res.status(200);
        return res.json(match);
    } catch (error) {
        res.status(500);
        return res.json({
            message: `Error fetching match`,
            error: error.message
        })
    }
};