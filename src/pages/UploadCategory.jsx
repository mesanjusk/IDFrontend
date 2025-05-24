import React, { useState, useEffect, useRef } from 'react';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // User check and fetch categories
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

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
      setFilteredCategories(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file change and preview image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Handle submit new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim() || !categoryImage) {
      setError('Please provide both category name and image.');
      return;
    }
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', categoryName.trim());
    formData.append('image', categoryImage);

    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Category uploaded successfully!');
      setCategoryName('');
      setCategoryImage(null);
      setPreviewImage(null);
      fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          '❌ Error uploading category. Please try again.'
      );
      console.error('Submit error:', err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm and delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccess('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category. Please try again.');
      console.error('Delete error:', err);
    }
  };

  // Open image modal
  const openImageModal = (imageUrl) => {
    setModalImageSrc(imageUrl);
    setIsImageModalOpen(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageSrc(null);
  };

  // Open edit modal
  const openEditModal = (cat) => {
    setEditCategoryId(cat._id);
    setEditCategoryName(cat.name);
    setIsEditModalOpen(true);
    setError('');
    setSuccess('');
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  // Submit category name edit
  const submitEdit = async () => {
    if (!editCategoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_URL}/${editCategoryId}`, { name: editCategoryName.trim() });
      setSuccess('Category name updated!');
      fetchCategories();
      closeEditModal();
    } catch (err) {
      setError('Failed to update category name.');
      console.error('Edit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter categories by search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Category</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search categories..."
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={isSubmitting}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={isSubmitting}
        />
        {previewImage && (
          <div className="mb-2">
            <p className="mb-1 font-semibold">Image Preview:</p>
            <img
              src={previewImage}
              alt="Preview"
              className="h-24 border border-gray-300 rounded cursor-pointer"
              onClick={() => openImageModal(previewImage)}
            />
          </div>
        )}
        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <h3 className="text-xl font-semibold mb-2">Categories List</h3>

      {isLoading ? (
        <p className="text-center py-6">Loading categories...</p>
      ) : filteredCategories.length === 0 ? (
        <p className="text-center py-6">No categories found.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat._id} className="text-center">
                <td className="p-2 border">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="h-12 mx-auto cursor-pointer"
                    onClick={() => openImageModal(cat.imageUrl)}
                  />
                </td>
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeImageModal}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={modalImageSrc}
            alt="Category Full View"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            aria-label="Close Image Modal"
          >
            &times;
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Edit Category Name</h3>
            <input
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              disabled={isSubmitting}
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCategory;
