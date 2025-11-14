import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 mt-16 py-6 border-gray-200 border-t">
      <div className="flex md:flex-row flex-col justify-between items-center gap-3 mx-auto px-6 max-w-6xl">
        <div className="flex flex-wrap justify-center md:justify-start gap-6 font-medium text-sm">
          <Link to="/about" className="text-gray-600 hover:text-teal-600 transition-colors">
            About
          </Link>

          <Link
            to="mailto:vjm230001@utdallas.edu"
            className="text-gray-600 hover:text-teal-600 transition-colors"
          >
            Contact
          </Link>

          <Link to="/privacy" className="text-gray-600 hover:text-teal-600 transition-colors">
            Privacy Policy
          </Link>
        </div>

        <p className="text-gray-500 text-sm">
          &copy; 2025 <span className="font-semibold text-black">CircuitZone</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
