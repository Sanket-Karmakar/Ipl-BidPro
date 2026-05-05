import cron from "node-cron";
import { updateMatches } from "../services/matchService.js";
import { refreshSquads } from "../services/squadsService.js";
import { scoreMatch } from "../services/scoringEngine.js";
import { Match } from "../models/match.models.js";
import { Contest } from "../models/contest.models.js";

let isRunningMatches = false;
let isRunningSquads = false;
let isRunningScoring = false;

// Helper for timestamped logs
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// Check if any match is currently live
async function hasLiveMatches() {
    try {
        const count = await Match.countDocuments({
            $or: [{ matchStarted: true, matchEnded: { $ne: true } }, { status: "ONGOING" }],
        });
        return count > 0;
    } catch {
        return false;
    }
}

// Run match update (with guard)
async function runMatchUpdate(label = "Scheduled") {
    if (isRunningMatches) {
        log(`${label} match update skipped (already running).`);
        return;
    }
    try {
        isRunningMatches = true;
        log(`Running ${label} match update...`);
        await updateMatches();
        log(`✅ ${label} match update completed.`);
    } catch (e) {
        console.error(`❌ ${label} update failed:`, e);
    } finally {
        isRunningMatches = false;
    }
}

// 1. Initial match update
(async () => {
    await runMatchUpdate("Initial");
})();

// 2. Standard: every 30 minutes
cron.schedule("*/30 * * * *", async () => {
    await runMatchUpdate("Scheduled (30m)");
});

// 3. Fast mode: every 5 minutes (only runs if live matches exist)
cron.schedule("*/5 * * * *", async () => {
    const live = await hasLiveMatches();
    if (!live) return; // skip — no live matches, save API hits
    log("⚡ Live match detected — running fast refresh...");
    await runMatchUpdate("Fast (5m)");
});

// 4. Squads: every hour
cron.schedule("0 * * * *", async () => {
    if (isRunningSquads) {
        log("Previous scheduled squad update still running — skipping.");
        return;
    }
    try {
        log("Running scheduled squad update...");
        isRunningSquads = true;
        await refreshSquads();
        log("✅ Scheduled squad update completed.");
    } catch (err) {
        console.error("❌ Scheduled squad update error:", err);
    } finally {
        isRunningSquads = false;
    }
});

log("Scheduler initialized: Matches every 30m (+ 5m fast if live), Squads every 1h, Scoring every 5m");

// 5. Fantasy Scoring: every 5 minutes
cron.schedule("*/5 * * * *", async () => {
    if (isRunningScoring) {
        log("Previous scoring run still in progress — skipping.");
        return;
    }
    try {
        isRunningScoring = true;

        // Find matches that need scoring:
        // - Live matches with scorecard data (provisional scoring)
        // - Completed matches linked to Live contests (final scoring)
        const matchesToScore = await Match.find({
            scorecardData: { $ne: null },
            $or: [
                { matchStarted: true, matchEnded: { $ne: true } },  // live
                { matchEnded: true },                                // completed
            ],
        }).select("matchId matchEnded").lean();

        if (matchesToScore.length === 0) return;

        // Only score matches that have associated contests
        for (const match of matchesToScore) {
            const hasContests = await Contest.exists({
                matchId: match.matchId,
                status: { $in: ["Live", "Upcoming"] },
            });
            if (!hasContests) continue;

            try {
                const result = await scoreMatch(match.matchId);
                if (result.teamsScored > 0) {
                    log(`🏏 Scored match ${match.matchId}: ${result.teamsScored} teams, ${result.contestsUpdated} contests`);
                }

                // If match is completed, mark associated Live contests as Completed
                if (match.matchEnded) {
                    await Contest.updateMany(
                        { matchId: match.matchId, status: "Live" },
                        { $set: { status: "Completed" } }
                    );
                }
            } catch (err) {
                console.error(`❌ Scoring failed for match ${match.matchId}:`, err.message);
            }
        }
    } catch (err) {
        console.error("❌ Scoring cron error:", err);
    } finally {
        isRunningScoring = false;
    }
});
