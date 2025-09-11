import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-black flex flex-col justify-center items-center text-center px-6">
      {/* Heading */}
      <motion.h1
        className="text-5xl font-extrabold text-yellow-400 tracking-wide"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        Welcome to IPL BidPro 🏆
      </motion.h1>

      <motion.p
        className="text-gray-300 mt-4 text-lg max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        A real-time IPL Auction Simulator. Bid with friends. Build your team. Analyze like a Pro!
      </motion.p>

      {/* Two big sections */}
      <motion.div
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {/* Analysis Pro */}
        <motion.div
          onClick={() => navigate("/analysis")}
          className="cursor-pointer bg-white/10 backdrop-blur-lg text-white rounded-2xl p-10 shadow-lg hover:scale-105 transition-transform"
          whileHover={{ rotate: 1, scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold mb-4">📊 Analysis Pro</h2>
          <p className="text-gray-300 text-lg">
            Dive deep into player stats. Search, analyze, and compare players before you make your bid.
          </p>
        </motion.div>

        {/* BidPro */}
        <motion.div
          onClick={() => navigate("/bidpro")}
          className="cursor-pointer bg-white/10 backdrop-blur-lg text-white rounded-2xl p-10 shadow-lg hover:scale-105 transition-transform"
          whileHover={{ rotate: -1, scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold mb-4">💰 BidPro</h2>
          <p className="text-gray-300 text-lg">
            Join fantasy auctions, create your dream team, and compete with friends in real time.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
