import mongoose from 'mongoose';

const playerMatchStatsSchema = new mongoose.Schema({
    matchId: {
        type: String,               // from Cricket API
        required: true              // external player id
    },
    playerId: {
        type: String, 
        required: true
    },
    playerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player"
    },
    teamName: {
        type: String
    },
    matchType: {
        type: String,
        enum: ['T20', 'ODI', 'Test'],
        required: true
    },
    // batting stats
    runs: {
        type: Number,
        default: 0
    },
    ballsFaced: {
        type: Number,
        default: 0
    },
    fours: {
        type: Number,
        default: 0
    },
    sixes: {
        type: Number,
        default: 0
    },
    strikeRate: {
        type: Number,
        default: 0
    },
    // bowling stats
    overs: {
        type: Number,
        default: 0
    },
    wickets: {
        type: Number,
        default: 0
    },
    runsConceded: {
        type: Number,
        default: 0
    },
    economy: {
        type: Number,
        default: 0
    },
    maidens: {
        type: Number,
        default: 0
    },
    // fielding stats
    catches: {
        type: Number,
        default: 0
    }, 
    stumping: {
        type: Number,
        default: 0
    },
    runOuts: {
        type: Number,
        default: 0
    },
    // fantasy 
    fantasyPoints: {
        type: Number,
        default: 0
    },
    computedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

playerMatchStatsSchema.index({matchId: 1, playerId:   1}, {unique: true});
playerMatchStatsSchema.index({matchId: 1, fantasyPoints: -1});

export const PlayerMatchStats = mongoose.model("PlayerMatchStats", playerMatchStatsSchema);

