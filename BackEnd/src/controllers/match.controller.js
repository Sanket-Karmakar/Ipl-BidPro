import { Match } from '../models/match.models.js';
import { getUpcomingMatches, getCompletedMatches, getOngoingMatches } from '../services/matchService.js';


export const getAllMatches = async (req, res) => {
    try {
        const { fields, limit = 100, page = 1, excludePlaceholders = 'true' } = req.query;

      
        const projection = fields
            ? fields.split(',').reduce((acc, f) => { acc[f.trim()] = 1; return acc; }, {})
            : {};

        const skip = Math.max(0, (Number(page) - 1)) * Math.max(1, Number(limit));

    
        const filter = (excludePlaceholders === 'true')
            ? {
                $and: [
                    { "teams.0": { $not: { $regex: /^tbc$/i } } },
                    { "teams.1": { $not: { $regex: /^tbc$/i } } },
                    { venue: { $not: { $regex: /^tbc, tbc$/i } } }
                ]
            }
            : {}; // empty filter -> return all matches

        const matches = await Match.find(filter, projection)
            .sort({ dateTimeGMT: 1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        return res.status(200).json(matches);
    } catch (error) {
        console.error('getAllMatches error:', error);
        return res.status(500).json({
            message: `Error fetching matches`,
            error: error?.message ?? String(error)
        });
    }
};

export const getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).lean();
        if (!match) {
            return res.status(404).json({ message: `Match not found` });
        }
        return res.status(200).json(match);
    } catch (error) {
        console.error('getMatchById error:', error);
        return res.status(500).json({
            message: `Error fetching match`,
            error: error.message
        });
    }


};

export const fetchUpcomingMatches = async (req, res) => {
    try {
        const matches = await getUpcomingMatches();
        return res.status(200).json(matches);
    } catch (error) {
        console.error('fetchUpcomingMatches error:', error);
        return res.status(500).json({ error: 'Failed to fetch upcoming matches!', message: error.message });
    }
};

export const fetchOngoingMatches = async (req, res) => {
    try {
        const matches = await getOngoingMatches();
        return res.status(200).json(matches);
    } catch (error) {
        console.error('fetchOngoingMatches error:', error);
        return res.status(500).json({ error: 'Failed to fetch ongoing matches!', message: error.message });
    }
};

export const fetchCompletedMatches = async (req, res) => {
    try {
        const matches = await getCompletedMatches();
        return res.status(200).json(matches);
    } catch (error) {
        console.error('fetchCompletedMatches error:', error);
        return res.status(500).json({ error: 'Failed to fetch completed matches!', message: error.message });
    }
};

