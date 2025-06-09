import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Dropdown from './Dropdown';

const CreateListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', category: '', subcategory: '', price: '',
    instagramUrl: '', size: '', religions: '',
    seoTitle: '', seoDescription: '', seoKeywords: '',
    discount: '', Description: '', MOQ: '', favorite: ''
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    titles: [], categories: [], subcategories: [], instagramUrls: [],
    sizes: [], religions: [], seot: [], seod: [], seok: []
  });
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const safeExtract = (res) => Array.isArray(res) ? res : res?.result || [];

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
      console.error('Dropdown error:', err);
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get('/api/listings');
      setListings(res.data || []);
    } catch (err) {
      console.error('Fetch listings error:', err);
    }
  };

  const handleInputChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const filtered = files.filter(file => validTypes.includes(file.type));
    if (filtered.length + images.length > 10) return alert("Max 10 images allowed.");
    const newImages = [];
    for (const file of filtered) {
      const compressedBlob = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
      const compressedFile = new File([compressedBlob], `${Date.now()}-${file.name}`, { type: compressedBlob.type });
      newImages.push(compressedFile);
    }
    const updated = [...images, ...newImages];
    setImages(updated);
    setPreviewImages(updated.map(f => ({ url: URL.createObjectURL(f), name: f.name })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.subcategory || !form.price || images.length === 0) return alert("Missing required fields.");
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(img => formData.append('images', img));
    try {
      await axios.post('/api/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
      });
      setShowModal(false);
      fetchListings();
    } catch (err) {
      alert('Upload failed.');
    }
  };

  const filteredListings = listings.filter(item => item.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Listings</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ New Listing</button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {filteredListings.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No listings found.</p>
      ) : (
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Subcategory</th>
              <th className="px-4 py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{item.title}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.subcategory}</td>
                <td className="px-4 py-2">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 overflow-y-auto max-h-screen relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">New Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Dropdown label="Title" options={dropdownData.titles} value={form.title} onChange={handleInputChange('title')} getLabel={o => o.name} />
              <Dropdown label="Category" options={dropdownData.categories} value={form.category} onChange={handleInputChange('category')} getLabel={o => o.name} />
              <Dropdown label="Subcategory" options={dropdownData.subcategories} value={form.subcategory} onChange={handleInputChange('subcategory')} getLabel={o => o.name} />
              <input type="text" placeholder="Price" value={form.price} onChange={handleInputChange('price')} className="w-full p-2 border rounded" />
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="w-full" />
              <div className="flex flex-wrap gap-4">
                {previewImages.map((img, idx) => (
                  <img key={idx} src={img.url} alt="preview" className="w-20 h-20 object-cover rounded" />
                ))}
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateListing;
