import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Category from "../components/Category";  // Correct import for Category
import Content from "../components/Content";   // Correct import for Content



const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [savedPosts, setSavedPosts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [loggedInUser, setLoggedInUser] = useState(null); 

   useEffect(() => {
      setTimeout(() => {
        const userNameFromState = location.state?.id;
        const user = userNameFromState || localStorage.getItem('User_name');
        setLoggedInUser(user);
        if (user) {
          fetchListings(user);
        } else {
          navigate("/");
        }
      }, 2000);
      setTimeout(() => setLoading(false), 2000);
    }, [location.state, navigate]);

    const fetchListings = async () => {
      try {
        const response = await axios.get('https://idbackend-rf1u.onrender.com/api/listings');
        setListings(response.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to fetch listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
   

  // Load saved posts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPosts');
    if (saved) setSavedPosts(JSON.parse(saved));
  }, []);

  // Save posts to localStorage on change
  useEffect(() => {
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  const uniqueCategories = [...new Set(listings.map((item) => item.category))];

  

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>Home – Sanju SK Digital</title>
        <meta name="description" content="Explore custom wedding cards, trophies, awards, ID cards and digital printing services from Sanju SK Digital Gondia." />
        <link rel="canonical" href="https://skcard.vercel.app" />
        <meta property="og:title" content="Sanju SK Digital – Custom Printing Services" />
        <meta property="og:description" content="Discover quality printing services including wedding invitations, mementos, ID cards and more." />
        <meta property="og:url" content="https://skcard.vercel.app" />
        <meta property="og:type" content="website" />
      </Helmet>


      {/* Conditional Rendering */}
      {loading ? (
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center mt-10 text-red-500">{error}</div>
      ) : (
        <>
          {/* Category Filter */}
          <Category
            uniqueCategories={uniqueCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Listings */}
          <Content
            listings={listings}
            selectedCategory={selectedCategory}
            savedPosts={savedPosts}
            setSavedPosts={setSavedPosts}
          />
        </>
      )}

    
    </div>
  );
};

export default Admin;
