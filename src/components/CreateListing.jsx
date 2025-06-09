// Top remains same
import { useState, useRef, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import imageCompression from 'browser-image-compression';

const CreateListing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    title: '',
    category: '',
    subcategory: '',
    price: '',
    religions: '',
    discount: '',
    Description: '',
    MOQ: '',
    favorite: ''
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
      navigate("/login");
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

  const handleInputChange = (field) => (valueOrEvent) => {
    const value = valueOrEvent?.target?.value ?? valueOrEvent;
    setForm({ ...form, [field]: value });
  };

  // handleImageUpload, removeImage, handleSubmit remain unchanged...

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Design</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
        
        {/* Text input for Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange('title')}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter title"
          />
        </div>

        {/* Category Dropdown */}
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

        {/* Subcategory Dropdown */}
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

        {/* Price */}
        <input
          type="text"
          name="price"
          value={form.price}
          onChange={handleInputChange('price')}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter price"
        />

        {/* Religion Dropdown */}
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

        {/* MOQ */}
        <select
          value={form.MOQ}
          onChange={handleInputChange('MOQ')}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select MOQ</option>
          <option value="1">1</option>
          <option value="0">0</option>
        </select>

        {/* Favorite */}
        <select
          value={form.favorite}
          onChange={handleInputChange('favorite')}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Favorite</option>
          <option value="1">1</option>
          <option value="0">0</option>
        </select>

        {/* Discount */}
        <input
          type="text"
          name="discount"
          value={form.discount}
          onChange={handleInputChange('discount')}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter discount"
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          value={form.Description}
          onChange={handleInputChange('Description')}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter description"
        />

        {/* Image Upload and Submit Button remain unchanged */}

      </form>
    </div>
  );
};

export default CreateListing;
