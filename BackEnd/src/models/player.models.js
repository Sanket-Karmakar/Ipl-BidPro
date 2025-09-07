import mongoose from 'mongoose';
import { statsSchema } from './stats.models.js';

const playerSchema = new mongoose.Schema({
    playerId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    role: {
        type: String,
        enum: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"]
    },
    battingStyle: {
        type: String
    },
    bowlingStyle: {
        type: String
    },
    placeOfBirth: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    playerImg: {
        type: String
    },
    stats: [statsSchema]
}, {timestamps: true});

playerSchema.index({ name: 1 });
playerSchema.index({ country: 1, role: 1 });
playerSchema.index({ "stats.season": 1, "stats.matchType": 1 });

export const Player = mongoose.model("Player", playerSchema);

