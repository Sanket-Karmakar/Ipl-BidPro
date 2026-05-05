import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { DB_NAME } from '../src/constants.js';

async function run() {
  const uri = `${process.env.MONGODB_URL}/${DB_NAME}`;
  console.log('Connecting to:', uri);
  
  await mongoose.connect(uri);
  const User = (await import('../src/models/user.models.js')).default;
  
  const users = await User.find({}, 'username virtualCash');
  console.log('Current users before update:', users.length);
  
  const result = await User.updateMany({}, { $set: { virtualCash: 951 } });
  console.log('Updated', result.modifiedCount, 'user(s) to virtualCash: 951');
  
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
