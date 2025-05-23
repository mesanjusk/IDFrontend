import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

export default function FilterSubcategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [originalListings, setOriginalListings] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 8;

  // Fetch category and listings by category id
  useEffect(() => {
    setLoading(true);
    const fetchListingsByCategoryId = async () => {
      try {
        const [listingsRes, categoriesRes] = await Promise.all([
          axios.get("/api/listings"),
          axios.get("/api/categories"),
        ]);

        const listings = listingsRes.data;
        const categories = categoriesRes.data;

        const matchedCategory = categories.find((cat) => cat._id === id);
        if (!matchedCategory) {
          console.warn("No category found with ID:", id);
          setOriginalListings([]);
          setAllListings([]);
          setSelectedCategoryName("");
          setSelectedSubcategoryName("");
          setLoading(false);
          return;
        }

        const catName = matchedCategory.name?.trim().toLowerCase();
        setSelectedCategoryName(matchedCategory.name);

        const filtered = listings.filter(
          (listing) =>
            listing.category?.trim().toLowerCase() === catName
        );

        setOriginalListings(filtered);
        setAllListings(filtered);
        setSelectedSubcategoryName("");
        setLoading(false);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching listings or categories:", err);
        setLoading(false);
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

  // Filtered subcategories by search term
  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter listings by selected subcategory name
  const filterBySubcategory = (subcategoryName) => {
    if (!subcategoryName) {
      setAllListings(originalListings);
      setSelectedSubcategoryName("");
    } else {
      const filtered = originalListings.filter(
        (listing) =>
          listing.subcategory?.trim().toLowerCase() ===
          subcategoryName.trim().toLowerCase()
      );
      setAllListings(filtered);
      setSelectedSubcategoryName(subcategoryName);
    }
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination calculation
  const indexOfLast = currentPage * listingsPerPage;
  const indexOfFirst = indexOfLast - listingsPerPage;
  const currentListings = allListings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allListings.length / listingsPerPage);

  // Pagination change handler
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle listing click
  const handleClick = async (item) => {
    const subcategoryId = item._id;
    navigate(`/list/${subcategoryId}`);
  };

  // Fallback image url
  const fallbackImage = "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <>
      <Header />
      <div className="font-sans bg-white text-gray-900 min-h-screen flex flex-col">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 py-3 px-4 max-w-7xl mx-auto flex gap-1">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span>&gt;</span>
          <Link to="/categories" className="hover:underline">
            Categories
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-gray-800 truncate max-w-xs" title={selectedCategoryName}>
            {selectedCategoryName || "Category"}
          </span>
          {selectedSubcategoryName && (
            <>
              <span>&gt;</span>
              <span className="font-semibold text-gray-800 truncate max-w-xs" title={selectedSubcategoryName}>
                {selectedSubcategoryName}
              </span>
            </>
          )}
        </nav>

        <section className="py-4 flex-grow">
          <div className="container mx-auto px-4">
            {/* Search Subcategories */}
            <div className="mb-4 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search subcategories..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Subcategories */}
            <div className="overflow-x-auto scrollbar-hide -mx-2 mb-6">
              <div className="flex gap-4 px-2 min-w-max cursor-pointer">
                <div
                  onClick={() => filterBySubcategory("")}
                  className={`min-w-[160px] max-w-[200px] p-3 rounded-lg border shadow-sm flex-shrink-0 text-center ${
                    selectedSubcategoryName === ""
                      ? "bg-indigo-100 border-indigo-400 font-semibold"
                      : "bg-white border-gray-300 hover:shadow-md"
                  }`}
                >
                  All
                </div>

                {filteredSubcategories.length > 0 ? (
                  filteredSubcategories.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => filterBySubcategory(item.name)}
                      className={`min-w-[160px] max-w-[200px] cursor-pointer bg-white border rounded-lg p-3 shadow-sm flex-shrink-0 hover:shadow-md ${
                        selectedSubcategoryName === item.name
                          ? "border-indigo-500 bg-indigo-50 font-semibold"
                          : ""
                      }`}
                      title={item.name}
                    >
                      <div className="aspect-square bg-gray-200 rounded mb-2 overflow-hidden relative">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name || "Subcategory"}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => (e.target.src = fallbackImage)}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{item.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No subcategories found.</p>
                )}
              </div>
            </div>

            {/* Listings */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <svg
                  className="animate-spin h-10 w-10 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            ) : allListings.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 pb-6">
                  {currentListings.map((listing) => (
                    <div
                      key={listing._id}
                      className="border rounded-lg p-3 shadow hover:shadow-md transition cursor-pointer"
                      onClick={() => handleClick(listing)}
                      title={listing.title}
                    >
                      <img
                        src={
                          Array.isArray(listing.images) && listing.images.length > 0
                            ? listing.images[0]
                            : fallbackImage
                        }
                        alt={listing.title || "Listing"}
                        className="w-full h-40 object-cover rounded mb-2"
                        onError={(e) => (e.target.src = fallbackImage)}
                      />
                      <p className="text-sm text-center font-medium truncate">{listing.title}</p>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center space-x-2 pb-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1 rounded ${
                        page === currentPage
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center px-4">
                No listings found in “{selectedSubcategoryName || selectedCategoryName || "Selected Category"}”.
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
