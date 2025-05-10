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

          {/* Image Carousel */}
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

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-center items-center">
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg"
        >
          &lt;
        </button>

        <img
          src={images[currentIndex]}
          alt={`Listing image ${currentIndex + 1}`}
          className="w-full h-48 object-cover rounded-lg transition-all duration-300"
        />

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Listings;
