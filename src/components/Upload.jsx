// src/components/Upload.jsx
import { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [instaUrl, setInstaUrl] = useState('');

  const handleUpload = async () => {
    if (!file || !title || !category) {
      return alert('Please fill all required fields');
    }
    if (!file.type.startsWith('image/')) {
      return alert('Only images are allowed');
    }
    if (file.size > 2 * 1024 * 1024) {
      return alert('Max size 2MB');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('instaUrl', instaUrl);

    try {
      await axios.post('https://idbackend-rf1u.onrender.com/api/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Uploaded successfully');
      setFile(null);
      setTitle('');
      setCategory('');
      setInstaUrl('');
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center px-4 py-6">
      {/* Business Header */}
      <header className="w-full max-w-3xl flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SK Cards</h1>
            <p className="text-sm text-gray-500">Contact: +91-9876543210</p>
          </div>
        </div>
      </header>

      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Image</h2>

        <input 
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-gray-700"
        >
          <option value="">Select Category</option>
          <option value="birthday">Birthday</option>
          <option value="marriage">Marriage</option>
          <option value="school">School</option>
          <option value="business">Business</option>
        </select>

        <input 
          type="text"
          placeholder="Instagram URL (optional)"
          value={instaUrl}
          onChange={(e) => setInstaUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full px-4 py-2 border rounded-md text-gray-700"
        />

        {file && (
          <img 
            src={URL.createObjectURL(file)} 
            alt="Preview" 
            className="w-40 h-40 object-cover rounded-md shadow-md mx-auto"
          />
        )}

        <button 
          onClick={handleUpload} 
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
