import { useEffect, useState } from 'react';
import axios from 'axios';

const categories = ['All', 'Wedding', 'Birthday', 'Vastu', 'Opening'];

export default function WeddingGallery() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalImage, setModalImage] = useState(null);

  const fetchImages = async () => {
    try {
      const res = await axios.get('https://idbackend-rf1u.onrender.com/api/images');
      setImages(res.data);
      setFilteredImages(res.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  useEffect(() => {
    fetchImages();

    // Disable right-click globally
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  return (
    <div className="bg-pink-50 min-h-screen p-6">
      <h1 className="text-5xl font-extrabold text-pink-700 text-center mb-8 font-serif">
        S.K Cards 💌
      </h1>

      {/* Filters */}
      <div className="flex justify-center gap-4 flex-wrap mb-10">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full font-medium border transition duration-300 ${
              selectedCategory === category
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white text-pink-600 border-pink-300 hover:bg-pink-100'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredImages.map((img) => (
          <div
            key={img._id}
            className="relative group bg-white border border-pink-200 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => setModalImage(img)}
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-60 object-cover pointer-events-none transition-all duration-300 group-hover:blur-sm"
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Watermark */}
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-60 px-2 py-1 text-xs text-pink-700 font-semibold rounded pointer-events-none select-none">
              © YourBrand
            </div>
            {/* Title */}
            <div className="p-3 text-center">
              <h2 className="text-pink-600 font-semibold text-lg">{img.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-4">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-pink-600 text-xl font-bold hover:text-pink-800"
            >
              ✕
            </button>
            <img
              src={modalImage.url}
              alt={modalImage.title}
              className="w-full h-auto object-contain rounded mb-4 pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
            />
            <h2 className="text-center text-2xl font-bold text-pink-700">
              {modalImage.title}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
