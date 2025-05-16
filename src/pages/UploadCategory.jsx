import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = 'https://idbackend-rf1u.onrender.com/api/categories';

const UploadCategory = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); 
       

   useEffect(() => {
        setTimeout(() => {
          const userNameFromState = location.state?.id;
          const user = userNameFromState || localStorage.getItem('User_name');
          setLoggedInUser(user);
          if (user) {
            fetchCategories(user);
          } else {
            navigate("/login");
          }
        }, 2000);
        setTimeout(() => setIsLoading(false), 2000);
      }, [location.state, navigate]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !categoryImage) {
      setError('Please provide both category name and image.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('image', categoryImage);

    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Category uploaded successfully!');
      setCategoryName('');
      setCategoryImage(null);
      fetchCategories();
    } catch (err) {
      setError('❌ Error uploading category');
      console.error('Submit error:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleNameEdit = async (id, newName) => {
    try {
      await axios.put(`${API_URL}/${id}`, { name: newName });
      fetchCategories();
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <h3 className="text-xl font-semibold mb-2">Categories List</h3>
      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="text-center">
              <td className="p-2 border">
                <img src={cat.imageUrl} alt={cat.name} className="h-12 mx-auto" />
              </td>
              <td className="p-2 border">
                <input
                  className="border px-2 py-1 w-full"
                  defaultValue={cat.name}
                  onBlur={(e) => handleNameEdit(cat._id, e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadCategory;
