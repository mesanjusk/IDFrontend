import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

const UploadCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editName, setEditName] = useState('');
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

  useEffect(() => {
    setFilteredCategories(
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
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
      fetchCategories();
    } catch (err) {
      setError('Failed to update category');
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

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-md shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Upload Category</h2>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus size={18} /> New Category
        </button>
      </div>

      <input
        type="text"
        placeholder="Search categories..."
        className="w-full border p-2 mb-4 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
          {filteredCategories.map(({ _id, name, imageUrl }) => (
            <tr key={_id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 text-center">
                <img src={imageUrl} alt={name} className="h-12 w-12 object-cover inline-block rounded cursor-pointer" onClick={() => openImageModal(imageUrl)} title="Click to preview" />
              </td>
              <td className="border border-gray-300 p-2">{name}</td>
              <td className="border border-gray-300 p-2 text-center space-x-2">
                <button onClick={() => openEditModal(_id, name)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => deleteCategory(_id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
          <div className="bg-white p-6 rounded shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-semibold mb-4">Add New Category</h4>
            <form onSubmit={handleSubmit} onDragEnter={handleDrag}>
              <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full border p-2 rounded mb-4" placeholder="Category name" required />
              <div className={`border-dashed border-2 p-4 text-center rounded cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} onDrop={handleDrop} onDragOver={handleDrag} onDragLeave={handleDrag}>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} className="hidden" id="upload-file-modal" />
                <label htmlFor="upload-file-modal" className="cursor-pointer">
                  {categoryImage ? (
                    <span className="text-sm text-gray-700">{categoryImage.name}</span>
                  ) : (
                    <span className="text-gray-600">Drag & drop image or click to upload</span>
                  )}
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing edit and image modals remain unchanged */}
    </div>
  );
};

export default UploadCategory;
