import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Logo + Name */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <img
            src="https://i.pinimg.com/736x/96/21/49/962149f905f2598b3e71887fafb2708f.jpg"
            alt="CrickBid Logo"
            className="h-10 w-10 object-contain rounded-full"
          />
          <h1 className="text-xl font-bold text-yellow-400">CrickBid</h1>
        </div>

        {/* Quick Links */}
        <div className="flex space-x-6 text-sm font-medium">
          <Link to="/bidpro" className="hover:text-yellow-400">BidPro</Link>
          <Link to="/matches" className="hover:text-yellow-400">Matches</Link>
          <Link to="/profile" className="hover:text-yellow-400">Profile</Link>
          <Link to="/analysis" className="hover:text-yellow-400">Analysis Pro</Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400 mt-4 md:mt-0">
          © {new Date().getFullYear()} CrickBid. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
