// Updated CreateListing page with modal, table view, search, and "no data" handling
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', price: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = location.state?.id || localStorage.getItem('User_name');
    if (!user) {
      navigate('/login');
    } else {
      setLoggedInUser(user);
      fetchListings();
    }
  }, [location.state, navigate]);

  const fetchListings = async () => {
    try {
      const res = await axios.get('/api/listings');
      setListings(res.data);
    } catch (err) {
      console.error('Failed to fetch listings', err);
    }
  };

  const filteredListings = listings.filter((listing) =>
    listing.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    try {
      await axios.post('/api/listings', formData);
      setFormData({ title: '', price: '' });
      setModalOpen(false);
      fetchListings();
    } catch (err) {
      console.error('Create failed', err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Listings</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Listing
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by Title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <tr key={listing._id}>
                  <td className="border p-2">{listing.title}</td>
                  <td className="border p-2">{listing.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">New Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateListing;
