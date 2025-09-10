import { Player } from '../models/player.models.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const importPlayer = asyncHandler ( async (req, res) => {
    const data = req.body;

    if (!data || !data.id || !data.name){
        throw new ApiError(400, "Invalid player data!");
    }

    const formattedStats = [];

    for (const matchType of Object.keys(data.stats || {})){
        const matchStats = data.stats[matchType];

        for (const fn of ["batting", "bowling"]){
            if (matchStats[fn]){
                for (const statKey in matchStats[fn]) {
                    formattedStats.push({
                        matchType,
                        fn,
                        stat: statKey,
                        value: matchStats[fn][statKey]?.toString() ?? "0"
                    });
                }
            }
        }
    }

    const playerDoc = {
        playerId: data.id,
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        role: data.role,
        battingStyle: data.battingStyle,
        bowlingStyle: data.bowlingStyle,
        placeOfBirth: data.placeOfBirth,
        country: data.country,
        playerImg: data.playerImg,
        stats: formattedStats
    };

    const player = await Player.findOneAndUpdate(
        { playerId: data.id },
        playerDoc,
        { upsert: true, new: true }
    );

    res.status(201).json(
        new ApiResponse(201, player, "Player imported successfully!")
    );
});

export { importPlayer };
