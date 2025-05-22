import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SpecialPicks() {
  const navigate = useNavigate();
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


  return (
    <div className="font-sans bg-white text-gray-900">

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
                onClick={() => navigate(`/list/${subcat.name}`)}
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
    </div>
  );
}
