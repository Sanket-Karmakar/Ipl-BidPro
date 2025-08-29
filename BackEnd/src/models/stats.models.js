import { Schema } from 'mongoose';

export const statsSchema = new Schema({
    matchType: {
        type: String,
        enum: ["ipl", "odi", "test", "t20"],
        required: true
    },
    fn: {
        type: String,
        enum: ["batting", "bowling"],
        required: true
    }, 
    stat: {
        type: String, 
        required: true
    },
    value: {
        type: String
    }
}, {_id: false});


