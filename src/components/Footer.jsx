import React from "react";
import { Instagram, Linkedin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../assets/images/GetItOnPlayStore.png";
import img2 from "../assets/images/GetItOnAppStore.png";
import logo from "../assets/images/logo.svg";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-100 text-gray-700 py-8 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2"
          >
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <span className="text-teal-600 font font-bebas text-5xl pt-1.5 ">
              SPORTOMIC
            </span>
          </button>
          <div className="flex space-x-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.sportomic.user&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={img1} className="h-12" alt="Play Store" />
            </a>
            <a
              href="https://apps.apple.com/in/app/sportomic/id6596766098"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={img2} className="h-12" alt="App Store" />
            </a>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center space-y-3 text-center md:text-left">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <Link to="/" className="hover:text-teal-600">
            Events
          </Link>
          <Link to="/contact" className="hover:text-teal-600">
            Contact Us
          </Link>
          <Link to="/about" className="hover:text-teal-600">
            About Us
          </Link>
          <Link to="/privacy" className="hover:text-teal-600">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-teal-600">
            Terms & Conditions
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-end space-y-3">
          <h3 className="text-lg font-semibold">Connect with Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/go.sportomic/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600"
            >
              <Instagram size={28} />
            </a>
            <a
              href="https://www.linkedin.com/company/sportomic/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              <Linkedin size={28} />
            </a>
          </div>
          <p className="text-sm">For Corporate Queries: +91 7899152424</p>
          <a
            href="https://docs.google.com/your-form-link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            Contact Form
          </a>
          <p className="text-sm">help@sportomic.com</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-6 border-t border-gray-300 pt-4">
        <p className="text-sm text-gray-500">
          © 2024 Bluejersey18 Technologies Private Limited. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
