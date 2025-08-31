import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, close }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out shadow-lg z-50`}
    >
      <div className="p-6 flex flex-col space-y-4">
        <button
          onClick={close}
          className="text-gray-400 hover:text-white text-sm self-end"
        >
          Close
        </button>
        <Link to="/" onClick={close} className="hover:text-orange-400">
          Home
        </Link>
        <Link to="/profile" onClick={close} className="hover:text-orange-400">
          Profile
        </Link>
        <Link to="/login" onClick={close} className="hover:text-orange-400">
          Login
        </Link>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default Sidebar;
