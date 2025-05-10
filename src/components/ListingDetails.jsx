import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ListingDetails = () => {
  const [listing, setListing] = useState(null);
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

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="listing-details">
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p>{listing.price} USD / night</p>
      <p>{listing.location}</p>

      {/* Render Images */}
      <div className="images">
        {listing.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Listing image ${index + 1}`}
            className="w-full h-96 object-cover mb-4"
          />
        ))}
      </div>
    </div>
  );
};

export default ListingDetails;
