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
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userNameFromState = location.state?.id;
    const user = userNameFromState || localStorage.getItem('User_name');
    if (!user) navigate('/login');
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
      setFilteredCategories(res.data);
      setUsedCategoryNames(res.data.map((cat) => cat.name.toLowerCase()));
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const name = categoryName.trim();
    if (!name || !categoryImage) {
      setError('Please provide name and image');
      return;
    }
    if (usedCategoryNames.includes(name.toLowerCase())) {
      setError('Category already exists');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', categoryImage);

    try {
      await axios.post(API_URL, formData);
      setSuccess('Category uploaded!');
      setCategoryName('');
      setCategoryImage(null);
      setPreviewImage(null);
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError('Upload failed');
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) setFilteredCategories(categories);
    else {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setModalOpen(true)}
        >
          + New Category
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cat) => (
            <tr key={cat._id} className="text-center">
              <td className="p-2 border">
                <img src={cat.imageUrl} alt={cat.name} className="h-12 mx-auto" />
              </td>
              <td className="p-2 border">{cat.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
            <form onSubmit={handleUpload} className="space-y-4">
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
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setCategoryImage(file);
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCategory;
