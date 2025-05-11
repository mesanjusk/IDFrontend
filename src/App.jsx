import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; // Home component
import StoryGallery from './components/StoryGallery';
import Upload from './components/Upload'; // fixed path and typo
import Insta from './components/Insta'; // fixed path and typo
import CreateListing from './components/CreateListing';
import Listing from './components/listing';
import ListingDetails from './components/ListingDetails';
import Profile from './components/Profile'; // Add Profile component

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Other Routes */}
        <Route path="/story" element={<StoryGallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/instagram" element={<Insta />} />
        <Route path="/listing" element={<CreateListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/list" element={<Listing />} />

        {/* Add Profile Route */}
        <Route path="/profile" element={<Profile />} /> {/* Profile page route */}
      </Routes>
    </Router>
  );
}

export default App;
