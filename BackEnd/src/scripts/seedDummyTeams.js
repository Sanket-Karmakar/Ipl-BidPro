/**
 * seedDummyTeams.js
 * 
 * Automatically seeds dummy fantasy teams + contests + leaderboards
 * for the latest 10 completed IPL matches found in the database.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../db/index.js";
import { Team } from "../models/team.models.js";
import { Contest } from "../models/contest.models.js";
import { Match } from "../models/match.models.js";
import User from "../models/user.models.js";

dotenv.config();

const DUMMY_USERS = [
  { username: "IPL_King", email: "king@dummy.com" },
  { username: "CricketGuru", email: "guru@dummy.com" },
  { username: "MasterBlaster", email: "master@dummy.com" },
  { username: "FantasyPro", email: "pro@dummy.com" },
  { username: "TeamBuilder", email: "builder@dummy.com" },
  { username: "WicketTaker", email: "taker@dummy.com" },
  { username: "SixerKing", email: "sixer@dummy.com" },
  { username: "GooglyMaster", email: "googly@dummy.com" },
  { username: "YorkerSpecialist", email: "yorker@dummy.com" },
  { username: "AllRounder1", email: "ar1@dummy.com" },
];

// A pool of dummy players to use if we can't find a squad
const FALLBACK_PLAYERS = [
  { playerId: "c61d247d-7f77-452c-b495-2813a9cd0ac4", playerName: "Virat Kohli", role: "Batsman", isCaptain: true, isViceCaptain: false },
  { playerId: "6db25d60-ff96-4d8d-8d22-dedeeb5ffa29", playerName: "Phil Salt", role: "Wicket-Keeper", isCaptain: false, isViceCaptain: true },
  { playerId: "74c6584a-45a5-4781-a5e7-c0c9340da954", playerName: "Devdutt Padikkal", role: "Batsman", isCaptain: false, isViceCaptain: false },
  { playerId: "88215ee9-ca67-48af-a3f0-6b38718bd830", playerName: "Rajat Patidar", role: "Batsman", isCaptain: false, isViceCaptain: false },
  { playerId: "7263e990-a9e9-4829-8adf-760d18d1315c", playerName: "Shubman Gill", role: "Batsman", isCaptain: false, isViceCaptain: false },
  { playerId: "7567e305-1b40-4eee-9290-e2fcb8804496", playerName: "Jos Buttler", role: "Wicket-Keeper", isCaptain: false, isViceCaptain: false },
  { playerId: "a90b2371-5c53-4c29-a382-9b52d40a7548", playerName: "Hardik Pandya", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
  { playerId: "3f3ecf51-8411-4046-9477-18c0fe3da6ac", playerName: "Bhuvneshwar Kumar", role: "Bowler", isCaptain: false, isViceCaptain: false },
  { playerId: "a1f7a1f3-f19c-43d2-bcd7-b4bae22f5842", playerName: "Rasikh Salam Dar", role: "Bowler", isCaptain: false, isViceCaptain: false },
  { playerId: "2190c28d-1712-4fd2-ae44-9ac54319fc21", playerName: "Josh Hazlewood", role: "Bowler", isCaptain: false, isViceCaptain: false },
  { playerId: "81c09c1b-1b1d-4e87-9eaa-d7d0a89a6159", playerName: "Krunal Pandya", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
];

async function seed() {
  await connectDB();

  // ── 1. Get latest 10 completed matches ──
  const completedMatches = await Match.find({ matchEnded: true })
    .sort({ dateTimeGMT: -1 })
    .limit(10)
    .lean();

  if (completedMatches.length === 0) {
    console.error("❌ No completed matches found in database to seed.");
    process.exit(1);
  }

  // ── 2. Ensure Dummy Users Exist ──
  const seededUsers = [];
  for (const du of DUMMY_USERS) {
    let user = await User.findOne({ email: du.email });
    if (!user) {
      user = await User.create({
        username: du.username,
        email: du.email,
        fullname: du.username,
        password: "password123",
      });
    }
    seededUsers.push(user);
  }

  // Get real users
  const realUsers = await User.find({ email: { $not: /@dummy\.com$/ } });
  const allUsers = [...realUsers, ...seededUsers];

  console.log(`✅ Seeding for ${allUsers.length} users and ${completedMatches.length} completed matches...`);

  for (const match of completedMatches) {
    console.log(`\n🏏 Processing Match: ${match.name} (${match.matchId})`);

    // Create/Find the contest
    let contest = await Contest.findOne({ matchId: match.matchId, title: { $regex: "Mega Contest" } });
    if (contest) {
      await Team.deleteMany({ contestId: contest._id });
      contest.joinedUsers = [];
      contest.leaderboard = [];
      await contest.save();
    } else {
      contest = await Contest.create({
        title: `Mega Contest – ${match.name}`,
        matchId: match.matchId,
        matchType: "T20", // Hardcoded to T20 for IPL matches
        entryFee: 50,
        prizePool: 500,
        maxTeams: 100,
        status: "Completed",
        joinedUsers: [],
        leaderboard: [],
      });
    }

    const leaderboardEntries = [];

    for (const user of allUsers) {
      const isDummy = user.email.endsWith("@dummy.com");
      
      // Points distribution
      let points = isDummy ? Math.floor(Math.random() * 450) + 100 : Math.floor(Math.random() * 300) + 150;
      
      // Realistic team names
      const teamName = isDummy 
        ? `${user.username}'s XI` 
        : `Team ${user.username.slice(0, 3).toUpperCase()}_${Math.floor(Math.random() * 99) + 1}`;

      // Create the team
      const team = await Team.create({
        userId: user._id,
        matchId: match.matchId,
        contestId: contest._id,
        teamName: teamName,
        players: FALLBACK_PLAYERS, 
        totalPoints: points,
      });

      leaderboardEntries.push({
        userId: user._id,
        teamId: team._id,
        points: points,
        username: user.username,
        teamName: teamName
      });

      await Contest.findByIdAndUpdate(contest._id, {
        $push: { joinedUsers: { userId: user._id, teamId: team._id } }
      });
    }

    // Sort and rank
    leaderboardEntries.sort((a, b) => b.points - a.points);
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    await Contest.findByIdAndUpdate(contest._id, {
      $set: { leaderboard: leaderboardEntries }
    });

    for (const entry of leaderboardEntries) {
      await Team.findByIdAndUpdate(entry.teamId, { rank: entry.rank, totalPoints: entry.points });
    }

    console.log(`  ✅ Seeded ${leaderboardEntries.length} entries. Winner: ${leaderboardEntries[0].username} (${leaderboardEntries[0].points} pts)`);
  }

  console.log("\n🎉 Database fully updated with latest 10 completed matches!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
