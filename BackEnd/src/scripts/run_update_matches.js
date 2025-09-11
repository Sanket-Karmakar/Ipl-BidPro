// BackEnd/src/scripts/run_update_matches.js
// Usage (from BackEnd/src/scripts): node run_update_matches.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Try a few paths for the .env file (prefer BackEnd/.env)
const tryEnvPaths = [
  path.resolve(process.cwd(), '../../.env'), // BackEnd/.env
  path.resolve(process.cwd(), '../.env'),   // BackEnd/src/.env
  path.resolve(process.cwd(), '.env'),      // BackEnd/src/scripts/.env
];

let loaded = false;
for (const p of tryEnvPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log('[run_update_matches] Loaded .env from:', p);
    loaded = true;
    break;
  }
}
if (!loaded) {
  console.log('[run_update_matches] No .env found in expected locations. Continuing with existing environment variables.');
}

// import the service using a correct relative path from this script
import { updateMatches } from '../services/matchService.js';

(async () => {
  try {
    console.log('[run_update_matches] Starting updateMatches() ...');
    await updateMatches();
    console.log('[run_update_matches] updateMatches() completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[run_update_matches] updateMatches() failed:', err);
    process.exit(1);
  }
})();
