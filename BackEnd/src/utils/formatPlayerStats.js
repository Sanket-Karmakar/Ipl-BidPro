// src/utils/formatPlayerStats.js
export function mapStatsToFormats(rawStats = []) {
  const formats = {}; // { test:{batting:{},bowling:{}}, odi:..., t20:..., ipl:... }
  for (const entry of rawStats) {
    const fmt = (entry.matchType || '').toLowerCase();
    if (!fmt) continue;
    if (!formats[fmt]) formats[fmt] = { batting: {}, bowling: {} };

    for (const item of entry.stats || []) {
      const bucket = item.type === 'bowling' ? 'bowling' : 'batting';
      const key = normalizeKey(item.stat);
      formats[fmt][bucket][key] = coerceNumber(item.value);
    }
  }
  return formats;
}

function normalizeKey(k = "") {
  const key = k.trim().toLowerCase();
  const map = {
    mat: 'matches', matches: 'matches',
    inn: 'innings', innings: 'innings',
    runs: 'runs', bf: 'ballsFaced', b: 'balls',
    hs: 'hs', avg: 'avg', sr: 'sr', '100s': 'hundreds', '50s': 'fifties',
    wkts: 'wickets', wickets: 'wickets', econ: 'econ', bbi: 'bbi', bbm: 'bbm',
    '4s': 'fours', '6s': 'sixes', '5w': 'fiveW', '10w': 'tenW',
    'no': 'notOut'
  };
  return map[key] || k;
}
function coerceNumber(v) {
  if (v == null) return v;
  if (typeof v !== 'string') return v;
  const n = Number(v);
  return Number.isNaN(n) ? v : n; // keep "1/10", convert "45.6"
}
