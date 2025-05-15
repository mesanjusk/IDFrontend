import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function App() {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState("none");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(
          "https://idbackend-rf1u.onrender.com/api/listings"
        );
        setListings(response.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = selectedCategory
    ? listings.filter((l) => l.category === selectedCategory)
    : listings;

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortOption === "low") return a.price - b.price;
    if (sortOption === "high") return b.price - a.price;
    return 0;
  });

  const uniqueCategories = [...new Set(listings.map((item) => item.category))];

  // Placeholder data arrays for Deals of the Day and Special Categories
  const dealsOfTheDay = []; // empty placeholder, add later
  const specialCategories = []; // empty placeholder, add later

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-pink-600">Nykaa Clone</h1>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="hidden md:block w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <div className="text-sm text-gray-500 hidden md:block">Login / Signup</div>
        </div>
        <div className="block md:hidden px-4 pb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </header>

      {/* BANNER CAROUSEL */}
      <section className="bg-gray-100 py-4">
        <div className="container mx-auto">
          <Swiper spaceBetween={10} slidesPerView={1} loop>
            {["/banner1.jpg", "/banner2.jpg", "/banner3.jpg"].map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-40 md:h-64 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={img} alt={`banner-${idx}`} className="w-full h-full object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CATEGORY FILTER + SORT */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-3">Categories</h2>
          <div
            className="flex flex-wrap gap-2 mb-4 overflow-x-auto scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1 rounded-full border ${
                selectedCategory === null
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              All
            </button>
            {uniqueCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1 rounded-full border ${
                  selectedCategory === cat
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="none">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      <section className="py-6 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">
            Deals of the Day 🔥
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md"
                >
                  <div className="h-32 bg-gray-200 rounded mb-2" />
                  <p className="text-sm font-medium">Deal Product {i + 1}</p>
                  <p className="text-xs text-gray-500">₹XX.XX</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* SPECIAL / LIMITED CATEGORY */}
       <section className="py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            Limited Edition / Special Picks ✨
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-purple-50 border rounded-lg p-4 text-center"
                >
                  <div className="h-32 bg-purple-100 rounded mb-2" />
                  <p className="font-medium">Special {i + 1}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* PRODUCT LISTINGS */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">
            {selectedCategory || "All"} Products
          </h2>
          {sortedListings.length === 0 ? (
            <div className="text-center text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sortedListings.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedProduct(item)}
                  className="cursor-pointer bg-white border rounded-lg p-4 shadow-sm hover:shadow-md"
                >
                  <div className="h-32 bg-gray-200 rounded mb-2 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">₹{item.price || "--"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
            <button
              onClick={() => setSelectedProduct(null)}
              className="float-right text-gray-500"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-2">{selectedProduct.title}</h3>
            {selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt="Product"
                className="w-full h-64 object-cover rounded mb-3"
              />
            )}
            <p className="text-gray-700">₹{selectedProduct.price}</p>
            <p className="text-sm text-gray-500 mt-2">
              Category: {selectedProduct.category}
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-200 py-8 mt-6">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-bold mb-2">Nykaa</h4>
            <ul className="text-sm space-y-1">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">
Help</h4>
<ul className="text-sm space-y-1">
<li>FAQ</li>
<li>Shipping</li>
<li>Returns</li>
</ul>
</div>
<div>
<h4 className="font-bold mb-2">Categories</h4>
<ul className="text-sm space-y-1">
{uniqueCategories.length > 0
? uniqueCategories.map((cat, idx) => <li key={idx}>{cat}</li>)
: "No categories"}
</ul>
</div>
<div>
<h4 className="font-bold mb-2">Contact</h4>
<p className="text-sm">Email: support@nykaaclone.com</p>
<p className="text-sm">Phone: +91 1234567890</p>
</div>
</div>
<div className="mt-6 text-center text-xs text-gray-500">
© 2025 Nykaa Clone. All rights reserved.
</div>
</footer>  {/* Scrollbar hide style */}
  <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
  `}</style>
</div>
);
}