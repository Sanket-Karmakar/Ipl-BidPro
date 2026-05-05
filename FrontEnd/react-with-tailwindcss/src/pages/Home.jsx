import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, Gavel, Users, Zap, TrendingUp, Trophy } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0f] text-white overflow-hidden flex flex-col items-center pt-24 px-6 pb-20">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-gray-300">IPL 2026 Ready</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          The Ultimate <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 drop-shadow-lg">
            IPL Season Simulator
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p 
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          Step into the shoes of a franchise owner. Analyze player stats, build your dream team, and outsmart your friends in real-time bidding wars.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 mb-20 w-full justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
        >
          <button 
            onClick={() => navigate("/bidpro")}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_40px_-5px_rgba(79,70,229,0.7)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-2xl" />
            <Gavel className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Enter BidPro</span>
          </button>
          
          <button 
            onClick={() => navigate("/analysis")}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
          >
            <BarChart3 className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span>Analysis Pro</span>
          </button>
        </motion.div>

        {/* Features / Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Feature 1 */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 hover:border-white/10 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Deep Analytics</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Access comprehensive player statistics, recent form, and historical IPL performance to make data-driven bids.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 hover:border-white/10 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Multiplayer Lobbies</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Create custom rooms, invite your friends, and experience the thrill of a live season with real-time syncing.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 hover:border-white/10 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-7 h-7 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Leaderboards</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Track your team's performance automatically during live IPL matches and climb the global rankings.
            </p>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
};

export default Home;
