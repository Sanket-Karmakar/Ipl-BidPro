import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/UserContext";
import {
  WalletIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  GiftIcon,
  TrophyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Wallet() {
  const { user, refreshUser } = useAuth();

  React.useEffect(() => {
    if (refreshUser) refreshUser();
  }, []);
  
  // Simulated breakdown since backend only has total virtualCash right now
  const totalBalance = user?.virtualCash || 0;
  const unutilized = Math.floor(totalBalance * 0.3);
  const winnings = Math.floor(totalBalance * 0.6);
  const cashBonus = totalBalance - unutilized - winnings;

  // Mock Transactions
  const transactions = [
    { id: 1, title: "Won Contest", match: "IND vs AUS", amount: "+ ₹ 500", date: "Oct 24, 2023", type: "credit" },
    { id: 2, title: "Joined Contest", match: "CSK vs MI", amount: "- ₹ 49", date: "Oct 22, 2023", type: "debit" },
    { id: 3, title: "Cash Added", match: "Deposit", amount: "+ ₹ 1000", date: "Oct 20, 2023", type: "credit" },
    { id: 4, title: "Joined Contest", match: "RCB vs KKR", amount: "- ₹ 99", date: "Oct 18, 2023", type: "debit" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex items-center space-x-3 mb-6">
          <WalletIcon className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-extrabold tracking-wide">My Wallet</h1>
        </div>

        {/* Total Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <WalletIcon className="w-32 h-32 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-gray-300 font-medium text-lg uppercase tracking-wider mb-2">Total Balance</p>
              <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
                ₹ {totalBalance.toLocaleString()}
              </h2>
            </div>
            
            <div className="flex w-full md:w-auto gap-4">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-green-500/30 transition-all hover:scale-105">
                <ArrowDownTrayIcon className="w-5 h-5" />
                Add Cash
              </button>
            </div>
          </div>
        </motion.div>

        {/* Balance Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-blue-300">
                <BanknotesIcon className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Unutilized</h3>
              </div>
            </div>
            <p className="text-3xl font-bold">₹ {unutilized.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Amount you added.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-green-300">
                  <TrophyIcon className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">Winnings</h3>
                </div>
              </div>
              <p className="text-3xl font-bold">₹ {winnings.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-2">You can withdraw this anytime.</p>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-semibold transition border border-white/20">
              Withdraw <ArrowRightIcon className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-pink-300">
                <GiftIcon className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Cash Bonus</h3>
              </div>
            </div>
            <p className="text-3xl font-bold">₹ {cashBonus.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Usable to join contests.</p>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Transactions</h2>
            <button className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition">View All</button>
          </div>
          
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-transparent hover:border-white/10">
                <div>
                  <h4 className="font-semibold text-lg">{tx.title}</h4>
                  <p className="text-sm text-gray-400">{tx.match} • {tx.date}</p>
                </div>
                <div className={`text-xl font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
