import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function BidPro() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-black text-white flex flex-col items-center px-6 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-yellow-400 tracking-wide"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        💰 Welcome to BidPro
      </motion.h1>

      <motion.p
        className="text-gray-300 mt-4 text-lg max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Join fantasy auctions, follow live matches, and create your winning team.
      </motion.p>

      {/* Navigation options inside BidPro */}
      <motion.div
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {/* Ongoing Matches */}
        <div
          onClick={() => navigate("/matches")}
          className="cursor-pointer bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-2">🏏 Matches</h2>
          <p className="text-gray-300">
            See all the live and upcoming matches and join contests.
          </p>
        </div>

        {/* My Teams */}
        <div
          onClick={() => navigate("/my-teams")}
          className="cursor-pointer bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-2">👥 My Teams</h2>
          <p className="text-gray-300">
            Manage your fantasy squads, update strategies, and track scores.
          </p>
        </div>

        {/* Wallet */}
        <div
          onClick={() => navigate("/wallet")}
          className="cursor-pointer bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-2">💳 Wallet</h2>
          <p className="text-gray-300">
            Keep track of your auction balance, deposits, and winnings.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
