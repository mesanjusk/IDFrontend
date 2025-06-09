// Final cleaned version of CreateListing component
// - Removed: Description, Discount, Favorite
// - Cleaned form state, reset logic, and UI

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const CreateListing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    title: '',
    category: '',
    subcategory: '',
    religions: '',
    price: '',
    MOQ: ''
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [dropdownData, setDropdownData] = useState({
    categories: [],
    subcategories: [],
    religions: []
  });

  const fileInputRef = useRef(null);

  const safeExtract = (res) => {
    if (Array.isArray(res)) return res;
    if (res?.result) return res.result;
    return [];
  };

  useEffect(() => {
    const userNameFromState = location.state?.id;
    const user = userNameFromState || localStorage.getItem('User_name');
    if (user) {
      setLoggedInUser(user);
    } else {
      navigate('/login');
    }
    setTimeout(() => setLoading(false), 2000);
  }, [location.state, navigate]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [categoryRes, subcategoryRes, religionRes] = await Promise.all([
          axios.get('/api/categories/'),
          axios.get('/api/subcategories'),
          axios.get('/api/religions/GetReligionList'),
        ]);
        setDropdownData({
          categories: safeExtract(categoryRes.data),
          subcategories: safeExtract(subcategoryRes.data),
          religions: safeExtract(religionRes.data),
        });
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdowns();
  }, []);

  const handleInputChange = (field) => (e) => {
    const value = e?.target?.value ?? e;
    setForm({ ...form, [field]: value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const filtered = files.filter(file => validTypes.includes(file.type));

    if (filtered.length !== files.length) {
      alert('Some files were skipped. Only JPG, PNG, WEBP allowed.');
    }

    if (filtered.length + images.length > 10) {
      alert('Max 10 images allowed.');
      return;
    }

    setLoading(true);
    const newImages = [];

    for (const file of filtered) {
      try {
        const alreadyExists = images.some(img => img.name === file.name && img.size === file.size);
        if (alreadyExists) continue;

        const compressedBlob = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const compressedFile = new File([compressedBlob], `${Date.now()}-${file.name}`, {
          type: compressedBlob.type,
        });

        newImages.push(compressedFile);
      } catch (err) {
        console.error('Compression failed:', err);
      }
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    setPreviewImages(updatedImages.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    })));
    setLoading(false);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewImages(updatedImages.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    })));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return alert('Images still processing...');
    if (!form.title || !form.category || !form.subcategory || !form.price || images.length === 0) {
      return alert('Please fill in required fields and upload at least one image.');
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach(img => formData.append('images', img));

    try {
      await axios.post('/api/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        }
      });

      alert('Listing Created Successfully!');
      setForm({
        title: '',
        category: '',
        subcategory: '',
        religions: '',
        price: '',
        MOQ: ''
      });
      setImages([]);
      setPreviewImages([]);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
      alert(err?.response?.data?.error || 'Upload failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Design</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleInputChange('title')}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter title"
        />

        <select
          value={form.category}
          onChange={handleInputChange('category')}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Category</option>
          {dropdownData.categories.map((c) => (
            <option key={c.category_uuid} value={c.category_uuid}>{c.name}</option>
          ))}
        </select>

        <select
          value={form.subcategory}
          onChange={handleInputChange('subcategory')}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Subcategory</option>
          {dropdownData.subcategories.map((s) => (
            <option key={s.subcategory_uuid} value={s.subcategory_uuid}>{s.name}</option>
          ))}
        </select>

        <select
          value={form.religions}
          onChange={handleInputChange('religions')}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Religion</option>
          {dropdownData.religions.map((r) => (
            <option key={r.religion_uuid} value={r.religion_uuid}>{r.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="price"
          value={form.price}
          onChange={handleInputChange('price')}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter price"
        />

        <select
          value={form.MOQ}
          onChange={handleInputChange('MOQ')}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select MOQ</option>
          <option value="1">1</option>
          <option value="0">0</option>
        </select>

        <div className="flex flex-col items-center">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          <div className="flex flex-wrap gap-4">
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img.url} alt={`Preview ${idx}`} className="w-24 h-24 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-md"
        >
          {loading ? `Uploading... ${uploadProgress}%` : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
