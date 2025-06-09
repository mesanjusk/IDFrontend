import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCart } from '../context/CartContext';

const Category = lazy(() => import("../components/Category"));
const Content = lazy(() => import("../components/Content"));
const GalleryModal = lazy(() => import("../components/GalleryModal"));

const Home = () => {
  const [listings, setListings] = useState([]);
  const [savedPosts, setSavedPosts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/listings');
        setListings(response.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedPosts');
      if (saved) setSavedPosts(JSON.parse(saved));
    } catch {
      console.warn("Malformed savedPosts in localStorage.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  const filteredListings = useMemo(() => {
    let filtered = listings.filter((item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    switch (sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return filtered;
    }
  }, [listings, searchTerm, sortBy, selectedCategory]);

  // Disable right-click for security
  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white px-4 py-6">
      <Helmet>
        <title>Wedding Cards – Sanju SK Digital</title>
        <meta name="description" content="Order premium wedding cards online with customization at Sanju SK Digital Gondia." />
      </Helmet>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-pink-700 drop-shadow-sm">Custom Wedding Cards</h1>
        <p className="text-gray-600 mt-1">Browse, customize & order online</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search wedding cards..."
          className="border rounded px-4 py-2 w-full sm:w-1/2 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded px-4 py-2 shadow-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price (Low → High)</option>
          <option value="price-desc">Price (High → Low)</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {loading ? (
        <Skeleton height={40} count={4} />
      ) : error ? (
        <div className="text-center text-red-600 mt-10">{error}</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No cards found.</div>
      ) : (
        <>
          <Suspense fallback={<Skeleton height={40} />}>
            <Category
              uniqueCategories={[...new Set(listings.map((item) => item.category))]}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Suspense>

          <Suspense fallback={<Skeleton count={4} height={180} />}>
            <Content
              listings={filteredListings}
              savedPosts={savedPosts}
              setSavedPosts={setSavedPosts}
              onAddToCart={addToCart}
              onPreview={setOpenImageModal}
            />
          </Suspense>

          {openImageModal && (
            <Suspense fallback={<div>Loading Preview...</div>}>
              <GalleryModal images={openImageModal} onClose={() => setOpenImageModal(null)} />
            </Suspense>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
