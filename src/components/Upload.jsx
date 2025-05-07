import { useState } from 'react';
import axios from 'axios';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [size, setSize] = useState('');
  const [religions, setReligions] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async () => {
    if (!files.length) {
      return alert('Please select at least one image.');
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    files.forEach(file => formData.append('images[]', file)); // multiple images
    formData.append('title', title);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('price', price);
    formData.append('instagramUrl', instagramUrl);
    formData.append('size', size);
    formData.append('religions', religions);
    formData.append('seoTitle', seoTitle);
    formData.append('seoDescription', seoDescription);
    formData.append('seoKeywords', seoKeywords);

    try {
      const res = await axios.post('https://idbackend-rf1u.onrender.com/api/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Uploaded successfully!');
      setFiles([]);
      setTitle('');
      setCategory('');
      setSubcategory('');
      setPrice('');
      setInstagramUrl('');
      setSize('');
      setReligions('');
      setSeoTitle('');
      setSeoDescription('');
      setSeoKeywords('');
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Design</h1>
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
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Subcategory"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <input
          type="url"
          placeholder="Instagram URL"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Religions"
          value={religions}
          onChange={(e) => setReligions(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="SEO Title"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <textarea
          placeholder="SEO Description"
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="SEO Keywords"
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          onClick={handleUpload}
          className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
