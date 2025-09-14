import cron from 'node-cron';
import { updateMatches } from '../services/matchService.js';

let isRunning = false;

(async () => {
    try {
        console.log(`Running initial match update...`);
        if (!isRunning) {
            isRunning = true;
            await updateMatches();
            isRunning = false;
        }
    } catch (e) {
        console.error('Initial update failed:', e);
        isRunning = false;
    }
})();

// schedule every 30 minutes; guard against overlap with isRunning flag
cron.schedule('*/30 * * * *', async () => {
    if (isRunning) {
        console.log('Previous scheduled update still running — skipping this tick.');
        return;
    }
    try {
        console.log('Running scheduled match update...');
        isRunning = true;
        await updateMatches();
    } catch (err) {
        console.error('Scheduled update error:', err);
    } finally {
        isRunning = false;
    }
});

<<<<<<< HEAD
console.log('Scheduler initialized: Matches will update every 30 minutes');
=======
console.log('Scheduler initialized: Matches will update every 30 minutes');
>>>>>>> 9e219e03b845538a299dbfffb9978743f44048e8
