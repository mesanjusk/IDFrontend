// 📁 src/pages/Admin.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const userNameFromState = location.state?.id;
    const user = userNameFromState || localStorage.getItem('User_name');
    setLoggedInUser(user);
    if (user) {
      fetchListings();
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);

  const fetchListings = async () => {
    try {
      const response = await axios.get('/api/listings');
      setListings(response.data);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/listings/${id}`);
      fetchListings();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('User_name');
    navigate('/');
  };

  const filteredListings = useMemo(() => {
    let filtered = listings.filter((item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    switch (sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return filtered;
    }
  }, [listings, searchTerm, sortBy, selectedCategory]);

  const uniqueCategories = [...new Set(listings.map((item) => item.category))];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow p-4 hidden sm:block">
        <h2 className="text-xl font-bold text-pink-600 mb-4">Admin Panel</h2>
        <button
          className="w-full bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          onClick={handleLogout}
        >
          Logout
        </button>
        <nav className="mt-6 space-y-2">
          <button className="block w-full text-left hover:text-pink-600">All Listings</button>
          <button className="block w-full text-left hover:text-pink-600">Add New</button>
          <button className="block w-full text-left hover:text-pink-600">Drafts</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Helmet>
          <title>Admin – Sanju SK Digital</title>
        </Helmet>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search listings..."
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded px-4 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price (Low → High)</option>
            <option value="price-desc">Price (High → Low)</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-pink-600 text-white">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((item) => (
                  <tr key={item.id} className="bg-white border-b">
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">₹{item.price}</td>
                    <td className="px-4 py-2">{item.status || 'Published'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="text-sm text-blue-600 hover:underline">Edit</button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
