import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from "./Carousel";


export default function FavoriteDeal() {
   const navigate = useNavigate();
  const [favoriteListings, setFavoriteListings] = useState([]);


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

  const handleClick = async (item) => {
  const subcategoryName = item.subcategory;
  navigate(`/list/${subcategoryName}`);
};

  return (
    <div className="font-sans bg-white text-gray-900">

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
                onClick={() => navigate(`/list/${item.subcategory}`)}
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
    </div>
  );
}
