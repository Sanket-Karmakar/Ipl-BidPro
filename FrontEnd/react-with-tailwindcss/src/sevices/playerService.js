export async function fetchPlayer(playerId) {
  const res = await fetch(`/api/players/${playerId}`); // adjust base URL if needed
  if (!res.ok) {
    throw new Error("Failed to fetch player");
  }
  const json = await res.json();
  return json.data || json; // depending on whether backend wraps in { data: ... }
}
