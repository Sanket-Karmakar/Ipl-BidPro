import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    matchId: {
        type: String,           // from Cricket API
        required: true
    },
    matchType: {
        type: String,
        enum: ['T20', 'Test', 'ODI'],
        required: true
    },
    entryFee: {
        type: Number,           // Virtual Cash
        default: 0,
        min: 0
    },
    prizePool: {
        type: Number,
        default: 0,
        min: 0
    },
    maxTeams: {
        type: Number,
        default: 100,
        min: 2
    },
    joinedUsers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        _id: false
    }],
    status: {
        type: String,
        enum: ['Upcoming', 'Live', 'Completed'],
        default: 'Upcoming'
    },
    leaderboard: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        points: {
            type: Number,
            default: 0
        },
        rank: {
            type: Number
        },
        _id: false
    }],
    matchStartAt: {
        type: Date
    },
    isPractice: {
        type: Boolean,
        default: false
    },
    scoringVersion: {
        type: String,
        default: "v1"
    }
}, { timestamps: true });

contestSchema.index({
    matchId: 1,
    status: 1
});
contestSchema.index({
    "leaderboard.rank": 1
});

contestSchema.set('toJSON', {
    virtuals: true 
});
contestSchema.set('toObject', { 
    virtuals: true 
});

contestSchema.virtual("spotsLeft").get(function () {
    return Math.max(0, (this.maxTeams || 0) - (this.joinedUsers?.length || 0));
});

contestSchema.pre("save", function (next) {
    if (this.joinedUsers && this.joinedUsers.length > (this.maxTeams || 0)) {
        return next(new Error("Contest cannot have more joined users than maxTeams."));
    }
    const userIds = (this.joinedUsers || []).map(j => String(j.userId));
    if ((new Set(userIds)).size !== userIds.length) {
        return next(new Error("Duplicate user entries found in joinedUsers."));
    }
    next();
});

export const Contest = mongoose.model("Contest", contestSchema);

