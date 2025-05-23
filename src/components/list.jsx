import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

export default function ListingPage() {
  const { itemId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      if (!itemId) {
        setLoading(false);
        setItems([]);
        return;
      }

      try {
        const response = await axios.get(`/api/listings/${itemId}`);
        setItems([response.data]);
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [itemId]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />

      <div className="p-4 max-w-6xl mx-auto">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col lg:flex-row gap-6 bg-white p-6 rounded-lg shadow"
          >
            {/* Image Gallery */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4">
                {item.images?.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`img-${index}`}
                    className="w-full h-32 object-cover rounded cursor-pointer"
                    onClick={() => {
                      setModalImage(imgUrl);
                      setModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{item.title}</h2>
              <p className="text-gray-600 mt-2">{item.Description}</p>
              <p className="text-xl font-semibold text-pink-600 mt-4">₹{item.price}</p>

              {/* Size Selection */}
              {item.sizes && item.sizes.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Select Size:</p>
                  <div className="flex gap-2">
                    {item.sizes.map((size, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-1 border rounded-full ${
                          selectedSize === size
                            ? "bg-pink-600 text-white"
                            : "border-gray-400 text-gray-800"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <button className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
                  Add to Cart
                </button>
                <button className="border border-pink-600 text-pink-600 px-6 py-2 rounded hover:bg-pink-50">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <img
            src={modalImage}
            alt="Enlarged"
            className="max-w-3xl max-h-[90vh] rounded shadow-lg"
          />
          <button
            className="absolute top-6 right-6 text-white text-2xl"
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
