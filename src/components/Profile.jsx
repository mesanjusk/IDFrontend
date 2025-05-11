import React from 'react';
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaCamera, FaInstagram, FaMapMarkerAlt, FaPen } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

// Footer Component
import Footer from './Footer';  // Import Footer

// Define map container style
const containerStyle = {
  width: '100%',
  height: '300px',
};

const Profile = () => {
  const [location, setLocation] = useState({
    lat: 40.748817, // Default to New York
    lng: -73.985428,
  });

  const userProfile = {
    name: 'John Doe',
    bio: 'Photographer | Traveler | Blogger',
    posts: 152,
    followers: 1200,
    following: 500,
    image: 'https://via.placeholder.com/150', // Profile image URL
  };

  // Google Map center update
  useEffect(() => {
    // Fetch user location via API or any other source
    // For now, we will just use default location
  }, []);

  return (
    <div className="profile-page bg-white">
      <Helmet>
        <title>{userProfile.name} - Instagram</title>
        <meta name="description" content={`Profile of ${userProfile.name} on Instagram`} />
        <meta property="og:title" content={userProfile.name} />
        <meta property="og:description" content={`Check out ${userProfile.name}'s Instagram`} />
        <meta property="og:image" content={userProfile.image} />
        <meta property="og:url" content="https://www.instagram.com/profile-url" />
      </Helmet>

      {/* Profile Info Section */}
      <div className="flex items-center p-5 space-x-5">
        <img
          src={userProfile.image}
          alt="profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{userProfile.name}</h1>
          <p className="text-sm text-gray-600">{userProfile.bio}</p>
          <div className="mt-2 flex space-x-10">
            <span className="font-semibold">{userProfile.posts} Posts</span>
            <span className="font-semibold">{userProfile.followers} Followers</span>
            <span className="font-semibold">{userProfile.following} Following</span>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center">
            <FaPen className="mr-2" />
            Edit Profile
          </button>
          <button className="bg-gray-200 text-gray-600 py-2 px-4 rounded-lg flex items-center">
            <FaInstagram className="mr-2" />
            Follow
          </button>
        </div>
      </div>

      {/* Google Maps Location */}
      <div className="location mt-5">
        <h2 className="text-xl font-semibold flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          Location
        </h2>

        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={10}
          >
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Add Camera Icon */}
      <div className="camera mt-5 text-center">
        <button className="text-gray-600 hover:text-gray-800">
          <FaCamera size={30} />
        </button>
        <span className="text-sm text-gray-500">Add a New Photo</span>
      </div>

      {/* Footer */}
      <Footer /> {/* Footer will be at the bottom */}
    </div>
  );
};

export default Profile;
