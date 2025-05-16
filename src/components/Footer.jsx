import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Footer() {

  return (
    <div className="font-sans bg-white text-gray-900">
      <footer className="bg-gray-800 text-gray-200 py-8 mt-6">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">SK Cards</h3>
            <p>Premium digital and print ID card solutions.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul>
              <li>Home</li>
              <li>Categories</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <p>Email: support@skcards.com</p>
            <p>Phone: +91 99999 99999</p>
          </div>
        </div>
        <div className="text-center mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} SK Cards. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
