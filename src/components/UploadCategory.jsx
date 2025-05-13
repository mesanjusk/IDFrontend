import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const UploadCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://idbackend-rf1u.onrender.com/api/categories');
      setAllCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !image) {
      alert("Please provide both name and image.");
      return;
    }

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('image', image);

    setLoading(true);

    try {
      await axios.post('https://idbackend-rf1u.onrender.com/api/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("Category uploaded!");
      setCategoryName('');
      setImage(null);
      setPreview(null);
      inputRef.current.value = '';
      fetchCategories();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Upload New Category</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md space-y-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />

        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Category"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allCategories.map((cat) => (
            <div key={cat._id} className="bg-white p-2 shadow rounded text-center">
              <img src={cat.imageUrl} alt={cat.name} className="w-full h-32 object-cover rounded mb-2" />
              <p className="font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadCategory;
