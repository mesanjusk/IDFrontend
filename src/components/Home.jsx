import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [images, setImages] = useState([]);
  const [likes, setLikes] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('latest');

  const fetchImages = async () => {
    try {
      const res = await axios.get('https://idbackend-rf1u.onrender.com/api/images');
      setImages(res.data);
      const cats = ['All', ...new Set(res.data.map((img) => img.category || 'Uncategorized'))];
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await axios.get('https://idbackend-rf1u.onrender.com/api/likes');
      setLikes(res.data);
    } catch (err) {
      console.error('Error fetching likes:', err);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`https://idbackend-rf1u.onrender.com/api/like/${id}`);
      fetchLikes(); // Refresh after like
    } catch (err) {
      console.error('Error liking image:', err);
    }
  };

  const handleShare = (url) => {
    if (navigator.share) {
      navigator.share({
        title: 'Wedding Card',
        text: 'Check out this beautiful wedding card!',
        url,
      }).catch((err) => console.error('Share failed:', err));
    } else {
      navigator.clipboard.writeText(url)
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => console.error('Copy failed:', err));
    }
  };

  useEffect(() => {
    fetchImages();
    fetchLikes();
  }, []);

  const filteredImages = images
    .filter((img) => activeCategory === 'All' || img.category === activeCategory)
    .sort((a, b) => {
      if (sortOption === 'mostLiked') {
        return (likes[b._id] || 0) - (likes[a._id] || 0);
      } else if (sortOption === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  return (
    <div className="bg-pink-50 min-h-screen p-4">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-rose-200 bg-white shadow-sm mb-6">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-rose-700 font-serif">S.K. Cards</h1>
            <p className="text-sm text-gray-600">Contact: +91-9876543210</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto gap-2 py-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1 rounded-full border transition ${
                  activeCategory === cat
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-rose-600 border-rose-300 hover:bg-rose-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-rose-300 rounded-md focus:outline-none"
          >
            <option value="latest">Sort: Latest</option>
            <option value="mostLiked">Sort: Most Liked</option>
          </select>
        </div>
      </div>

      {/* Card Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredImages.length === 0 ? (
          <div className="text-center col-span-full text-gray-500 py-12">
            No cards found in this category.
          </div>
        ) : (
          filteredImages.map((img) => (
            <div
              key={img._id}
              className="bg-white border border-rose-200 rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                src={img.url}
                alt={img.title || 'Wedding Card'}
                loading="lazy"
                className="w-full h-64 object-cover pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
              <div className="p-4">
                <h2 className="text-lg font-serif text-rose-600 mb-2">{img.title || 'Wedding Card'}</h2>
                <p className="text-sm text-gray-400">
                  Uploaded on {new Date(img.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleLike(img._id)}
                    aria-label="Like this card"
                    className="text-rose-600 hover:text-rose-800 transition"
                  >
                    ❤️ {likes[img._id] || 0}
                  </button>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleShare(img.url)}
                      aria-label="Share this card"
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Share or Copy Link"
                    >
                      🔗
                    </button>
                    {img.instaUrl && (
                      <a
                        href={img.instaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View on Instagram"
                        className="text-purple-600 hover:text-purple-800 transition"
                        title="View on Instagram"
                      >
                        📸
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
