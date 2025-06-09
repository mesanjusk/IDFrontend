// Enhanced CreateListing with searchable dropdowns, numeric price validation, and thumbnail display in table

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
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
        const [categoryRes, subcategoryRes, religionRes, listingRes] = await Promise.all([
          axios.get('/api/categories/'),
          axios.get('/api/subcategories'),
          axios.get('/api/religions/GetReligionList'),
          axios.get('/api/listings')
        ]);
        setDropdownData({
          categories: safeExtract(categoryRes.data),
          subcategories: safeExtract(subcategoryRes.data),
          religions: safeExtract(religionRes.data)
        });
        setListings(listingRes.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data or listings:', error);
      }
    };

    fetchDropdowns();
  }, []);

  const handleInputChange = (field) => (e) => {
    const value = e?.target?.value ?? e;
    if (field === 'price' && value && !/^\d*\.?\d*$/.test(value)) return;
    setForm({ ...form, [field]: value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const filtered = files.filter(file => validTypes.includes(file.type));
    if (filtered.length !== files.length) alert('Some files were skipped. Only JPG, PNG, WEBP allowed.');
    if (filtered.length + images.length > 10) return alert('Max 10 images allowed.');
    setLoading(true);
    const newImages = [];
    for (const file of filtered) {
      const compressedBlob = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
      const compressedFile = new File([compressedBlob], `${Date.now()}-${file.name}`, { type: compressedBlob.type });
      newImages.push(compressedFile);
    }
    setImages(prev => [...prev, ...newImages]);
    setPreviewImages([...images, ...newImages].map(file => ({ url: URL.createObjectURL(file) })));
    setLoading(false);
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setPreviewImages(updated.map(file => ({ url: URL.createObjectURL(file) })));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return alert('Images still processing...');
    if (!form.title || !form.category || !form.subcategory || !form.price || images.length === 0) {
      return alert('Please fill in required fields and upload at least one image.');
    }
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(img => formData.append('images', img));
    try {
      await axios.post('/api/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
      });
      alert('Listing Created Successfully!');
      setForm({ title: '', category: '', subcategory: '', religions: '', price: '', MOQ: '' });
      setImages([]);
      setPreviewImages([]);
      setUploadProgress(0);
      fileInputRef.current.value = '';
      const res = await axios.get('/api/listings');
      setListings(res.data || []);
    } catch (err) {
      console.error('Upload failed:', err);
      alert(err?.response?.data?.error || 'Upload failed.');
    }
  };

  const getName = (uuid, type) => {
    const list = dropdownData[type];
    let key = '';
    if (type === 'categories') key = 'category_uuid';
    if (type === 'subcategories') key = 'subcategory_uuid';
    if (type === 'religions') key = 'religion_uuid';
    const found = Array.isArray(list) ? list.find(item => item[key] === uuid) : null;
    return found?.name || '';
  };

  const filteredListings = listings.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Upload Design</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-xl mx-auto">

        <input type="text" value={form.title} onChange={handleInputChange('title')} className="p-2 border rounded" placeholder="Enter title" required />

        <input list="categories" value={form.category} onChange={handleInputChange('category')} className="p-2 border rounded" placeholder="Search Category" required />
        <datalist id="categories">
          {dropdownData.categories.map(c => <option key={c.category_uuid} value={c.category_uuid}>{c.name}</option>)}
        </datalist>

        <input list="subcategories" value={form.subcategory} onChange={handleInputChange('subcategory')} className="p-2 border rounded" placeholder="Search Subcategory" required />
        <datalist id="subcategories">
          {dropdownData.subcategories.map(s => <option key={s.subcategory_uuid} value={s.subcategory_uuid}>{s.name}</option>)}
        </datalist>

        <input list="religions" value={form.religions} onChange={handleInputChange('religions')} className="p-2 border rounded" placeholder="Search Religion" required />
        <datalist id="religions">
          {dropdownData.religions.map(r => <option key={r.religion_uuid} value={r.religion_uuid}>{r.name}</option>)}
        </datalist>

        <input type="text" value={form.price} onChange={handleInputChange('price')} className="p-2 border rounded" placeholder="Enter price (numeric only)" required />

        <select value={form.MOQ} onChange={handleInputChange('MOQ')} className="p-2 border rounded" required>
          <option value="">Select MOQ</option>
          <option value="1">1</option>
          <option value="0">0</option>
        </select>

        <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageUpload} className="mb-2" />
        <div className="flex gap-2 flex-wrap">
          {previewImages.map((img, idx) => <img key={idx} src={img.url} className="w-20 h-20 object-cover rounded" />)}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? `Uploading... ${uploadProgress}%` : 'Create Listing'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-10 mb-4">All Listings</h2>
      <input type="text" placeholder="Search title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-4 p-2 border rounded w-full max-w-md" />

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-3 py-2">Image</th>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Subcategory</th>
            <th className="px-3 py-2">Religion</th>
            <th className="px-3 py-2">Price</th>
            <th className="px-3 py-2">MOQ</th>
          </tr>
        </thead>
        <tbody>
          {filteredListings.map((item, i) => (
            <tr key={i} className="border-t text-sm text-center">
              <td className="px-3 py-2">
                <img src={item.images?.[0]?.url || '/placeholder.jpg'} className="w-14 h-14 object-cover rounded" alt="Thumb" />
              </td>
              <td className="px-3 py-2">{item.title}</td>
              <td className="px-3 py-2">{getName(item.category_uuid, 'categories')}</td>
              <td className="px-3 py-2">{getName(item.subcategory_uuid, 'subcategories')}</td>
              <td className="px-3 py-2">{getName(item.religion_uuid, 'religions')}</td>
              <td className="px-3 py-2">{item.price}</td>
              <td className="px-3 py-2">{item.MOQ}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateListing;
