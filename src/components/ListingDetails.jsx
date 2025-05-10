import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ListingDetails = () => {
  const [listing, setListing] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://idbackend-rf1u.onrender.com/api/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        console.error('Error fetching listing:', err);
      }
    };

    fetchListing();
  }, [id]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;

    if (distance > 50) {
      // Swiped left
      setCurrentIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    } else if (distance < -50) {
      // Swiped right
      setCurrentIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }

    // Reset
    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="listing-details max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{listing.title}</h2>
      <p className="text-gray-600 mb-1">{listing.location}</p>
      <p className="text-xl text-green-600 font-semibold mb-4">${listing.price} / night</p>
      <p className="mb-6">{listing.description}</p>

      {/* Swipe Carousel */}
      <div
        className="relative w-full h-[400px] overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={listing.images[currentIndex]}
          alt={`Listing image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Dots */}
        <div className="absolute bottom-3 w-full flex justify-center space-x-2">
          {listing.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
