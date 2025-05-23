import React, { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom"; // Optional for routing
import axios from "axios"; // ✅ Needed to fetch data

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [config, setConfig] = useState({ name: "", logo: "" }); 

  const navItems = [
    {
      label: "Products",
      submenu: ["New Arrivals", "Best Sellers", "Discounted"],
    },
    {
      label: "Services",
      submenu: ["Design", "Development", "Support"],
    },
    {
      label: "About",
      submenu: ["Our Story", "Team", "Careers"],
    },
    {
      label: "Contact",
      submenu: ["Email Us", "Location", "Help Center"],
    },
  ];

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
    <header className="bg-white shadow-md w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-blue-600 text-2xl font-bold">
         
            <img src={config.logo} alt="Logo" className="w-8 h-8 object-contain" />
        
          <Link to="/">{config.name}</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <div key={index} className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === index ? null : index)
                }
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                {item.label}
              </button>
              {openDropdown === index && (
                <div className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg z-10 w-44">
                  {item.submenu.map((subItem, subIdx) => (
                    <div
                      key={subIdx}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    >
                      {subItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search & Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, services..."
              className="border border-gray-300 rounded-full px-5 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FiSearch className="absolute right-4 top-2.5 text-gray-500" />
          </div>

          {/* Cart Icon */}
          <button className="relative text-gray-700 hover:text-blue-600 text-xl">
            <FiShoppingCart />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              2
            </span>
          </button>

          {/* Account Icon */}
          <button className="text-gray-700 hover:text-blue-600 text-xl">
            <FiUser />
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 shadow-md">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {navItems.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="font-semibold text-gray-800">{item.label}</div>
              <div className="pl-4 text-gray-600 text-sm space-y-1">
                {item.submenu.map((subItem, idx) => (
                  <div key={idx} className="hover:text-blue-600 cursor-pointer">
                    {subItem}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
