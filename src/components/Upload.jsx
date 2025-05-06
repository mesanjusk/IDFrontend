// src/components/Upload.jsx
import { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    if (!file.type.startsWith('image/')) return alert('Only images are allowed');
    if (file.size > 2 * 1024 * 1024) return alert('Max size 2MB');

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('https://idbackend-rf1u.onrender.com/api/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Uploaded successfully');
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Upload Image</h1>

      <div className="flex flex-col items-center space-y-4">
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          className="px-4 py-2 border rounded-md text-gray-700"
        />
        {file && (
          <img 
            src={URL.createObjectURL(file)} 
            alt="Preview" 
            className="w-48 h-48 object-cover rounded-md shadow-md"
          />
        )}
        <button 
          onClick={handleUpload} 
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
