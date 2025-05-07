import { useState } from 'react';
import axios from 'axios';

export default function ImageUploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);

    try {
      await axios.post('https://idbackend-rf1u.onrender.com/api/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Uploaded successfully');
      setFile(null);
      setTitle('');
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload an Image</h1>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
