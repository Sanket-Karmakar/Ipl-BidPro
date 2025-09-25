// src/utils/roleUtils.js
export const normalizeRole = (role) => {
  const r = (role || "").toString().toLowerCase();

  // PRIORITY: detect all-rounder first (because "Batting Allrounder" contains "bat")
  if (r.includes("all") || r.includes("allround") || r.includes("all-round") || r.includes("all round") || r.includes("allrounder") || r === "ar") {
    return "All-Rounder";
  }

  if (r.includes("wk") || r.includes("wicket")) return "Wicket-Keeper";
  if (r.includes("bat") && !r.includes("all")) return "Batsman";
  if (r.includes("bowl")) return "Bowler";

  // fallback
  return "Batsman";
};

export const categorizeRole = (role) => {
  const r = (role || "").toString().toLowerCase();
  if (r.includes("wk") || r.includes("wicket")) return "WK";
  if (r.includes("all") || r.includes("allround") || r.includes("ar")) return "AR";
  if (r.includes("bat") && !r.includes("all")) return "BAT";
  if (r.includes("bowl")) return "BOWL";
  return "BAT";
};

export const roleLabel = (key) => {
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
};
