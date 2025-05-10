import { useState, useEffect } from 'react';
import axios from 'axios';

const Listings = () => {
  const [listings, setListings] = useState([]);

  // Fetch all listings from the backend
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <div key={listing._id} className="listing-card p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold">{listing.title}</h3>
          <p>{listing.location}</p>
          <p className="text-lg text-green-500">{listing.price} USD / night</p>

          {/* Image Carousel with Swipe Support */}
          <div className="relative">
            <Carousel images={listing.images} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Carousel Component
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragging, setDragging] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Swipe handling (Mobile)
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      nextImage(); // Swipe Left
    }

    if (touchEnd - touchStart > 150) {
      prevImage(); // Swipe Right
    }
  };

  // Mouse Drag (Desktop)
  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dragDistance = dragStart - e.clientX;
      if (dragDistance > 150) {
        nextImage();
        setDragging(false);
      } else if (dragDistance < -150) {
        prevImage();
        setDragging(false);
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Zoom functionality
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex justify-center items-center">
        <img
          src={images[currentIndex]}
          alt={`Listing image ${currentIndex + 1}`}
          className={`w-full h-48 object-cover rounded-lg transition-all duration-300 ${isZoomed ? 'transform scale-150' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={toggleZoom} // Zoom functionality on click
        />
      </div>

      {/* Left and Right Arrow Controls */}
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={prevImage}
      >
        &#10094;
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={nextImage}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Listings;
