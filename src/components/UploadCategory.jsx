import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PAGE_SIZE = 5;

const UploadCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editName, setEditName] = useState('');

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState('');

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchCategories = async (pageNum) => {
    try {
      const res = await axios.get(
        `https://idbackend-rf1u.onrender.com/api/categories?page=${pageNum}&limit=${PAGE_SIZE}`
      );
      setCategories(res.data.categories);
      setTotalPages(Math.ceil(res.data.total / PAGE_SIZE));
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const handleFileChange = (file) => {
    if (file && file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      setCategoryImage(null);
    } else {
      setError('');
      setCategoryImage(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !categoryImage) {
      setError('Please provide both category name and image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('image', categoryImage);

    try {
      await axios.post(
        'https://idbackend-rf1u.onrender.com/api/categories',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSuccess('Category uploaded successfully!');
      setCategoryName('');
      setCategoryImage(null);
      fetchCategories(page);
    } catch (err) {
      setError('Error uploading category');
      console.error(err);
    }
  };

  // Edit Modal handlers
  const openEditModal = (id, currentName) => {
    setEditCategoryId(id);
    setEditName(currentName);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditCategoryId(null);
    setEditName('');
    setEditModalOpen(false);
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    try {
      await axios.put(`https://idbackend-rf1u.onrender.com/api/categories/${editCategoryId}`, {
        name: editName,
      });
      setSuccess('Category updated');
      closeEditModal();
      fetchCategories(page);
    } catch (err) {
      setError('Failed to update category');
    }
  };

  // Image Modal handlers
  const openImageModal = (imageUrl) => {
    setImageModalUrl(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalUrl('');
    setImageModalOpen(false);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`https://idbackend-rf1u.onrender.com/api/categories/${id}`);
      setSuccess('Category deleted');
      fetchCategories(page);
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 border rounded-md shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Upload Category</h2>

      <form onSubmit={handleSubmit} onDragEnter={handleDrag} className="mb-8">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div
          className={`border-dashed border-2 p-4 text-center rounded cursor-pointer ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
            id="upload-file"
          />
          <label htmlFor="upload-file" className="cursor-pointer">
            {categoryImage ? (
              <span className="text-sm text-gray-700">{categoryImage.name}</span>
            ) : (
              <span className="text-gray-600">Drag & drop image or click to upload</span>
            )}
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}

      <h3 className="text-xl font-semibold mb-4">Category List</h3>

      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">Image</th>
            <th className="border border-gray-300 px-3 py-2">Name</th>
            <th className="border border-gray-300 px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No categories found.
              </td>
            </tr>
          )}
          {categories.map(({ _id, name, imageUrl }) => (
            <tr key={_id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 text-center">
                <img
                  src={imageUrl}
                  alt={name}
                  className="h-12 w-12 object-cover inline-block rounded cursor-pointer"
                  onClick={() => openImageModal(imageUrl)}
                  title="Click to preview"
                />
              </td>
              <td className="border border-gray-300 p-2">{name}</td>
              <td className="border border-gray-300 p-2 text-center space-x-2">
                <button
                  onClick={() => openEditModal(_id, name)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="pt-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Name Modal */}
      {editModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeEditModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold mb-4">Edit Category Name</h4>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={imageModalUrl}
              alt="Category Preview"
              className="max-w-full max-h-full rounded shadow-lg"
            />
            <button
              onClick={closeImageModal}
              className="mt-2 w-full bg-red-600 text-white py-1 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCategory;
