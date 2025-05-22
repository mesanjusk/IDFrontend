import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FilterSubcategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpenList, setIsOpenList] = useState(false);
  const [subItems, setSubItems] = useState([]);
  const [sub, setSub] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');
  const [originalListings, setOriginalListings] = useState([]);



 useEffect(() => {
  const fetchListingsByCategoryId = async () => {
    try {
      const [listingsRes, categoriesRes] = await Promise.all([
        axios.get("https://idbackend-rf1u.onrender.com/api/listings"),
        axios.get("https://idbackend-rf1u.onrender.com/api/categories")
      ]);

      const listings = listingsRes.data;
      const categories = categoriesRes.data;

      const matchedCategory = categories.find(cat => cat._id === id);
      if (!matchedCategory) {
        console.warn("No category found with ID:", id);
        setOriginalListings([]); 
        setAllListings([]);
        setSelectedCategoryName('');
        return;
      }

      const catName = matchedCategory.name?.trim().toLowerCase();
      setSelectedCategoryName(matchedCategory.name); // ✅ Store for display

      const filtered = listings.filter(
        (listing) => listing.category?.trim().toLowerCase() === catName
      );
      setOriginalListings(filtered); 
      setAllListings(filtered);
    } catch (err) {
      console.error("Error fetching listings or categories:", err);
    }
  };

  if (id) {
    fetchListingsByCategoryId();
  }
}, [id]);


  // Fetch subcategories based on category ID
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("https://idbackend-rf1u.onrender.com/api/subcategories");
        const matched = response.data.filter((sub) => {
          const catId = sub.categoryId?._id || sub.categoryId?.$oid || sub.categoryId;
          return catId?.toString() === id?.toString();
        });
        setSubcategories(matched);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };
    fetchSubcategories();
  }, [id]);

 const handleClick = async (item) => {
  const subcategoryId = item._id;
  setSelectedCategory(item);
  const subcategoryName = item.subcategory;
  navigate(`/list/${subcategoryName}`);
  await fetchItems(subcategoryId);
  setIsOpenList(true);
};

const fetchItems = async (subcategoryId) => {
  try {
    const response = await axios.get(
      `https://idbackend-rf1u.onrender.com/api/listings/sub?subcategory=${subcategoryId}`
    );
    setSubItems(response.data);
  } catch (err) {
    console.error("Error fetching items:", err);
    setSubItems([]);
  }
};


  return (
    <>
      <div className="font-sans bg-white text-gray-900">
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="overflow-x-auto scrollbar-hide -mx-2">
              <div className="flex gap-4 px-2 min-w-max" onClick={() => setSelectedCategory(null)}>
                {subcategories.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
    setSelectedSubcategoryName(item.name?.trim());
   const filteredBySub = originalListings.filter(
    (listing) =>
      listing.subcategory?.trim().toLowerCase() === item.name?.trim().toLowerCase()
  );
    setAllListings(filteredBySub);
  }}
                    className="min-w-[160px] max-w-[200px] cursor-pointer bg-white border rounded-lg p-3 shadow-sm hover:shadow-md flex-shrink-0"
                  >
                    <div className="aspect-square bg-gray-200 rounded mb-2 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                          alt={item.name || "Subcategory"}
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
          </div>
        </section>
      </div>

      {allListings.length > 0 ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 pb-6">
    {allListings.map((listing) => (
      <div
        key={listing._id}
        className="border rounded-lg p-3 shadow hover:shadow-md transition cursor-pointer"
        onClick={() => handleClick(listing)}
      >
        <img
          src={Array.isArray(listing.images) ? listing.images[0] : listing.images}
          alt={listing.title || "Listing"}
          className="w-full h-40 object-cover rounded mb-2"
        />
        <p className="text-sm text-center font-medium">{listing.title}</p>
      </div>
    ))}
  </div>
) : (
 <p className="text-gray-500 text-center">
  No listings found in “{selectedCategoryName || 'Selected Category'}”.
</p>


)}


      {isOpenList && (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Items in selected Subcategory</h2>

          {subItems.length > 0 ? (
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
                  {subItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{item.title}</td>
                      <td className="border px-4 py-2">{item.Description || "-"}</td>
                      <td className="border px-4 py-2">{item.price || "-"}</td>
                      <td className="border px-4 py-2">
                        {item.images && Array.isArray(item.images) ? (
                          <img src={item.images[0]} alt={item.title} className="h-16 w-16 object-cover" />
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
      )}
    </>
  );
}
