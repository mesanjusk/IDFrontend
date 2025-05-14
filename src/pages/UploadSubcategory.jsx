import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadSubcategory = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('');
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = () => {
    axios.get('https://idbackend-rf1u.onrender.com/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  };

  const fetchSubcategories = () => {
    axios.get('https://idbackend-rf1u.onrender.com/api/subcategories')
      .then(res => setSubcategories(res.data))
      .catch(err => console.error('Error fetching subcategories:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    if (!name || !image || !categoryId) {
      setStatus('Please provide name, image, and select a category.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryId', categoryId);
    formData.append('image', image);

    try {
      await axios.post('https://idbackend-rf1u.onrender.com/api/subcategories', formData);
      setStatus('✅ Subcategory uploaded successfully!');
      setName('');
      setImage(null);
      setCategoryId('');
      fetchSubcategories();
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('❌ Failed to upload subcategory.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://idbackend-rf1u.onrender.com/api/subcategories/${id}`);
      fetchSubcategories();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Subcategory</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label><br />
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div>
          <label>Select Category:</label><br />
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
            <option value="">-- Select a Category --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Image:</label><br />
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>Upload</button>
      </form>

      {status && <p>{status}</p>}

      <hr />
      <h3>Existing Subcategories</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map(sub => (
            <tr key={sub._id}>
              <td><img src={sub.imageUrl} alt={sub.name} width="50" /></td>
              <td>{sub.name}</td>
              <td>{categories.find(cat => cat._id === sub.categoryId)?.name || 'N/A'}</td>
              <td><button onClick={() => handleDelete(sub._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadSubcategory;
