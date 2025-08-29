import mongoose, { Schema } from 'mongoose'
import { statsSchema } from './stats.models.js'

const playerSchema = new Schema({
    playerId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date
    },
    role: {
        type: String
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

export const Player = mongoose.model("Player", playerSchema);

