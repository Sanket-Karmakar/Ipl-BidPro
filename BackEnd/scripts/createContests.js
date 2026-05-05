import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://karmakarsanket98:sanketkarmakar98@cluster0.fnvtabb.mongodb.net/ipl-bidpro').then(async () => {
  const db = mongoose.connection.db;

  // Find upcoming IPL 2026 matches (after today May 1, 2026)
  const matches = await db.collection('matches').find({
    series_id: '87c62aac-bc3c-4738-ab93-19da0690488f',
    matchEnded: { $ne: true },
    dateTimeGMT: { $gte: new Date('2026-05-01') }
  }).project({ matchId: 1, name: 1, teams: 1, dateTimeGMT: 1 }).sort({ dateTimeGMT: 1 }).limit(15).toArray();

  console.log(`Found ${matches.length} upcoming IPL 2026 matches:\n`);
  matches.forEach(m => {
    const d = new Date(m.dateTimeGMT);
    console.log(`${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} | ${m.name?.split(',')[0]} | ${m.matchId}`);
  });

  // Dream11-style contest templates
  const templates = [
    { title: 'Mega Contest', entryFee: 49, prizePool: 1000, maxTeams: 25 },
    { title: 'Head to Head', entryFee: 100, prizePool: 180, maxTeams: 3 },
    { title: 'Winner Takes All', entryFee: 25, prizePool: 500, maxTeams: 25 },
    { title: 'Practice Match', entryFee: 0, prizePool: 0, maxTeams: 10, isPractice: true },
  ];

  let created = 0;
  for (const match of matches) {
    for (const tmpl of templates) {
      const exists = await db.collection('contests').findOne({
        matchId: match.matchId,
        title: tmpl.title,
      });
      if (exists) {
        console.log(`⏭ "${tmpl.title}" already exists for ${match.teams?.[0]} vs ${match.teams?.[1]}`);
        continue;
      }

      await db.collection('contests').insertOne({
        title: tmpl.title,
        matchId: match.matchId,
        matchType: 'T20',
        entryFee: tmpl.entryFee,
        prizePool: tmpl.prizePool,
        maxTeams: tmpl.maxTeams,
        joinedUsers: [],
        status: 'Upcoming',
        leaderboard: [],
        matchStartAt: match.dateTimeGMT,
        isPractice: tmpl.isPractice || false,
        scoringVersion: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      created++;
    }
  }

  // Also delete the old contests for completed matches (cleanup)
  const deleted = await db.collection('contests').deleteMany({
    matchId: { $in: [
      '547b47e3-b2d9-4f51-8a49-8e7e4c946a6e',
      '950a9aad-a1a7-46ef-9dcd-d25dec7964af',
      '55e260bc-4aa7-44de-92e7-6bbd1edbb711'
    ]},
    'joinedUsers.0': { $exists: false }  // only delete if no one joined
  });
  console.log(`\n🗑 Cleaned up ${deleted.deletedCount} contests from completed matches`);
  console.log(`✅ Created ${created} new contests for upcoming matches!`);
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
