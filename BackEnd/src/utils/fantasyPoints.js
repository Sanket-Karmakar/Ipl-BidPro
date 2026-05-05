/**
 * Fantasy Point Rules for IPL T20 (Dream11/CrickBid style)
 * 
 * Pure utility — no DB access, no side effects.
 * Import and call calculatePlayerPoints(stats) to get a number.
 */

// ── Point Constants ──────────────────────────────────────
const POINTS = Object.freeze({
  // Batting
  RUN:              1,
  BOUNDARY_BONUS:   1,   // per 4
  SIX_BONUS:        2,   // per 6
  HALF_CENTURY:     8,
  CENTURY:          16,
  DUCK:            -2,   // 0 runs, dismissed (not not-out)

  // Bowling
  WICKET:           25,
  THREE_WICKET_HAUL: 4,
  FIVE_WICKET_HAUL:  8,
  MAIDEN_OVER:      12,

  // Fielding
  CATCH:            8,
  STUMPING:         12,
  RUN_OUT_DIRECT:   12,
  RUN_OUT_INDIRECT: 6,

  // Multipliers
  CAPTAIN_MULTIPLIER:      2,
  VICE_CAPTAIN_MULTIPLIER: 1.5,
});

/**
 * Calculate fantasy points for a single player.
 *
 * @param {Object} stats  Normalized player stats:
 *   { runs, balls, fours, sixes, isOut,
 *     wickets, maidens, overs,
 *     catches, stumpings, runOutsDirect, runOutsIndirect }
 *
 * @returns {number} Total fantasy points (before captain multiplier)
 */
export function calculatePlayerPoints(stats = {}) {
  let pts = 0;

  // ── Batting ──────────────────────────────
  const runs   = stats.runs   ?? 0;
  const fours  = stats.fours  ?? 0;
  const sixes  = stats.sixes  ?? 0;
  const isOut  = stats.isOut  ?? false;
  const balls  = stats.balls  ?? 0;

  pts += runs * POINTS.RUN;
  pts += fours * POINTS.BOUNDARY_BONUS;
  pts += sixes * POINTS.SIX_BONUS;

  if (runs >= 100)      pts += POINTS.CENTURY;
  else if (runs >= 50)  pts += POINTS.HALF_CENTURY;

  // Duck: dismissed for 0 (must have faced at least 1 ball)
  if (runs === 0 && isOut && balls > 0) pts += POINTS.DUCK;

  // ── Bowling ──────────────────────────────
  const wickets = stats.wickets ?? 0;
  const maidens = stats.maidens ?? 0;

  pts += wickets * POINTS.WICKET;
  pts += maidens * POINTS.MAIDEN_OVER;

  if (wickets >= 5)      pts += POINTS.FIVE_WICKET_HAUL;
  else if (wickets >= 3) pts += POINTS.THREE_WICKET_HAUL;

  // ── Fielding ─────────────────────────────
  pts += (stats.catches         ?? 0) * POINTS.CATCH;
  pts += (stats.stumpings       ?? 0) * POINTS.STUMPING;
  pts += (stats.runOutsDirect   ?? 0) * POINTS.RUN_OUT_DIRECT;
  pts += (stats.runOutsIndirect ?? 0) * POINTS.RUN_OUT_INDIRECT;

  return pts;
}

/**
 * Apply captain / vice-captain multiplier.
 */
export function applyMultiplier(points, { isCaptain, isViceCaptain } = {}) {
  if (isCaptain)     return Math.round(points * POINTS.CAPTAIN_MULTIPLIER);
  if (isViceCaptain) return Math.round(points * POINTS.VICE_CAPTAIN_MULTIPLIER);
  return points;
}

export { POINTS };
