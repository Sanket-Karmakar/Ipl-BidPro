import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Wallet, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'wallet', label: 'Wallet & Billing', icon: Wallet },
  ];

  const handleLogout = () => {
    // Assuming logout is available in useAuth
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 py-12 px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 pl-4">Settings</h2>
            
            <nav className="space-y-2 mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl min-h-[600px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Account Tab Content */}
              {activeTab === 'account' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Account Profile</h3>
                    <p className="text-gray-400">Manage your personal information and how it appears to others.</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-medium transition-colors mb-2">
                        Change Avatar
                      </button>
                      <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Username</label>
                      <input 
                        type="text" 
                        defaultValue={user?.username || ''} 
                        placeholder="player_one"
                        className="w-full bg-[#0f0f16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email || ''} 
                        placeholder="user@example.com"
                        className="w-full bg-[#0f0f16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-400">Bio</label>
                      <textarea 
                        rows="3"
                        placeholder="Tell the world about your fantasy cricket skills..."
                        className="w-full bg-[#0f0f16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab Content */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Notifications</h3>
                    <p className="text-gray-400">Control what alerts you receive and how you receive them.</p>
                  </div>

                  <div className="space-y-6">
                    {[
                      { title: 'Match Starting Alerts', desc: 'Get notified 30 mins before a match starts' },
                      { title: 'Outbid Notifications', desc: 'Receive an alert when someone outbids you in live auction' },
                      { title: 'Leaderboard Updates', desc: 'Weekly summary of your global ranking' },
                      { title: 'Promotional Offers', desc: 'News about new features and special events' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <div>
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {['security', 'preferences', 'wallet'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                  <p className="text-gray-400 max-w-md">
                    We're actively building the {activeTab} settings panel. Check back later for updates!
                  </p>
                </div>
              )}

            </motion.div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Settings;
