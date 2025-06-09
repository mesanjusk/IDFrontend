import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://idbackend-rf1u.onrender.com/api/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      setError('Failed to load categories.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryImage) {
      setError('Please provide both name and image.');
      return;
    }
    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('image', categoryImage);
    try {
      await axios.post('https://idbackend-rf1u.onrender.com/api/categories', formData);
      setSuccess('Category created');
      setCategoryName('');
      setCategoryImage(null);
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError('Failed to upload');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Category
        </button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search categories..."
        className="w-full mb-4 p-2 border rounded"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Image</th>
            <th className="border px-3 py-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cat) => (
            <tr key={cat._id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="h-12 w-12 object-cover rounded"
                />
              </td>
              <td className="border px-3 py-2">{cat.name}</td>
            </tr>
          ))}
          {filteredCategories.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center p-4">No categories found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-96 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                className="w-full mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCategory;
