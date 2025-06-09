import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = '/api/categories';

const UploadCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [usedCategoryNames, setUsedCategoryNames] = useState([]);
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const userNameFromState = location.state?.id;
    const user = userNameFromState || localStorage.getItem('User_name');
    if (!user) {
      navigate('/login');
      return;
    }
    setLoggedInUser(user);
    fetchCategories();
  }, [location.state, navigate]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
      setFilteredCategories(res.data);
      setUsedCategoryNames(res.data.map((cat) => cat.name.toLowerCase()));
      setError('');
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredCategories(
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleAddNew = () => {
    setCategoryName('');
    setCategoryImage(null);
    setPreviewImage(null);
    setIsAddModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const name = categoryName.trim();
    if (!name || !categoryImage) {
      setError('Please provide both category name and image.');
      return;
    }
    if (usedCategoryNames.includes(name.toLowerCase())) {
      setError('Category name already exists.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', categoryImage);
    try {
      await axios.post(API_URL, formData);
      setSuccess('Category added!');
      setIsAddModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError('Error adding category.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Upload Category</h2>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Category
        </button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search categories..."
        className="w-full p-2 mb-4 border rounded"
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : filteredCategories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat._id} className="text-center">
                <td className="border p-2">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="h-12 w-12 object-cover mx-auto rounded cursor-pointer"
                    onClick={() => {
                      setModalImageSrc(cat.imageUrl);
                      setIsImageModalOpen(true);
                    }}
                  />
                </td>
                <td className="border p-2">{cat.name}</td>
                <td className="border p-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Category</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCategory;
