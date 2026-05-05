// src/pages/Analysis.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react"; // icon

const Analysis = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Debounced search for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/players/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setSuggestions(data.data || []);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [query]);

  const handleSuggestionClick = (name) => {
    setQuery(name);
    setShowSuggestions(false);
    // Navigate directly to the player profile page using name-based URL
    navigate(`/player/${encodeURIComponent(name)}`);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!query.trim()) return;
    fetchPlayerStats(query);
  };

  const fetchPlayerStats = async (playerName) => {

  setLoading(true);
  setError("");

  try {
    const res = await fetch(
      `/api/players/fetch-stats?name=${encodeURIComponent(playerName)}`
    );
    const data = await res.json();

    if (!res.ok || !data || data.error) {
      setError("⚠️ Player not found. Try another name.");
      return;
    }

    const player = data.data; // backend wraps inside { data: player }
if (!player?.playerId) {
  setError("⚠️ No playerId returned from server.");
  return;
}

navigate(`/player/${encodeURIComponent(player.name)}`)
  } catch (err) {
    console.error("Error fetching player:", err);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center px-6 py-16">
      {/* Title */}
      <motion.h1
        className="text-4xl font-extrabold text-yellow-400 mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        Browse Player Stats 🏏
      </motion.h1>

      {/* Search Container */}
      <div className="relative w-full max-w-xl">
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full bg-white rounded-full shadow-lg overflow-hidden relative z-20"
        >
          <input
            type="text"
            placeholder="Search player by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow clicks
            className="flex-1 px-4 py-3 text-gray-700 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-black px-6 py-3 flex items-center gap-2 font-bold hover:bg-yellow-500 transition"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-2xl overflow-hidden z-10 border border-gray-100"
            >
              {loadingSuggestions ? (
                <div className="p-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Fetching suggestions...
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {suggestions.map((player) => (
                    <li
                      key={player.id}
                      onClick={() => handleSuggestionClick(player.name)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition border-b border-gray-50 last:border-0"
                    >
                      <span className="font-semibold text-gray-800">{player.name}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{player.country || 'Unknown'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">No matches found.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-6 text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Analysis;
