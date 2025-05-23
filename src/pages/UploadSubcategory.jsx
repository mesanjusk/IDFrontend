import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const UploadSubcategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Modal states
  const [viewImageModal, setViewImageModal] = useState({ open: false, imageUrl: '' });
  const [editModal, setEditModal] = useState({ open: false, subcategory: null });
  const [editName, setEditName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editIsLoading, setEditIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const userNameFromState = location.state?.id;
      const user = userNameFromState || localStorage.getItem('User_name');
      setLoggedInUser(user);
      if (user) {
        fetchCategories(user);
        fetchSubcategories(user)
      } else {
        navigate("/login");
      }
    }, 2000);
    setTimeout(() => setIsLoading(false), 2000);
  }, [location.state, navigate]);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Error fetching categories:', err));
  };

  const fetchSubcategories = () => {
    axios
      .get('/api/subcategories')
      .then((res) => setSubcategories(res.data))
      .catch((err) => console.error('Error fetching subcategories:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setIsLoading(true);

    if (!name || !image || !categoryId) {
      setStatus('❌ Please provide name, image, and select a category.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryId', categoryId);
    formData.append('image', image);

    try {
      await axios.post('/api/subcategories', formData);
      setStatus('✅ Subcategory uploaded successfully!');
      setName('');
      setImage(null);
      setCategoryId('');
      fetchSubcategories();
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('❌ Failed to upload subcategory.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this subcategory?');
    if (!confirmed) return;

    try {
      await axios.delete(`/api/subcategories/${id}`);
      fetchSubcategories();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Open view image modal
  const openImageModal = (imageUrl) => {
    setViewImageModal({ open: true, imageUrl });
  };

  const closeImageModal = () => {
    setViewImageModal({ open: false, imageUrl: '' });
  };

  // Open edit modal
  const openEditModal = (sub) => {
    setEditModal({ open: true, subcategory: sub });
    setEditName(sub.name);
    setEditCategoryId(sub.categoryId?._id || sub.categoryId);
    setEditImage(null); // Reset edit image file input
  };

  const closeEditModal = () => {
    setEditModal({ open: false, subcategory: null });
    setEditName('');
    setEditCategoryId('');
    setEditImage(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditIsLoading(true);

    if (!editName || !editCategoryId) {
      alert('Name and category are required.');
      setEditIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', editName);
    formData.append('categoryId', editCategoryId);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      await axios.put(`/api/subcategories/${editModal.subcategory._id}`, formData);
      fetchSubcategories();
      closeEditModal();
    } catch (error) {
      console.error('Edit error:', error);
      alert('Failed to update subcategory.');
    } finally {
      setEditIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">Upload Subcategory</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">-- Select a Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.category_uuid}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 mt-4 text-white rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {status && <p className="mt-4 text-center">{status}</p>}

      <hr className="my-6" />

      <h3 className="text-xl font-semibold">Existing Subcategories</h3>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((sub) => (
              <tr key={sub._id} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={sub.imageUrl}
                    alt={sub.name}
                    width="50"
                    className="rounded cursor-pointer"
                    onClick={() => openImageModal(sub.imageUrl)}
                  />
                </td>
                <td className="px-4 py-2">{sub.name}</td>
                <td className="px-4 py-2">
                  {
                    categories.find(
                      (cat) => cat._id === (sub.categoryId?._id || sub.categoryId)
                    )?.name || 'N/A'
                  }
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  {!sub.isUsed && (
    <button
      onClick={() => handleDelete(sub._id)}
      className="text-red-500 hover:text-red-700"
    >
      Delete
    </button>
  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {viewImageModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={closeImageModal}>
          <img
            src={viewImageModal.imageUrl}
            alt="Subcategory"
            className="max-w-full max-h-full rounded"
            onClick={e => e.stopPropagation()} // prevent closing when clicking on image itself
          />
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={closeEditModal}>
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()} // prevent closing when clicking inside modal content
          >
            <h3 className="text-xl font-semibold mb-4">Edit Subcategory</h3>
            <form onSubmit={handleEditSubmit} encType="multipart/form-data" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Select Category:</label>
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Replace Image (optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editIsLoading}
                  className={`py-2 px-4 text-white rounded ${editIsLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {editIsLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSubcategory;
