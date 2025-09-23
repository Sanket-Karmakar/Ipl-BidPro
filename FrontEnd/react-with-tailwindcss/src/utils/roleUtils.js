// src/utils/roleUtils.js
export function categorizeRole(role = "") {
  const r = (role || "").toString().toLowerCase().trim();

  // wicket-keeper
  if (r.includes("wk") || r.includes("wicket")) return "WK";

  // SPECIFIC: "batting allrounder" should be treated as BAT
  // catch phrases: "batting allrounder", "batting all-rounder"
  if (/(batting\s*all[-\s]?round)/.test(r) || r.includes("batting allrounder")) {
    return "BAT";
  }

  // generic allrounder (non-batting specific) => AR
  if (r.includes("allround") || r.includes("all-round")) return "AR";

  // batsman / batter / starts with "bat" => BAT
  if (r === "batsman" || r === "batter" || r.startsWith("bat")) return "BAT";

  // bowlers
  if (r.includes("bowl") || r.includes("bowler")) return "BOWL";

  // fallback → treat as batter (safer for fantasy)
  return "BAT";
}

export function roleLabel(key) {
  switch (key) {
    case "WK":
      return "WICKET-KEEPERS";
    case "BAT":
      return "BATTERS";
    case "AR":
      return "ALL-ROUNDERS";
    case "BOWL":
      return "BOWLERS";
    default:
      return "PLAYERS";
  }
}
