import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ListingPage() {
  const { subcategoryName } = useParams();  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (!subcategoryName) {
    setLoading(false);
    setItems([]);
    return;
  }
      try {
        const response = await axios.get(`https://idbackend-rf1u.onrender.com/api/listings/sub?subcategory=${subcategoryName}`);
        setItems(response.data);
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (subcategoryName) {
      fetchItems();
    }
  }, [subcategoryName]);

  if (loading) return <p>Loading...</p>;

  return (
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
                    {item.images ? <img src={item.images[0]} alt={item.title} /> : "-"}
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
  );
}
