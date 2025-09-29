// components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-6 border-t border-gray-800">
      <p className="text-sm">
        © {new Date().getFullYear()} Your Liquor Store. All rights reserved.
      </p>
      <p className="text-xs mt-2">
        Drink responsibly. Alcohol consumption is only for individuals 21+ (or the legal age in your country).
      </p>
    </footer>
  );
}

export default Footer;
