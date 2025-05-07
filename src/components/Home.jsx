import { useState, useEffect } from "react";
import axios from "axios";

const categories = ["All", "Wedding", "Birthday", "Vastu", "Opening"];

export default function InstagramStyleGallery() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalImage, setModalImage] = useState(null);
  const [likes, setLikes] = useState({}); // Store likes for each image

  // Fetch images
  const fetchImages = async () => {
    try {
      const res = await axios.get("https://idbackend-rf1u.onrender.com/api/images");
      setImages(res.data);
      setFilteredImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  // Handle like button click
  const handleLike = (imageId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [imageId]: prevLikes[imageId] ? prevLikes[imageId] + 1 : 1,
    }));
  };

  return (
    <div className="flex flex-col h-screen">

      {/* Header - fixed */}
      <header className="bg-white shadow-md py-2 px-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-2xl text-purple-600">S.K. Cards</span>
        </div>
        <div className="flex space-x-4">
          <i className="fas fa-home text-xl cursor-pointer"></i>
          <a
            href="https://wa.me/919372333633?text=Hi%2C%20I%20would%20like%20to%20make%20an%20enquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-purple-600"
          >
            <i className="fab fa-whatsapp text-xl"></i>
          </a>
          <i className="fas fa-user-circle text-xl cursor-pointer"></i>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="mt-[60px] mb-[60px] overflow-y-auto flex-1">
        
        {/* Categories - Horizontal */}
        <div className="flex overflow-x-auto space-x-6 px-4 py-3">
          {categories.map((category) => (
            <div
              key={category}
              className="flex flex-col items-center space-y-2 cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-purple-600">{category[0]}</span>
              </div>
              <span className="text-sm text-purple-600">{category}</span>
            </div>
          ))}
        </div>

        {/* Gallery Feed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
          {filteredImages.map((img) => (
            <div key={img._id} className="bg-white rounded shadow-md cursor-pointer relative">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-auto object-cover aspect-square pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
                loading="lazy"
              />
              <p className="text-center text-purple-600 font-medium py-2">{img.title}</p>

              {/* Like Button */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={() => handleLike(img._id)}
                  className="bg-purple-600 text-white py-1 px-3 rounded-full text-sm"
                >
                  Like {likes[img._id] || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - fixed */}
      <footer className="bg-white shadow-md py-3 px-6 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around items-center text-purple-600">
          <div className="flex flex-col items-center">
            <i className="fas fa-home text-2xl"></i>
            <span className="text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-search text-2xl"></i>
            <span className="text-xs">Search</span>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-plus-circle text-2xl"></i>
            <span className="text-xs">Add</span>
          </div>
          <div className="flex flex-col items-center">
            <a
              href="https://wa.me/919372333633?text=Hi%2C%20I%20would%20like%20to%20make%20an%20enquiry"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp text-2xl"></i>
            </a>
            <span className="text-xs">Messages</span>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-user-circle text-2xl"></i>
            <span className="text-xs">Profile</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
