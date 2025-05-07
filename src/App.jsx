import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import StoryGallery from "./components/StoryGallery";
import Upload from './components/Upload'; // fixed path and typo
import Insta from './components/Insta'; // fixed path and typo

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<StoryGallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/Instagram" element={<Insta />} />
      </Routes>
    </Router>
  );
}

export default App;
