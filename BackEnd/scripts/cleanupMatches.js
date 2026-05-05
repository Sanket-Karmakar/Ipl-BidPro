import mongoose from 'mongoose';

const IPL_SERIES_ID = '87c62aac-bc3c-4738-ab93-19da0690488f';

mongoose.connect('mongodb+srv://karmakarsanket98:sanketkarmakar98@cluster0.fnvtabb.mongodb.net/ipl-bidpro').then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('matches').deleteMany({
    series_id: { $ne: IPL_SERIES_ID }
  });
  console.log(`Cleanup complete! Deleted ${result.deletedCount} non-IPL matches.`);
  process.exit(0);
}).catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
