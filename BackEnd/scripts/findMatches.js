import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://karmakarsanket98:sanketkarmakar98@cluster0.fnvtabb.mongodb.net/ipl-bidpro').then(async () => {
  const matches = await mongoose.connection.db.collection('matches').find({
    matchEnded: true,
    series_id: '87c62aac-bc3c-4738-ab93-19da0690488f',
    scorecardData: { $ne: null }
  }).project({ matchId: 1, name: 1, teams: 1, date: 1 }).sort({ date: 1 }).limit(10).toArray();

  console.log('Completed IPL 2026 matches with scorecard data:', matches.length);
  matches.forEach(m => console.log(m.matchId, '|', m.name, '|', m.date));
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
