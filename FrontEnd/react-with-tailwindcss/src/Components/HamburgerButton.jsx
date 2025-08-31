import { Menu, X } from "lucide-react"; // modern SVG icons
import PropTypes from "prop-types";

const HamburgerButton = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="text-white focus:outline-none p-2 rounded-md hover:bg-gray-800 transition"
    >
      {isOpen ? (
        <X size={28} className="text-white" /> // Close icon
      ) : (
        <Menu size={28} className="text-white" /> // Hamburger icon
      )}
    </button>
  );
};

HamburgerButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default HamburgerButton;
