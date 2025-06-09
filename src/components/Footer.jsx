import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="font-sans bg-white text-gray-900">
      <footer className="bg-gray-800 text-gray-200 py-8 mt-6">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <address className="not-italic">
            <h3 className="font-semibold mb-2">{config.name || "Loading..."}</h3>
            <p>{config.address || "Address not available"}</p>
          </address>

          <nav>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul>
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/allCategories" className="hover:underline">Categories</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <p>
              Email: <a href={`mailto:${config.email}`} className="hover:underline">{config.email || 'N/A'}</a>
            </p>
            <p>
              Phone: <a href={`tel:${config.phone}`} className="hover:underline">{config.phone || 'N/A'}</a>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-400">
          © {year} {config.name || 'Sanju SK Digital'}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
