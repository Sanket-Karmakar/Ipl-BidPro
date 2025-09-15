import cron from "node-cron";
import { updateMatches } from "../services/matchService.js";
import { refreshSquads } from "../services/squadsService.js";

let isRunningMatches = false;
let isRunningSquads = false;

// Helper for timestamped logs
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// 1. Initial match update
(async () => {
  log("Running initial match update...");
  if (isRunningMatches) {
    log("Initial match update skipped (already running).");
    return;
  }
  try {
    isRunningMatches = true;
    await updateMatches();
    log("✅ Initial match update completed.");
  } catch (e) {
    console.error("❌ Initial update failed:", e);
  } finally {
    isRunningMatches = false;
  }
})();

// 2. Matches: every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  if (isRunningMatches) {
    log("Previous scheduled match update still running — skipping.");
    return;
  }
  try {
    log("Running scheduled match update...");
    isRunningMatches = true;
    await updateMatches();
    log("✅ Scheduled match update completed.");
  } catch (err) {
    console.error("❌ Scheduled match update error:", err);
  } finally {
    isRunningMatches = false;
  }
});

// 3. Squads: every 6 hours
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

log("Scheduler initialized: Matches update every 30m, Squads update every 6h");
