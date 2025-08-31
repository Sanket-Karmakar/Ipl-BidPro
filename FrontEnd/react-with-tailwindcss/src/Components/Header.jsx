import { Link, useLocation } from "react-router-dom";
import HamburgerButton from "./HamburgerButton";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }
  return (
    <>
      <header className="w-full bg-black px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <HamburgerButton isOpen={isOpen} toggle={toggle} />
          <img
            src="https://i.pinimg.com/736x/96/21/49/962149f905f2598b3e71887fafb2708f.jpg"
            alt="CrickBid Logo"
            className="h-10 w-10 object-contain rounded-full"
          />
          <h1 className="text-2xl font-bold text-white">CrickBid</h1>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-gray-300 text-lg hidden sm:block">
            Not a Member Yet?{" "}
            <Link
              to="/signup"
              className="text-orange-400 font-semibold"
            >
              Register Now
            </Link>
          </p>

          <Link
            to="/login"
            className="px-5 py-2 bg-white text-black rounded-full font-medium shadow-md hover:bg-gray-100 transition"
          >
            Log In
          </Link>
        </div>
      </header>
      <Sidebar isOpen={isOpen} close={close} />
    </>
  );
};

export default Header;
