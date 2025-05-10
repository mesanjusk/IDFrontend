import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaRegHeart,
  FaRegCommentDots,
  FaHome,
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaFacebookMessenger,
} from 'react-icons/fa';
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
        <h1 className="text-xl font-bold">S.K.Cards</h1>
        <FaFacebookMessenger className="text-2xl" />
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto pb-16">
        {listings.map((listing) => (
          <div key={listing._id} className="border-b pb-4">
            {/* Post Header */}
            <div className="flex items-center p-3 space-x-3">
              <img
                src={listing.images[0]}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-semibold">{listing.title}</span>
            </div>

            {/* Image Carousel */}
            <Carousel images={listing.images} />

            {/* Post Actions */}
            <div className="px-3 mt-2 space-x-4 text-xl flex">
  <FaRegHeart />
  <FaRegCommentDots />
  <FaShare
    className="cursor-pointer"
    onClick={() => {
      if (navigator.share) {
        navigator.share({
          title: listing.title,
          text: listing.location,
          url: window.location.href,
        }).catch((err) => console.error('Share failed:', err));
      } else {
        alert('Sharing not supported in this browser');
      }
    }}
  />
</div>

            {/* Details */}
            <div className="px-3 text-sm mt-1">{listing.location}</div>
            <div className="px-3 text-sm text-green-500">{listing.price} ₹ </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
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

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

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
      className="relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={(e) => setTouchEnd(e.changedTouches[0].clientX) || handleTouchEnd()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img
        src={images[currentIndex]}
        alt=""
        className={`w-full aspect-square object-cover transition-transform duration-300 ${
          isZoomed ? 'scale-125' : ''
        }`}
        onClick={toggleZoom}
      />

      {/* Arrows only on desktop */}
      <button
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full"
        onClick={prevImage}
      >
        &#10094;
      </button>
      <button
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full"
        onClick={nextImage}
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
