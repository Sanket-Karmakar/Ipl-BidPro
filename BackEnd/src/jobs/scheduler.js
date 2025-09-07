import cron from 'node-cron';
import { updateMatches } from '../services/matchService.js';

(async () => {
    console.log(`Running initial match update...`);
    await updateMatches();
})();

cron.schedule('0 */4 * * *', async () => {
    console.log('Running scheduled match update...');
    await updateMatches();
});

console.log('Scheduler initialized: Matches will update every 4 hours');