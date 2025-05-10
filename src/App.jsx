import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import StoryGallery from "./components/StoryGallery";
import Upload from './components/Upload'; // fixed path and typo
import Insta from './components/Insta'; // fixed path and typo
import CreateListing from './components/CreateListing';
import Listing from './components/listing';
import ListingDetails from './components/ListingDetails';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<StoryGallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/Instagram" element={<Insta />} />
        <Route path="/listing" element={<CreateListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/list" element={<Listing />} />
      </Routes>
    </Router>
  );
}

export default App;
