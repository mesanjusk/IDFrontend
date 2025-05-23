import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

export default function ListingPage() {
  const { itemId } = useParams();  
  const [items, setItems] = useState();
  const [loading, setLoading] = useState(true);

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

    if (itemId) {
      fetchItems();
    }
  }, [itemId]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <Header />
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Items in Subcategory</h2>

      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-left">Image</th>
              </tr>
            </thead>
           <tbody>
  {items.map((item) => (
    <tr key={item._id} className="hover:bg-gray-50">
      <td className="border px-4 py-2">{item.title}</td>
      <td className="border px-4 py-2">{item.Description || "-"}</td>
      <td className="border px-4 py-2">{item.price || "-"}</td>
      <td className="border px-4 py-2">
        {item.images && item.images.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.images.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`${item.title} ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        ) : (
          "-"
        )}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      ) : (
        <p>No items found for this subcategory.</p>
      )}
    </div>
    <Footer />
    </>
  );
}
