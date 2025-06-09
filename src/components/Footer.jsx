import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Footer() {
const [config, setConfig] = useState({ name: "", email: "", phone: "", address: "" }); 

 useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("/api/confi/GetConfiList"); 
        if (response.data.success && response.data.result.length > 0) {
          setConfig(response.data.result[0]); 
        }

      } catch (error) {
        console.error("Failed to fetch configuration:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900">
      <footer className="bg-gray-800 text-gray-200 py-8 mt-6">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">{config.name}</h3>
            <p>{config.address}</p>
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
            <p>Email: {config.email}</p>
            <p>Phone: {config.phone}</p>
          </div>
        </div>
        <div className="text-center mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} {config.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
