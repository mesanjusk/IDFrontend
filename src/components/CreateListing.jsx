import { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const CreateListing = () => {
  const [form, setForm] = useState({
    title: '',
    category: '',
    subcategory: '',
    price: '',
    instagramUrl: '',
    size: '',
    religions: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const compressedFiles = [];

    setLoading(true);

    for (const file of files) {
      try {
        const compressedBlob = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const compressedFile = new File([compressedBlob], file.name, {
          type: compressedBlob.type,
        });

        compressedFiles.push(compressedFile);
      } catch (err) {
        console.error('Compression failed:', err);
      }
    }

    setImages(compressedFiles);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      alert("Please wait, images are still being processed...");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (images.length > 0) {
      images.forEach((img) => {
        formData.append('images', img);
      });
    } else {
      console.log("No images selected for upload.");
    }

    try {
      const res = await axios.post('https://idbackend-rf1u.onrender.com/api/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Listing Created!');
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Upload failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Design</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">

        <select className="px-4 py-2 border rounded-md" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}>
          <option value="">Select Title</option>
          <option value="Elegant Wedding">Elegant Wedding</option>
          <option value="Minimal Birthday">Minimal Birthday</option>
          <option value="Corporate Event">Corporate Event</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Select Category</option>
          <option value="Wedding">Wedding</option>
          <option value="Birthday">Birthday</option>
          <option value="Corporate">Corporate</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })}>
          <option value="">Select Subcategory</option>
          <option value="Invitation">Invitation</option>
          <option value="Flyer">Flyer</option>
          <option value="Banner">Banner</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}>
          <option value="">Select Price</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}>
          <option value="">Select Instagram URL</option>
          <option value="https://instagram.com/example1">example1</option>
          <option value="https://instagram.com/example2">example2</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
          <option value="">Select Size</option>
          <option value="A4">A4</option>
          <option value="A5">A5</option>
          <option value="Square">Square</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.religions} onChange={(e) => setForm({ ...form, religions: e.target.value })}>
          <option value="">Select Religion</option>
          <option value="Hindu">Hindu</option>
          <option value="Muslim">Muslim</option>
          <option value="Christian">Christian</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}>
          <option value="">Select SEO Title</option>
          <option value="Best Wedding Card">Best Wedding Card</option>
          <option value="Unique Flyer Design">Unique Flyer Design</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}>
          <option value="">Select SEO Description</option>
          <option value="Elegant, printable design">Elegant, printable design</option>
          <option value="Modern editable PSD">Modern editable PSD</option>
        </select>

        <select className="px-4 py-2 border rounded-md" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}>
          <option value="">Select SEO Keywords</option>
          <option value="wedding,card,template">wedding,card,template</option>
          <option value="flyer,invitation,design">flyer,invitation,design</option>
        </select>

        <input
          className="px-4 py-2 border rounded-md"
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />

        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
