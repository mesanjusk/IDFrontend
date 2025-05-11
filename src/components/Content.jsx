import { useEffect, useState } from 'react';
import Carousel from './Carousel';
import {
  FaRegHeart,
  FaHeart,
  FaRegCommentDots,
  FaShare,
  FaBookmark,
  FaRegBookmark,
} from 'react-icons/fa';

const Content = ({ listings, selectedCategory }) => {
  // Initial state setup for savedPosts from localStorage
  const [savedPosts, setSavedPosts] = useState(() => {
    const saved = localStorage.getItem('savedPosts');
    return saved ? JSON.parse(saved) : {};
  });

  const handleLikeClick = (listingId) => {
    setSavedPosts((prev) => {
      const updatedPosts = { ...prev };
      if (updatedPosts[listingId] && updatedPosts[listingId].likes > 0) {
        // Decrement like count when the heart is filled
        updatedPosts[listingId].likes -= 1;
      } else {
        // Increment like count when the heart is outlined
        updatedPosts[listingId] = { likes: 1 };
      }

      // Save updated state to localStorage
      localStorage.setItem('savedPosts', JSON.stringify(updatedPosts));

      return updatedPosts;
    });
  };

  const filteredListings = selectedCategory
    ? listings.filter((l) => l.category === selectedCategory)
    : listings;

  useEffect(() => {
    // Ensure savedPosts are updated in localStorage on every change
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      {filteredListings.length === 0 ? (
        <div>No listings available</div>
      ) : (
        filteredListings.map((listing) => (
          <div key={listing._id} className="border-b pb-4">
            <div className="flex items-center p-3 space-x-3">
              <img
                src={listing.images[0] || 'default-image-path.jpg'}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-semibold">{listing.title}</span>
            </div>

            <Carousel images={listing.images} />

            <div className="px-3 mt-2 flex justify-between items-center text-xl">
              <div className="flex space-x-4">
                {/* Heart Icon with Like Count */}
                <div className="flex items-center">
                  <div
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => handleLikeClick(listing._id)}
                  >
                    {savedPosts[listing._id] && savedPosts[listing._id].likes > 0 ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </div>
                  <span className="ml-2">{savedPosts[listing._id]?.likes || 0}</span>
                </div>

                <FaRegCommentDots className="cursor-pointer hover:text-blue-500" />
                <FaShare
                  className="cursor-pointer"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: listing.title,
                          text: listing.location,
                          url: window.location.href,
                        })
                        .catch((err) => console.error('Share failed:', err));
                    } else {
                      alert('Sharing is not supported in this browser.');
                    }
                  }}
                />
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  setSavedPosts((prev) => {
                    const updatedPosts = { ...prev };
                    updatedPosts[listing._id] = !updatedPosts[listing._id];
                    localStorage.setItem('savedPosts', JSON.stringify(updatedPosts)); // Save updated state to localStorage
                    return updatedPosts;
                  })
                }
              >
                {savedPosts[listing._id] ? <FaBookmark /> : <FaRegBookmark />}
              </div>
            </div>

            <div className="px-3 text-sm mt-1">{listing.location}</div>
            <div className="px-3 text-sm text-green-500">{listing.price} ₹</div>
          </div>
        ))
      )}
    </div>
  );
};

export default Content;
