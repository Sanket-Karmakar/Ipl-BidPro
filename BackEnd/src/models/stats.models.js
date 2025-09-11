import mongoose from 'mongoose';

export const statsSchema = new mongoose.Schema({
    season: {
        type: String
    },
    matchType: {
        type: String,
        enum: ["IPL", "ODI", "Test", "T20I", "T20", "Other"],
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
        type: String,
        default: "0"
    },
    numericValue: {
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
>>>>>>> 8970d6398f5b235d62f1f37d4f78b60eb448430e
