import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050508] text-gray-300 pt-16 pb-8 border-t border-white/10 mt-auto relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="https://i.pinimg.com/736x/96/21/49/962149f905f2598b3e71887fafb2708f.jpg"
                alt="CrickBid Logo"
                className="h-12 w-12 object-contain rounded-full border border-white/10"
              />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                CrickBid
              </h1>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              The ultimate destination for IPL fantasy sports and live season simulations. Build your dream team and compete globally.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-500 transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03.584-2 2-2h1.5V1.841c0-.124-1.028-.341-2.5-.341-3 0-5 1.836-5 5v3H8v4h2v9h4v-9z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-pink-500/20 text-gray-400 hover:text-pink-400 transition-all">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-gray-500/20 text-gray-400 hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/home" className="hover:text-yellow-400 transition-colors">Home</Link></li>
              <li><Link to="/bidpro" className="hover:text-yellow-400 transition-colors">BidPro Simulator</Link></li>
              <li><Link to="/analysis" className="hover:text-yellow-400 transition-colors">Analysis Pro</Link></li>
              <li><Link to="/matches" className="hover:text-yellow-400 transition-colors">Live Scorecard</Link></li>
            </ul>
          </div>

          {/* User Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">My Account</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/profile" className="hover:text-yellow-400 transition-colors">User Profile</Link></li>
              <li><Link to="/leaderboard" className="hover:text-yellow-400 transition-colors">Global Leaderboard</Link></li>
              <li><Link to="/settings" className="hover:text-yellow-400 transition-colors">Settings</Link></li>
              <li><Link to="/support" className="hover:text-yellow-400 transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest IPL updates and season alerts.
            </p>
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
              <div className="pl-3 pr-2 text-gray-500">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-transparent text-sm text-white px-2 py-2 outline-none placeholder-gray-600"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} CrickBid. All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
