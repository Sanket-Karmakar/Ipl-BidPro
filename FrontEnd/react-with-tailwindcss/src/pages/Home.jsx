import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-black flex flex-col justify-center items-center text-center px-6">
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

      <motion.div
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {["Batsmen", "Bowlers", "Players", "Results"].map((item, index) => (
          <motion.div
            key={index}
            className="bg-white/10 backdrop-blur-lg text-white rounded-xl p-6 shadow-lg hover:scale-105 transition-transform"
            whileHover={{ rotate: 2, scale: 1.05 }}
          >
            <h2 className="text-2xl font-bold">{item}</h2>
            <p className="mt-2 text-sm text-gray-200">
              {item === "Batsmen" && "Start swinging your auction bids."}
              {item === "Bowlers" && "Throw your strategy at others."}
              {item === "Players" && "Build your dream IPL squad."}
              {item === "Results" && "Win the ultimate IPL auction title!"}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        className="mt-10 bg-yellow-400 text-black px-8 py-3 rounded-full text-xl font-bold hover:scale-105 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = "/auction"}
      >
        🎯 Start Analysis
      </motion.button>
    </div>
  );
};

export default Home;
