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

<<<<<<< HEAD
console.log('Scheduler initialized: Matches will update every 4 hours');
=======
console.log('Scheduler initialized: Matches will update every 4 hours');

>>>>>>> 220e5f4d48593a812bc7f2e44f66c816b4ef1d6b
