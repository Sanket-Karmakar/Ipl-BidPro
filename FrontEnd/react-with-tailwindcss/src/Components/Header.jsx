import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src="https://i.pinimg.com/736x/96/21/49/962149f905f2598b3e71887fafb2708f.jpg"
          alt="CrickBid Logo"
          className="h-10 w-10 object-contain"
        />
        <h1 className="text-2xl font-bold text-gray-800">CrickBid</h1>
      </div>

      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;
