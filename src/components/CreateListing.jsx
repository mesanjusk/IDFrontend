// Enhanced version without react-toastify — replaced with Tailwind CSS alerts
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Dropdown from './Dropdown';

const CreateListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    _id: '', title: '', category: '', subcategory: '', price: '',
    instagramUrl: '', size: '', religions: '',
    seoTitle: '', seoDescription: '', seoKeywords: '',
    discount: '', Description: '', MOQ: '', favorite: ''
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    titles: [], categories: [], subcategories: [], instagramUrls: [],
    sizes: [], religions: [], seot: [], seod: [], seok: []
  });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fileInputRef = useRef(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 3000);
  };

  const safeExtract = (res) => Array.isArray(res?.data) ? res.data : res?.data?.result || [];

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
        titles: safeExtract(titleRes),
        categories: safeExtract(categoryRes),
        subcategories: safeExtract(subcategoryRes),
        instagramUrls: safeExtract(instagramUrlRes),
        sizes: safeExtract(sizeRes),
        religions: safeExtract(religionRes),
        seot: safeExtract(seotRes),
        seod: safeExtract(seodRes),
        seok: safeExtract(seokRes)
      });
    } catch (err) {
      showAlert('error', 'Dropdown fetch failed.');
    }
  };

  const fetchListings = async () => {
    try {
      const res = await axios.get('/api/listings');
      setListings(res.data || []);
    } catch (err) {
      showAlert('error', 'Listing fetch failed.');
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchListings();
  }, []);

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const filtered = files.filter(file => validTypes.includes(file.type));
    if (filtered.length + images.length > 10) return showAlert('error', "Max 10 images allowed.");

    const newImages = [];
    for (const file of filtered) {
      const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
      newImages.push(new File([compressed], file.name, { type: compressed.type }));
    }

    setImages(prev => [...prev, ...newImages]);
    setPreviewImages(prev => [...prev, ...newImages.map(f => ({ url: URL.createObjectURL(f), name: f.name }))]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, category, subcategory, price } = form;
    if (!title || !category || !subcategory || !price || (!isEditing && images.length === 0)) {
      return showAlert('warning', "Fill all required fields and upload images.");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(img => formData.append('images', img));

    try {
      if (isEditing) {
        await axios.put(`/api/listings/${form._id}`, formData);
        showAlert('success', "Listing updated");
      } else {
        await axios.post('/api/listings', formData);
        showAlert('success', "Listing created");
      }
      fetchListings();
      setShowModal(false);
      setIsEditing(false);
      setForm({ title: '', category: '', subcategory: '', price: '', instagramUrl: '', size: '', religions: '', seoTitle: '', seoDescription: '', seoKeywords: '', discount: '', Description: '', MOQ: '', favorite: '', _id: '' });
      setImages([]);
      setPreviewImages([]);
    } catch (err) {
      showAlert('error', 'Submission failed.');
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setShowModal(true);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await axios.delete(`/api/listings/${id}`);
      fetchListings();
      showAlert('success', "Deleted successfully");
    } catch {
      showAlert('error', "Delete failed");
    }
  };

  const filteredListings = listings.filter(item => item.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {alert.message && (
        <div className={`mb-4 px-4 py-3 rounded text-white ${
          alert.type === 'success' ? 'bg-green-500' : alert.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        }`}>
          {alert.message}
        </div>
      )}

      {/* ... rest of the JSX remains unchanged ... */}
    </div>
  );
};

export default CreateListing;
