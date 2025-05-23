import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

export default function FilterSubcategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subItems, setSubItems] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');
  const [originalListings, setOriginalListings] = useState([]);

  useEffect(() => {
    const fetchListingsByCategoryId = async () => {
      try {
        const [listingsRes, categoriesRes] = await Promise.all([
          axios.get("/api/listings"),
          axios.get("/api/categories")
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
        setSelectedCategoryName(matchedCategory.name); // Store for display

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
        const response = await axios.get("/api/subcategories");
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
    navigate(`/list/${subcategoryId}`);
    await fetchItems(subcategoryId);
  };

  const fetchItems = async (subcategoryId) => {
    try {
      const response = await axios.get(
        `/api/listings/sub?subcategory=${subcategoryId}`
      );
      setSubItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setSubItems([]);
    }
  };

  return (
    <>
      <Header />
      <div className="font-sans bg-white text-gray-900">
        {/* Subcategory Carousel */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-6 min-w-max">
                {subcategories.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      setSelectedSubcategoryName(item.name?.trim());
                      const filteredBySub = originalListings.filter(
                        (listing) =>
                          listing.subcategory?.trim().toLowerCase() ===
                          item.name?.trim().toLowerCase()
                      );
                      setAllListings(filteredBySub);
                    }}
                    className="flex flex-col items-center cursor-pointer focus:outline-none"
                    aria-label={`Filter by ${item.name}`}
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 hover:border-indigo-500 transition">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name || "Subcategory"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium truncate max-w-[96px] text-center">
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Listings Grid */}
        {allListings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-4 pb-6">
            {allListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 shadow hover:shadow-md transition cursor-pointer"
                onClick={() => handleClick(listing)}
              >
                <div className="w-full aspect-square overflow-hidden rounded mb-2">
                  <img
                    src={
                      Array.isArray(listing.images)
                        ? listing.images[0]
                        : listing.images
                    }
                    alt={listing.title || "Listing"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-center font-medium truncate">{listing.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center px-4">
            No listings found in “{selectedCategoryName || "Selected Category"}”.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
}
