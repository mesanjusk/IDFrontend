import React, { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import api from '../api';
import Header from "./Header";
import Footer from "./Footer";
import SocialMedia from "./SocialMedia";

export default function ListingPage() {
  const { itemId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      if (!itemId) {
        setLoading(false);
        setItems([]);
        return;
      }

      try {
        const response = await api.get(`/api/listings/${itemId}`);
        setItems([response.data]);
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(response.data.images[0]);
        } else {
          setSelectedImage("");
        }

        // Reset quantity to MOQ on new item load
        setQuantity(response.data.moq ?? 1);
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [itemId]);

  // Handlers for quantity change
  const increaseQuantity = (moq) => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = (moq) => {
    setQuantity((prev) => (prev > moq ? prev - 1 : prev));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />

      <div className="p-4 max-w-6xl mx-auto">
        {items.map((item) => {
          const discountPrice =
            item.discountPrice !== undefined && item.discountPrice < item.price
              ? item.discountPrice
              : null;

          const moq = item.moq !== undefined ? item.moq : 1;

          return (
            <div
              key={item._id}
              className="flex flex-col lg:flex-row gap-6 bg-white p-6 rounded-lg shadow"
            >
              {/* Left side: Fixed Image View + Thumbnails */}
              <div className="flex-1 flex flex-col gap-4">
                <div
                  className="w-full h-[400px] border rounded overflow-hidden flex items-center justify-center bg-gray-100"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="max-h-full max-w-full object-contain"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ) : (
                    <p className="text-gray-400">No image available</p>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {item.images?.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Thumbnail-${index}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        selectedImage === imgUrl
                          ? "border-pink-600"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(imgUrl)}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ))}
                </div>
              </div>

              {/* Right side: Product Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{item.title}</h2>

                <p className="text-gray-600 mt-2">
                  {item.Description ||
                    "No description available. Please update this text."}
                </p>

                {/* Pricing with tooltip */}
                <div className="mt-4 flex items-center gap-4">
                  <p
                    className="text-xl font-semibold text-pink-600 relative group cursor-default"
                    title={
                      discountPrice
                        ? `Original price ₹${item.price}`
                        : `Price ₹${item.price}`
                    }
                  >
                    ₹{discountPrice ?? item.price ?? "0"}
                    {discountPrice && (
                      <span className="ml-2 text-sm line-through text-gray-500">
                        ₹{item.price}
                      </span>
                    )}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <Footer />
      <SocialMedia />
    </>
  );
}
