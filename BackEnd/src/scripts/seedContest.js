// scripts/seedContest.js
import { Contest } from "../models/contest.models.js";
import connectDB from "../db/index.js";

const seedContests = async () => {
  await connectDB();

  await Contest.deleteMany({});
  await Contest.insertMany([
    {
      name: "Mega IPL Contest",
      entryFee: 100,
      maxTeams: 50,
      status: "Upcoming",
      joinedUsers: []
    },
    {
      name: "Practice Match",
      entryFee: 0,
      maxTeams: 10,
      status: "Upcoming",
      joinedUsers: []
    }
  ]);

  console.log("Contests seeded ✅");
  process.exit();
};

seedContests();
