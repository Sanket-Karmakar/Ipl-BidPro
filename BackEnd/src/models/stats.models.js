import { Schema } from 'mongoose';

export const statsSchema = new Schema({
    matchType: {
        type: String,
        enum: ["test", "odi", "t20", "ipl"],
        required: true
    },
    stats: [{
        type: {
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
    }]
}, {_id: false});

