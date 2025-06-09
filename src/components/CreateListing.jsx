import { useState, useRef, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import Dropdown from './Dropdown';

const CreateListing = () => {
  const navigate = useNavigate();
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
    seoKeywords: '',
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
    titles: [],
    categories: [],
    subcategories: [],
    instagramUrls: [],
    sizes: [],
    religions: [],
    seot: [],
    seod: [],
    seok: [],
  });

  const fileInputRef = useRef(null);

  const safeExtract = (res) => {
    if (Array.isArray(res)) return res;
    if (res?.result) return res.result;
    return [];
  };

 useEffect(() => {
          setTimeout(() => {
            const userNameFromState = location.state?.id;
            const user = userNameFromState || localStorage.getItem('User_name');
            setLoggedInUser(user);
            if (user) {
             setLoggedInUser(user)
            } else {
              navigate("/login");
            }
          }, 2000);
          setTimeout(() => setLoading(false), 2000);
        }, [location.state, navigate]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [
          titleRes, categoryRes, subcategoryRes, instagramUrlRes,
          sizeRes, religionRes, seotRes, seodRes, seokRes
        ] = await Promise.all([
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
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdowns();
  }, []);

  const selectedCategory = dropdownData.categories.find(c => c.category_uuid === form.category) || null;
const selectedSubcategory = dropdownData.subcategories.find(s => s.subcategory_uuid === form.subcategory) || null;

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const filtered = files.filter(file => validTypes.includes(file.type));

    if (filtered.length !== files.length) {
      alert("Some files were skipped. Only JPG, PNG, WEBP allowed.");
    }

    if (filtered.length + images.length > 10) {
      alert("Max 10 images allowed.");
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

    if (loading) return alert("Images still processing...");
    if (!form.title || !form.category || !form.subcategory || !form.price || images.length === 0) {
      return alert("Please fill in required fields and upload at least one image.");
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, key === 'name' ? Number(value) : value);
    });

    images.forEach(img => formData.append('images', img));

    try {
      await axios.post(
        '/api/listings',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        }
      );

      alert('Listing Created Successfully!');
      setForm({
        title: '', category: '', subcategory: '', price: '',
        instagramUrl: '', size: '', religions: '',
        seoTitle: '', seoDescription: '', seoKeywords: '', discount: '',
    Description: '',
    MOQ: '',
    favorite: ''
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
        <Dropdown
          label="Title"
          options={dropdownData?.titles || []}
          value={form.title}
          onChange={handleInputChange('title')}
          getLabel={(option) => option.name} // Get the display label
        />
        <Dropdown
          label="Category"
          options={dropdownData?.categories || []}
          value={selectedCategory}
          onChange={handleInputChange('category')}
          getLabel={(option) => option.name}
        />
        <Dropdown
          label="Subcategory"
          options={dropdownData?.subcategories || []}
          value={selectedSubcategory}
          onChange={handleInputChange('subcategory')}
          getLabel={(option) => option.name}
        />
        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
  <input
    type="text"
    name="price"
    value={form.price}
    onChange={handleInputChange('price')}
    className="w-full p-2 border border-gray-300 rounded-md"
    placeholder="Enter price"
  />
</div>
        <Dropdown
          label="Instagram URL"
          options={dropdownData?.instagramUrls || []}
          value={form.instagramUrl}
          onChange={handleInputChange('instagramUrl')}
          getLabel={(option) => option.name}
        />
        <Dropdown
          label="Size"
          options={dropdownData?.sizes || []}
          value={form.size}
          onChange={handleInputChange('size')}
          getLabel={(option) => option.name}
        />
        <Dropdown
          label="Religion"
          options={dropdownData?.religions || []}
          value={form.religions}
          onChange={handleInputChange('religions')}
          getLabel={(option) => option.name}
        />
        <Dropdown
          label="SEO Title"
          options={dropdownData?.seot || []}
          value={form.seoTitle}
          onChange={handleInputChange('seoTitle')}
          getLabel={(option) => option.name}
        />
        <Dropdown
          label="SEO Description"
          options={dropdownData?.seod || []}
          value={form.seoDescription}
          onChange={handleInputChange('seoDescription')}
          getLabel={(option) => option.name}
        />
        <Dropdown
          label="SEO Keywords"
          options={dropdownData?.seok || []}
          value={form.seoKeywords}
          onChange={handleInputChange('seoKeywords')}
          getLabel={(option) => option.name}
        />
       <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">MOQ</label>
  <select
    name="moq"
    value={form.MOQ}
    onChange={handleInputChange('MOQ')}
    className="w-full p-2 border border-gray-300 rounded-md"
  >
    <option value="">Select...</option>
   <option value="1">1</option>
   <option value="0">0</option>
  </select>
</div>

       <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Favorite</label>
  <select
    name="favorite"
    value={form.favorite}
    onChange={handleInputChange('favorite')}
    className="w-full p-2 border border-gray-300 rounded-md"
  >
    <option value="">Select...</option>
   <option value="0">0</option>
   <option value="1">1</option>
  </select>
</div>
 <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
  <input
    type="text"
    name="discount"
    value={form.discount}
    onChange={handleInputChange('discount')}
    className="w-full p-2 border border-gray-300 rounded-md"
    placeholder="Enter discount"
  />
</div>
 <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
  <input
    type="text"
    name="description"
    value={form.Description}
    onChange={handleInputChange('Description')}
    className="w-full p-2 border border-gray-300 rounded-md"
    placeholder="Enter description"
  />
</div>
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
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">×</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 rounded-md">
          {loading ? `Uploading... ${uploadProgress}%` : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
