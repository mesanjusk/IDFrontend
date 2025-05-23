import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "/api/categories"
        );
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900">
      <section className="py-4">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-500">No products found.</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide -mx-2">
              <div className="flex gap-4 px-2 min-w-max">
                {categories.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/subcategory/${item._id}`)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && navigate(`/subcategory/${item._id}`)
                    }
                    role="button"
                    tabIndex={0}
                    className="min-w-[160px] max-w-[200px] cursor-pointer bg-white border rounded-lg p-3 shadow-sm hover:shadow-md flex-shrink-0"
                  >
                    <div className="aspect-square bg-gray-200 rounded mb-2 overflow-hidden relative">
                      {item.imageUrl?.length ? (
                        <img
                          src={item.imageUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                          alt={item.name}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
