// src/pages/Analysis.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react"; // icon

const Analysis = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
  e.preventDefault();
  if (!query.trim()) return;

  setLoading(true);
  setError("");

  try {
    const res = await fetch(
      `http://localhost:5001/api/players/fetch-stats?name=${encodeURIComponent(query)}`
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

navigate(`/player/${player.playerId}`)
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

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full max-w-xl bg-white rounded-full shadow-lg overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search player by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 text-gray-700 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-black px-6 py-3 flex items-center gap-2 font-bold hover:bg-yellow-500 transition"
        >
          <Search size={18} />
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="mt-6 text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Analysis;
