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
<<<<<<< HEAD
=======

export const Player = mongoose.model("Player", playerSchema);
>>>>>>> 220e5f4d48593a812bc7f2e44f66c816b4ef1d6b

export const Player = mongoose.model("Player", playerSchema);