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

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Swipe handling
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

  return (
    <div
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-center items-center">
        <img
          src={images[currentIndex]}
          alt={`Listing image ${currentIndex + 1}`}
          className="w-full h-48 object-cover rounded-lg transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default Listings;
