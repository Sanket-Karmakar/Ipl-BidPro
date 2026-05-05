import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Medal, Award, User, Search } from 'lucide-react';

const mockLeaderboard = [
  { id: 1, rank: 1, username: 'sachin_god', points: 15420, matches: 45, winRate: '78%', trend: 'up', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, rank: 2, username: 'msd_finisher', points: 14890, matches: 42, winRate: '74%', trend: 'up', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, rank: 3, username: 'vk_king', points: 14200, matches: 40, winRate: '70%', trend: 'down', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, rank: 4, username: 'hitman_ro', points: 13950, matches: 44, winRate: '68%', trend: 'up', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, rank: 5, username: 'boom_boom', points: 13100, matches: 38, winRate: '65%', trend: 'down', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 6, rank: 6, username: 'sir_jadeja', points: 12800, matches: 39, winRate: '64%', trend: 'up', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 7, rank: 7, username: 'sky_360', points: 12550, matches: 35, winRate: '66%', trend: 'up', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 8, rank: 8, username: 'gill_prince', points: 12100, matches: 30, winRate: '60%', trend: 'down', avatar: 'https://i.pravatar.cc/150?u=8' },
  { id: 9, rank: 9, username: 'rashid_magic', points: 11800, matches: 41, winRate: '58%', trend: 'up', avatar: 'https://i.pravatar.cc/150?u=9' },
  { id: 10, rank: 10, username: 'pant_smash', points: 11500, matches: 36, winRate: '55%', trend: 'down', avatar: 'https://i.pravatar.cc/150?u=10' },
];

const PodiumCard = ({ user, position }) => {
  const isFirst = position === 1;
  const height = isFirst ? 'h-64' : position === 2 ? 'h-52' : 'h-44';
  const colors = isFirst 
    ? 'from-yellow-400 via-yellow-500 to-yellow-600' 
    : position === 2 
      ? 'from-gray-300 via-gray-400 to-gray-500' 
      : 'from-amber-600 via-amber-700 to-amber-800';
      
  const Icon = isFirst ? Trophy : position === 2 ? Medal : Award;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.2, type: 'spring' }}
      className={`flex flex-col items-center justify-end ${position === 1 ? 'order-2 z-10' : position === 2 ? 'order-1' : 'order-3'} w-1/3 max-w-[160px]`}
    >
      <div className="relative mb-4">
        <div className={`absolute -top-6 -right-4 w-10 h-10 rounded-full bg-gradient-to-br ${colors} flex items-center justify-center border-4 border-[#0a0a0f] shadow-lg z-20`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <img src={user.avatar} alt={user.username} className={`rounded-full object-cover border-4 ${isFirst ? 'w-24 h-24 border-yellow-400' : 'w-20 h-20 border-gray-400'} shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]`} />
      </div>
      <h3 className="text-white font-bold text-center truncate w-full px-2">{user.username}</h3>
      <p className="text-indigo-400 font-bold mb-4">{user.points.toLocaleString()} pts</p>
      <div className={`w-full ${height} bg-gradient-to-t ${colors} rounded-t-2xl opacity-80 backdrop-blur-md relative overflow-hidden flex justify-center pt-6`}>
        <div className="absolute inset-0 bg-white/10"></div>
        <span className="text-4xl font-black text-white/40">{position}</span>
      </div>
    </motion.div>
  );
};

const GlobalLeaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLeaderboard = mockLeaderboard.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = mockLeaderboard.slice(0, 3);
  const remaining = filteredLeaderboard.filter(user => user.rank > 3);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 py-12 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-yellow-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 drop-shadow-lg mb-4 flex items-center justify-center gap-4">
            <Trophy className="w-10 h-10 text-yellow-400" />
            Global Hall of Fame
          </h1>
          <p className="text-gray-400 text-lg">Compete with the best fantasy managers around the world.</p>
        </motion.div>

        {/* Top 3 Podium */}
        {!searchTerm && (
          <div className="flex justify-center items-end gap-2 md:gap-6 w-full max-w-2xl mt-8 mb-16">
            <PodiumCard user={top3[1]} position={2} />
            <PodiumCard user={top3[0]} position={1} />
            <PodiumCard user={top3[2]} position={3} />
          </div>
        )}

        {/* Search & List */}
        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-white">Global Rankings</h2>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search managers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0f0f16] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-4 pl-4 font-semibold">Rank</th>
                  <th className="pb-4 font-semibold">Manager</th>
                  <th className="pb-4 font-semibold">Matches</th>
                  <th className="pb-4 font-semibold">Win Rate</th>
                  <th className="pb-4 pr-4 font-semibold text-right">Total Points</th>
                </tr>
              </thead>
              <tbody>
                {remaining.map((user, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={user.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 pl-4">
                      <span className="text-gray-400 font-bold w-6 inline-block">#{user.rank}</span>
                      {user.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400 inline ml-2" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400 inline ml-2" />
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full border border-white/20" />
                        <span className="font-medium text-white group-hover:text-indigo-400 transition-colors">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-300">{user.matches}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">{user.winRate}</span>
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: user.winRate }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right font-bold text-indigo-300">
                      {user.points.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
                {filteredLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      No managers found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLeaderboard;
