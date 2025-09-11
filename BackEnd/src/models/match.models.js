import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    r: { type: Number, min: 0 },
    w: { type: Number, min: 0, max: 10 },
    o: { type: Number, min: 0 },
    inning: { type: String }
}, { _id: false });

const teamInfoSchema = new mongoose.Schema({
    name: { type: String },
    shortname: { type: String },
    img: { type: String }
}, { _id: false });

const matchSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true
    },
    name: { type: String },
    matchType: {
        type: String,
        enum: ['T20', 'T20I', 'Test', 'ODI', 'Other'],
        default: 'Other'
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'COMPLETED', 'ONGOING', 'UNKNOWN', 'ABANDONED', 'CANCELLED'],
        default: 'UNKNOWN'
    },
    venue: { type: String },
    date: { type: Date },
    dateTimeGMT: { type: Date },
    teams: {
        type: [String],
        validate: [arr => arr.length === 2, 'Teams array must have exactly 2 teams']
    },
    teamInfo: [ teamInfoSchema ],
    score: [ scoreSchema ],
    series_id: { type: String },
    fantasyEnabled: { type: Boolean, default: false },
    hasSquad: { type: Boolean, default: false },
    matchStarted: { type: Boolean, default: false },
    matchEnded: { type: Boolean, default: false }
}, { timestamps: true });

// ensure index (will be created on startup if autoIndex=true)
matchSchema.index({ matchId: 1 }, { unique: true });

/**
 * Normalize key fields before validation so uniqueness is consistent:
 * - ensure matchId is string & trimmed
 * - uppercase/normalize status if provided
 */
matchSchema.pre('validate', function (next) {
    if (this.matchId !== undefined && this.matchId !== null) {
        this.matchId = String(this.matchId).trim();
    }

    if (this.status && typeof this.status === 'string') {
        const s = this.status.toUpperCase().trim();
        // map common variants to canonical enums
        if (s.includes('NOT') || s.includes('SCHEDULE') || s === 'SCHEDULED') {
            this.status = 'UPCOMING';
        } else if (s.includes('LIVE') || s.includes('IN PROGRESS') || s === 'ONGOING') {
            this.status = 'ONGOING';
        } else if (s.includes('FINISH') || s.includes('COMPLETED') || s === 'RESULT') {
            this.status = 'COMPLETED';
        } else if (s.includes('ABANDON')) {
            this.status = 'ABANDONED';
        } else if (s.includes('CANCEL')) {
            this.status = 'CANCELLED';
        } else {
            this.status = ['UPCOMING', 'ONGOING', 'COMPLETED', 'ABANDONED', 'CANCELLED'].includes(s) ? s : 'UNKNOWN';
        }
    }
    next();
});

/**
 * Virtual category derived from fields for quick filtering on frontend:
 * - COMPLETED if matchEnded or status COMPLETED
 * - ONGOING if matchStarted or status ONGOING
 * - UPCOMING otherwise
 */
matchSchema.virtual('category').get(function () {
    if (this.matchEnded || this.status === 'COMPLETED') return 'COMPLETED';
    if (this.matchStarted || this.status === 'ONGOING') return 'ONGOING';
    return 'UPCOMING';
});

/**
 * Static helper: upsertFromApi(apiObj)
 *  - Normalizes common fields
 *  - Performs atomic findOneAndUpdate with upsert:true
 *  - Returns the saved/updated doc
 *
 * Use this everywhere you ingest matches from external APIs.
 */
matchSchema.statics.upsertFromApi = async function (apiMatch) {
    const Match = this;

    if (!apiMatch) throw new Error('No match object provided to upsertFromApi');
    const candidateIds = [
        apiMatch.matchId, apiMatch.match_id, apiMatch.uniqueId,
        apiMatch.id, apiMatch.unique_id, apiMatch.unique_id || apiMatch.uniqueId
    ];
    const rawId = candidateIds.find(Boolean);
    if (!rawId) {
        throw new Error('No matchId found in API object');
    }
    const matchId = String(rawId).trim();

    // Map fields (defensive)
    const payload = {
        matchId,
        name: apiMatch.name || apiMatch.title || apiMatch.matchName || apiMatch.match,
        matchType: apiMatch.matchType || apiMatch.format || apiMatch.type || 'Other',
        status: apiMatch.status || apiMatch.match_status || apiMatch.state || 'UNKNOWN',
        venue: apiMatch.venue || apiMatch.location,
        date: apiMatch.date ? new Date(apiMatch.date) : (apiMatch.startDate ? new Date(apiMatch.startDate) : null),
        dateTimeGMT: apiMatch.dateTimeGMT ? new Date(apiMatch.dateTimeGMT) : (apiMatch.date_time_gmt ? new Date(apiMatch.date_time_gmt) : null),
        teams: apiMatch.teams || apiMatch.teamNames || apiMatch.team_names || [],
        teamInfo: apiMatch.teamInfo || apiMatch.teams_info || apiMatch.teamsInfo || [],
        score: apiMatch.score || apiMatch.scores || [],
        series_id: apiMatch.series_id || apiMatch.seriesId || apiMatch.series,
        fantasyEnabled: !!apiMatch.fantasyEnabled,
        hasSquad: !!apiMatch.hasSquad,
        matchStarted: !!apiMatch.matchStarted,
        matchEnded: !!apiMatch.matchEnded
    };

    // Use atomic upsert
    const updated = await Match.findOneAndUpdate(
        { matchId },
        {
            $set: payload,
            // setOnInsert could set createdAt fields or defaults if needed
            $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    return updated;
};

export const Match = mongoose.model('Match', matchSchema);