// scripts/db_checks.js
// Read-only DB health checks: totals, started/ended counts, latest updated docs, Asia Cup samples.
// Usage: MONGO_URL must be in env (or set in .env). Run: node scripts/db_checks.js

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import mongoose from 'mongoose';
import { Match } from '../models/match.models.js';

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI || process.env.DB_URI || process.env.MONGODB_URL;
if (!MONGO_URL) {
  console.error("ERROR: MONGO_URL is not set. Set it in environment or .env file.");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to DB.");

  const total = await Match.countDocuments();
  const started = await Match.countDocuments({ matchStarted: true });
  const ended = await Match.countDocuments({ matchEnded: true });
  const upcoming = await Match.countDocuments({ matchStarted: false, matchEnded: false });

  console.log("Totals:");
  console.log("  total matches:", total);
  console.log("  started (matchStarted: true):", started);
  console.log("  ended (matchEnded: true):", ended);
  console.log("  upcoming (started:false, ended:false):", upcoming);

  console.log("\nLatest 10 documents (id, updatedAt, matchStarted, matchEnded, status, name):");
  const latest = await Match.find().sort({ updatedAt: -1 }).limit(10).select('_id updatedAt matchStarted matchEnded status name').lean();
  latest.forEach(d => {
    console.log(`  ${d._id} | ${d.updatedAt} | started:${d.matchStarted} | ended:${d.matchEnded} | ${d.status} | ${d.name}`);
  });

  console.log("\nSample Asia Cup matches (if any):");
  const asia = await Match.find({ name: /Asia Cup/i }).sort({ dateTimeGMT: 1 }).limit(20).select('matchId name dateTimeGMT matchStarted matchEnded status series_id').lean();
  if (!asia || asia.length === 0) {
    console.log("  No Asia Cup matches found in DB.");
  } else {
    asia.forEach(d => console.log(`  ${d.matchId} | ${d.dateTimeGMT} | started:${d.matchStarted} | ended:${d.matchEnded} | ${d.status} | ${d.name}`));
  }

  await mongoose.disconnect();
  console.log("\nDisconnected.");
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
