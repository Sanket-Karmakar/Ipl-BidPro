import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    r: {
        type: Number,
        min: 0
    },
    w: {
        type: Number,
        min: 0,
        max: 10
    }, 
    o: {
        type: Number,
        min: 0
    },
    inning: {
        type: String
    }
}, { _id: false });

const teamInfoSchema = new mongoose.Schema({
    name: {
        type: String
    }, 
    shortname: {
        type: String
    },
    img: {
        type: String
    }
}, { _id: false });

const matchSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    matchType: {
        type: String,
        enum: ['T20', 'T20I', 'Test', 'ODI']
    },
    status: {
        type: String
    },
    venue: {
        type: String
    },
    date: {
        type: Date
    },
    dateTimeGMT: {
        type: Date
    },
    teams: {
        type: [String],
        validate: [arr => arr.length === 2, 'Teams array must have exactly 2 teams']
    },
    teamInfo: [ teamInfoSchema ],
    score: [ scoreSchema ],
    series_id: {
        type: String
    },
    fantasyEnabled: {
        type: Boolean,
        default: false
    },
    hasSquad: {
        type: Boolean,
        default: false
    },
    matchStarted: {
        type: Boolean,
        default: false
    },
    matchEnded: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Match = mongoose.model("Match", matchSchema);

