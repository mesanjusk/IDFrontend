import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StoryGallery from './components/StoryGallery';
import Upload from './components/Upload';
import Insta from './components/Insta';
import CreateListing from './components/CreateListing';
import Listing from './components/listing';
import ListingDetails from './components/ListingDetails';
import Profile from './components/Profile';
import UploadCategory from './pages/UploadCategory';
import UploadSubcategory from './pages/UploadSubcategory';
import AddItem from './pages/addTitle';
import AddPrice from './pages/addPrice';

function App() {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBackendReady(true); 
    }, 5000);

    fetch('https://idbackend-rf1u.onrender.com/api/ping')
      .then((res) => res.json())
      .then(() => {
        clearTimeout(timeout);
        setBackendReady(true);
      })
      .catch(() => {
        clearTimeout(timeout);
        setBackendReady(true);
      });

    return () => clearTimeout(timeout);
  }, []);

  if (!backendReady) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
        <div className="spinner" />
        <p>Loading </p>
        <style>{`
          .spinner {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<StoryGallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/instagram" element={<Insta />} />
        <Route path="/listing" element={<CreateListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/list" element={<Listing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/UploadCategory" element={<UploadCategory />} />
        <Route path="/UploadSubcategory" element={<UploadSubcategory />} />
        <Route path="/addTitle" element={<AddItem />} />
         <Route path="/addPrice" element={<AddPrice />} />
      </Routes>
    </Router>
  );
}

export default App;
