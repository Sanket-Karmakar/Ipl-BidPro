import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Mail, BookOpen, ChevronDown, LifeBuoy, FileText } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      { q: "How do I create a fantasy team?", a: "Navigate to the Matches section, select an upcoming IPL match, and click 'Create Team'. You'll have 100 credits to select your 11 players." },
      { q: "What is the BidPro Simulator?", a: "BidPro is our real-time auction simulator where you can create custom rooms, invite friends, and bid on IPL players using a virtual purse, just like the real IPL auction." },
    ]
  },
  {
    category: 'Scoring & Points',
    questions: [
      { q: "How are points calculated?", a: "Points are awarded based on real-time IPL match performances. Runs, wickets, catches, and strike rates all contribute. Check the 'Analysis Pro' section for a detailed breakdown." },
      { q: "When is the leaderboard updated?", a: "The global and contest leaderboards are updated dynamically every few minutes during live matches." },
    ]
  },
  {
    category: 'Account & Billing',
    questions: [
      { q: "How do I add virtual cash to my wallet?", a: "Currently, virtual cash is granted upon signup and daily logins. In the future, you'll be able to purchase additional credits in the Wallet section." },
      { q: "Can I change my username?", a: "Yes, you can update your username once every 30 days in the Settings > Account Profile section." },
    ]
  }
];

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 py-12 px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <LifeBuoy className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium text-gray-300">Help & Support</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            How can we help you?
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search for articles, guides, and FAQs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl pl-12 pr-6 py-5 text-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xl"
            />
          </motion.div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Getting Started Guide</h3>
            <p className="text-sm text-gray-400">Learn the basics of bidding, creating teams, and scoring points.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Rules & Scoring</h3>
            <p className="text-sm text-gray-400">Detailed breakdown of how player actions translate to fantasy points.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Community Forums</h3>
            <p className="text-sm text-gray-400">Discuss strategies, report bugs, and chat with other managers.</p>
          </motion.div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="text-lg font-semibold text-indigo-400 mb-4 uppercase tracking-wider text-sm">{category.category}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const globalIndex = `${catIndex}-${index}`;
                    const isOpen = activeAccordion === globalIndex;
                    
                    return (
                      <div key={index} className="border border-white/10 rounded-xl overflow-hidden bg-[#0f0f16]">
                        <button 
                          onClick={() => toggleAccordion(globalIndex)}
                          className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-white/5 transition-colors"
                        >
                          <span className="font-medium text-white">{faq.q}</span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-5 pb-5 text-gray-400 text-sm leading-relaxed"
                            >
                              {faq.a}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Still need help?</h2>
            <p className="text-indigo-200">Our support team is available 24/7 to assist you with any issues.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-xl transition-all">
              <Mail className="w-5 h-5" />
              Email Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
