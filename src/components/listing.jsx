import { useState, useEffect } from 'react';
import axios from 'axios';

const Listings = () => {
  const [listings, setListings] = useState([]);

  // Fetch all listings from the backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/listings');
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
        <div key={listing._id} className="listing-card">
          <h3>{listing.title}</h3>
          <p>{listing.location}</p>
          <p>{listing.price} USD / night</p>

          {/* Display images like Airbnb */}
          <div className="image-container">
            {listing.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Listing image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Listings;
