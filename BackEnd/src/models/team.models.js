// team.models.js

import mongoose from 'mongoose';

const playerPickSchema = new mongoose.Schema({
    playerId: {
        type: String,           // external API id
        required: true
    },
    playerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player"
    },
    playerName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"],
        required: true
    },
    isCaptain: {
        type: Boolean,
        default: false
    },
    isViceCaptain: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const teamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    matchId: {
        type: String,               // from Cricket API
        required: true
    },
    contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        required: false   // 👈 made optional
    },
    teamName: {
        type: String, 
        default: "My Team",
        trim: true
    },
    players: { 
        type: [playerPickSchema], 
        validate: {
            validator(arr) {
                return Array.isArray(arr) && arr.length === 11; 
            },
            message: "A fantasy team must have exactly 11 players."
        }
    },    
    totalPoints: {
        type: Number,
        default: 0              // updated as match goes on
    },
    rank: {
        type: Number,
        default: null
    },
}, { timestamps: true });

teamSchema.index({ userId: 1, contestId: 1 }, { unique: false }); // 👈 remove uniqueness
teamSchema.index({ contestId: 1, totalPoints: -1 });

teamSchema.pre("validate", function (next) {
    const ids = this.players.map(p => p.playerId);
    const unique = new Set(ids);

    if (unique.size !== ids.length) {
        return next(new Error("Duplicate players are not allowed in a team."));
    }

    const captains = this.players.filter(p => p.isCaptain).length;
    const vices = this.players.filter(p => p.isViceCaptain).length;

    if (captains !== 1 || vices !== 1) {
        return next(new Error("Team must have exactly one Captain and one Vice-Captain."));
    }

    const cap = this.players.find(p => p.isCaptain)?.playerId;
    const vice = this.players.find(p => p.isViceCaptain)?.playerId;

    if (cap && vice && cap === vice) {
        return next(new Error("Captain and Vice-Captain must be different players")); 
    }

    next();
});

export const Team = mongoose.model("Team", teamSchema);
