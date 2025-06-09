import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import Dropdown from './Dropdown';

const CreateListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', category: '', subcategory: '', price: '',
    instagramUrl: '', size: '', religions: '',
    seoTitle: '', seoDescription: '', seoKeywords: '', discount: '',
    Description: '', MOQ: '', favorite: ''
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [dropdownData, setDropdownData] = useState({
    titles: [], categories: [], subcategories: [], instagramUrls: [],
    sizes: [], religions: [], seot: [], seod: [], seok: []
  });
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const safeExtract = (res) => Array.isArray(res) ? res : res?.result || [];

  useEffect(() => {
    const user = location.state?.id || localStorage.getItem('User_name');
    setLoggedInUser(user);
    if (!user) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [titleRes, categoryRes, subcategoryRes, instagramUrlRes, sizeRes, religionRes, seotRes, seodRes, seokRes] = await Promise.all([
          axios.get('/api/titles/GetTitleList'),
          axios.get('/api/categories/'),
          axios.get('/api/subcategories'),
          axios.get('/api/instas/GetInstaList'),
          axios.get('/api/sizes/GetSizeList'),
          axios.get('/api/religions/GetReligionList'),
          axios.get('/api/seots/GetSEOTitleList'),
          axios.get('/api/seods/GetSEODesList'),
          axios.get('/api/seoks/GetSEOKeyList')
        ]);
        setDropdownData({
          titles: safeExtract(titleRes.data),
          categories: safeExtract(categoryRes.data),
          subcategories: safeExtract(subcategoryRes.data),
          instagramUrls: safeExtract(instagramUrlRes.data),
          sizes: safeExtract(sizeRes.data),
          religions: safeExtract(religionRes.data),
          seot: safeExtract(seotRes.data),
          seod: safeExtract(seodRes.data),
          seok: safeExtract(seokRes.data)
        });
      } catch (err) {
        console.error('Dropdown fetch error:', err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleInputChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).filter(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type));
    if (files.length + images.length > 10) return alert("Max 10 images allowed.");

    setLoading(true);
    const newImages = [];
    for (const file of files) {
      const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
      newImages.push(new File([compressed], `${Date.now()}-${file.name}`, { type: compressed.type }));
    }
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    setPreviewImages(updatedImages.map(f => ({ url: URL.createObjectURL(f), name: f.name })));
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.subcategory || !form.price || !images.length) return alert("Fill all fields");
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(img => formData.append('images', img));

    try {
      await axios.post('/api/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
      });
      alert('Listing Created Successfully');
      setForm({ title: '', category: '', subcategory: '', price: '', instagramUrl: '', size: '', religions: '', seoTitle: '', seoDescription: '', seoKeywords: '', discount: '', Description: '', MOQ: '', favorite: '' });
      setImages([]); setPreviewImages([]); fileInputRef.current.value = '';
    } catch (err) {
      alert('Upload failed.');
    }
  };

  const filteredTitles = dropdownData.titles.filter(t => t.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Create New Listing</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ New Listing</button>
      </div>
      <input
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Subcategory</th>
          </tr>
        </thead>
        <tbody>
          {filteredTitles.length === 0 ? (
            <tr><td colSpan="4" className="text-center p-4">No data found</td></tr>
          ) : (
            filteredTitles.map((item, idx) => (
              <tr key={idx} className="border">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.price || '-'}</td>
                <td className="p-2 border">{item.category || '-'}</td>
                <td className="p-2 border">{item.subcategory || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-full max-w-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-lg">×</button>
            <h2 className="text-lg font-bold mb-4">Add New Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Existing dropdowns and inputs reused here */}
              {/* Reuse from original CreateListing code */}
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateListing;
