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
        required: false,
        default: ""
    },
    playerImg: {
        type: String,
        default: ""
    },
    stats: [statsSchema]
}, {timestamps: true});

playerSchema.index({ name: 1 });
playerSchema.index({ country: 1, role: 1 });
playerSchema.index({ "stats.matchType": 1 });
playerSchema.index({ "stats.fn": 1 });

<<<<<<< HEAD
export const Player = mongoose.model("Player", playerSchema);
=======
export const Player = mongoose.model("Player", playerSchema);

>>>>>>> 8970d6398f5b235d62f1f37d4f78b60eb448430e
