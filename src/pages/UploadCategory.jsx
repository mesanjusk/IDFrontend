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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

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
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }
    setCategoryImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
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
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', categoryImage);
    try {
      await axios.post(API_URL, formData);
      setSuccess('Category uploaded successfully!');
      setCategoryName('');
      setCategoryImage(null);
      setPreviewImage(null);
      fetchCategories();
    } catch (err) {
      setError('Error uploading category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteCategory = (id) => {
    setDeleteCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteCategoryId}`);
      setSuccess('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category.');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const openImageModal = (src) => {
    setModalImageSrc(src);
    setIsImageModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditCategoryId(cat._id);
    setEditCategoryName(cat.name);
    setEditPreviewImage(cat.imageUrl);
    setEditCategoryImage(null);
    setIsEditModalOpen(true);
  };

  const submitEdit = async () => {
    const name = editCategoryName.trim();
    if (!name) {
      setError('Category name cannot be empty.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    if (editCategoryImage) formData.append('image', editCategoryImage);
    setIsSubmitting(true);
    try {
      await axios.put(`${API_URL}/${editCategoryId}`, formData);
      setSuccess('Category updated successfully!');
      fetchCategories();
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Failed to update category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const results = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Upload Category</h2>
        <button
          onClick={() => document.getElementById('upload-form').scrollIntoView({ behavior: 'smooth' })}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >+ New Category</button>
      </div>

      <input
        type="text"
        placeholder="Search categories..."
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <form id="upload-form" onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {previewImage && <img src={previewImage} alt="Preview" className="h-24 rounded border" />}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >{isSubmitting ? 'Uploading...' : 'Upload'}</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map(cat => (
            <tr key={cat._id} className="text-center">
              <td className="p-2 border">
                <img src={cat.imageUrl} alt={cat.name} className="h-12 mx-auto cursor-pointer" onClick={() => openImageModal(cat.imageUrl)} />
              </td>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">
                <button onClick={() => openEditModal(cat)} className="text-sm px-3 py-1 bg-yellow-500 text-white rounded mr-2">Edit</button>
                <button onClick={() => confirmDeleteCategory(cat._id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <img src={modalImageSrc} alt="Full View" className="max-h-[90vh] max-w-[90vw] rounded shadow" />
          <button onClick={() => setIsImageModalOpen(false)} className="absolute top-4 right-4 text-white text-2xl">×</button>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Category</h3>
            <input value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} className="w-full p-2 mb-4 border rounded" />
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e)} className="w-full p-2 mb-2 border rounded" />
            {editPreviewImage && <img src={editPreviewImage} alt="Preview" className="h-24 rounded border mb-2" />}
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={submitEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this category?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCategory;
