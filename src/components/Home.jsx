import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import Category from './Category';
import Content from './Content';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [savedPosts, setSavedPosts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const uniqueCategories = [...new Set(listings.map((item) => item.category))];

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Category */}
      <Category 
        uniqueCategories={uniqueCategories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      {/* Content */}
      <Content 
        listings={listings} 
        selectedCategory={selectedCategory} 
        savedPosts={savedPosts} 
        setSavedPosts={setSavedPosts} 
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
