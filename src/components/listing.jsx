import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart, FaRegCommentDots, FaHome, FaSearch, FaShoppingBag, FaUser, FaFacebookMessenger } from 'react-icons/fa';
import { MdOutlineVideoLibrary } from 'react-icons/md';

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://idbackend-rf1u.onrender.com/api/listings');
        setListings(response.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b shadow-sm sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold">Instagram</h1>
        <FaFacebookMessenger className="text-2xl" />
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto pb-16">
        {listings.map((listing) => (
          <div key={listing._id} className="border-b pb-4">
            <div className="p-3 font-semibold">{listing.title}</div>
            <Carousel images={listing.images} />
            <div className="px-3 mt-2 space-x-4 text-xl flex">
              <FaRegHeart />
              <FaRegCommentDots />
            </div>
            <div className="px-3 text-sm mt-1">{listing.location}</div>
            <div className="px-3 text-sm text-green-500">{listing.price} USD / night</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full max-w-sm bg-white border-t flex justify-between px-6 py-2 text-xl">
        <FaHome />
        <FaSearch />
        <MdOutlineVideoLibrary />
        <FaShoppingBag />
        <FaUser />
      </div>
    </div>
  );
};

// Carousel Component
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) nextImage();
    if (touchEnd - touchStart > 50) prevImage();
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const distance = dragStart - e.clientX;
    if (distance > 100) {
      nextImage();
      setDragging(false);
    } else if (distance < -100) {
      prevImage();
      setDragging(false);
    }
  };

  const handleMouseUp = () => setDragging(false);
  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={(e) => setTouchEnd(e.changedTouches[0].clientX) || handleTouchEnd()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img
        src={images[currentIndex]}
        alt=""
        className={`w-full h-64 object-cover ${isZoomed ? 'scale-125' : ''} transition-transform duration-300`}
        onClick={toggleZoom}
      />
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full"
        onClick={prevImage}
      >
        &#10094;
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full"
        onClick={nextImage}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Listings;
