export function normalizePlayerStats(raw) {
  const result = { batting: {}, bowling: {} };
  if (!raw?.stats) return result;

  raw.stats.forEach(entry => {
    const matchType = entry.matchType; // e.g., "ipl"
    entry.stats.forEach(s => {
      const category = s.type.toLowerCase(); // "batting" or "bowling"
      const statKey = s.stat.trim().toLowerCase().replace(/\s+/g, "");
      const rawValue = s.value?.trim() ?? "";
      const value = isNaN(Number(rawValue)) ? rawValue : Number(rawValue);

      if (!result[category][matchType]) result[category][matchType] = {};
      result[category][matchType][statKey] = value;
    });
  });

  return result;
}
