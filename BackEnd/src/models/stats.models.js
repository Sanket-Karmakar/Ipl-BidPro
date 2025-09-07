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
<<<<<<< HEAD
}, {_id: false});
=======
}, {_id: false});

>>>>>>> 220e5f4d48593a812bc7f2e44f66c816b4ef1d6b
