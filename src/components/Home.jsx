import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [images, setImages] = useState([]);
  const [likes, setLikes] = useState({});

  const fetchImages = async () => {
    try {
      const res = await axios.get('https://idbackend-rf1u.onrender.com/api/images');
      setImages(res.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] + 1 : 1,
    }));
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
  }, []);

  return (
    <div className="bg-pink-50 min-h-screen p-6 select-none">
      <h1 className="text-5xl font-serif text-center text-rose-700 mb-10 tracking-wide">
        S.K. Cards 
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {images.map((img) => (
          <div
            key={img._id}
            className="bg-white border border-rose-200 rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img
              src={img.url}
              alt="Wedding Card"
              className="w-full h-64 object-cover pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-lg font-serif text-rose-600">.</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(img._id)}
                  className="text-rose-600 hover:text-rose-800 transition"
                >
                  ❤️ {likes[img._id] || 0}
                </button>
                <button
                  onClick={() => handleShare(img.url)}
                  className="text-blue-500 hover:text-blue-700 transition"
                  title="Share or Copy Link"
                >
                  🔗
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
