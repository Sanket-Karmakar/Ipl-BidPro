import mongoose from 'mongoose';

export const statsSchema = new mongoose.Schema({
    scope: {
        type: String,
        enum: ["Career", "Season"],
        default: "Career"
    },
    season: {
        type: String
    },
    matchType: {
        type: String,
        enum: ["IPL", "ODI", "Test", "T20"],
        required: true
    },
    fn: {
        type: String,
        enum: ["batting", "bowling", "fielding"],
        required: true
    }, 
    stat: {
        type: String, 
        required: true
    },
    value: {
        type: Number,
        default: 0
    },
    unit: {
        type: String
    }
}, {_id: false});