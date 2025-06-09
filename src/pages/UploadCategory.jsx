import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [dragActive, setDragActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://idbackend-rf1u.onrender.com/api/categories');
      setCategories(res.data.categories || []);
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
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
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
      await axios.post('https://idbackend-rf1u.onrender.com/api/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Category uploaded successfully!');
      setCategoryName('');
      setCategoryImage(null);
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError('Error uploading category');
    }
  };

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
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-md shadow bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Upload Category</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <span className="text-lg">+</span> <span>New Category</span>
        </button>
      </div>

      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full border p-2 rounded"
      />

      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
      {success && <p className="text-green-500 mb-2 text-sm">{success}</p>}

      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">Image</th>
            <th className="border border-gray-300 px-3 py-2">Name</th>
            <th className="border border-gray-300 px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No matching categories found.
              </td>
            </tr>
          ) : (
            filteredCategories.map(({ _id, name, imageUrl }) => (
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
                    onClick={() => deleteCategory(_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* New Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">New Category</h3>
            <form onSubmit={handleSubmit} onDragEnter={handleDrag}>
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                required
              />
              <div
                className={`border-dashed border-2 p-4 text-center rounded cursor-pointer mb-4 ${
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
                    <span className="text-gray-600">Drag & drop or click to upload</span>
                  )}
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
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
