import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './componennts/Home';
import ImageUploadPage from './componennts/Upload';

function App() {
  return (
    <Router>
      <nav className="bg-white shadow-md p-4 flex justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-700">Home</Link>
        <Link to="/upload" className="text-blue-600 hover:underline">Upload Image</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<ImageUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
