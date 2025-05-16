import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Carousel from "./Carousel";
import Footer from "./Footer";
import Header from "./Header";

export default function App() {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState("none");
  const [banners, setBanners] = useState([]);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          "https://idbackend-rf1u.onrender.com/api/subcategories"
        );
        setSubcategories(response.data);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const fetchFavoriteListings = async () => {
      try {
        const response = await axios.get(
          "https://idbackend-rf1u.onrender.com/api/listings/favorite?favorite=1"
        );
        setFavoriteListings(response.data);
      } catch (err) {
        console.error("Error fetching favorite listings:", err);
      }
    };
    fetchFavoriteListings();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          "https://idbackend-rf1u.onrender.com/api/banners"
        );
        setBanners(response.data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchBanners();
  }, []);

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

  return (
    <div className="font-sans bg-white text-gray-900">
    <Header />
      {/* BANNER CAROUSEL */}
      <section className="bg-gray-100 py-4">
        <div className="container mx-auto">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
          >
            {banners.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-40 md:h-64 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={`banner-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CATEGORY FILTER + SORT */}
      <section className="py-4">
        <div className="container mx-auto px-4">
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

          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide px-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1 whitespace-nowrap rounded-full border ${
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
                className={`px-4 py-1 whitespace-nowrap rounded-full border ${
                  selectedCategory === cat
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {sortedListings.length === 0 ? (
            <div className="text-center text-gray-500">No products found.</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide -mx-2">
              <div className="flex gap-4 px-2 min-w-max">
                {sortedListings.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedProduct(item)}
                    className="min-w-[160px] max-w-[200px] cursor-pointer bg-white border rounded-lg p-3 shadow-sm hover:shadow-md flex-shrink-0"
                  >
                    <div className="aspect-square bg-gray-200 rounded mb-2 overflow-hidden relative">
                      {item.images?.length ? (
                        <Carousel
                          images={item.images}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      ₹{item.price || "--"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* DEALS */}
      <section className="py-6 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">
            Deals of the Day 🔥
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favoriteListings.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md"
              >
                <div className="h-32 bg-gray-200 rounded mb-2 overflow-hidden">
                  {item.images?.length ? (
                    <Carousel images={item.images} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">
                  ₹{item.price || "--"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL PICKS */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            Hot Selling Item ✨
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
            {subcategories.map((subcat, idx) => (
              <div
                key={idx}
                className="bg-purple-50 border rounded-lg p-4 text-center"
              >
                <div className="h-32 bg-purple-100 rounded mb-2 overflow-hidden">
                  {subcat.imageUrl ? (
                    <img
                      src={subcat.imageUrl}
                      alt={subcat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <p className="font-medium">{subcat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-3">{selectedProduct.title}</h3>
            {selectedProduct.images?.length > 0 ? (
              <div className="mb-4">
                <Carousel images={selectedProduct.images} />
              </div>
            ) : (
              <div className="mb-4 h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                No Image Available
              </div>
            )}
            <p className="text-gray-700">₹{selectedProduct.price}</p>
            <p className="mt-2 text-sm text-gray-500">
              {selectedProduct.description || "No description available."}
            </p>
          </div>
        </div>
      )}

     <Footer />
    </div>
  );
}
