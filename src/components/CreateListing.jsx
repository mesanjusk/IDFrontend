import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import Dropdown from './Dropdown';

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
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dropdownData, setDropdownData] = useState({
    titles: [],
    categories: [],
    subcategories: [],
    prices: [],
    instagramUrls: [],
    sizes: [],
    religions: [],
    seot: [],
    seod: [],
    seok: []
  });

  const fileInputRef = useRef(null);

  const safeExtract = (res) => {
    if (Array.isArray(res)) return res;
    if (res?.result) return res.result;
    return [];
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [
          titleRes, categoryRes, subcategoryRes, priceRes, instagramUrlRes,
          sizeRes, religionRes, seotRes, seodRes, seokRes
        ] = await Promise.all([
          axios.get('https://idbackend-rf1u.onrender.com/api/titles/GetTitleList'),
          axios.get('https://idbackend-rf1u.onrender.com/api/categories/'),
          axios.get('https://idbackend-rf1u.onrender.com/api/subcategories'),
          axios.get('https://idbackend-rf1u.onrender.com/api/prices/GetPriceList'),
          axios.get(https://idbackend-rf1u.onrender.com/api/instas/GetInstaList'),
          axios.get('https://idbackend-rf1u.onrender.com/api/sizes/GetSizeList'),
          axios.get('https://idbackend-rf1u.onrender.com/api/religions/GetReligionList'),
          axios.get('https://idbackend-rf1u.onrender.com/api/seots/GetSEOTitleList'),
          axios.get('https://idbackend-rf1u.onrender.com/api/seods/GetSEODesList'),
          axios.get('https://idbackend-rf1u.onrender.com/api/seoks/GetSEOKeyList')
        ]);

        setDropdownData({
          titles: safeExtract(titleRes.data),
          categories: safeExtract(categoryRes.data),
          subcategories: safeExtract(subcategoryRes.data),
          prices: safeExtract(priceRes.data),
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
  Object.entries(form).forEach(([key, value]) => formData.append(key, value));
  images.forEach(img => formData.append('images', img));

  // Log FormData content
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    await axios.post(
      'https://idbackend-rf1u.onrender.com/api/listings',
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
      seoTitle: '', seoDescription: '', seoKeywords: ''
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
        
        <Dropdown label="Title" options={dropdownData.titles} value={form.title} onChange={handleInputChange('title')} />
        <Dropdown label="Category" options={dropdownData.categories} value={form.category} onChange={handleInputChange('category')} />
        <Dropdown label="Subcategory" options={dropdownData.subcategories} value={form.subcategory} onChange={handleInputChange('subcategory')} />
        <Dropdown
  label="Price"
  options={Array.isArray(dropdownData.prices) ? dropdownData.prices.map(p => ({ _id: p._id, name: p.price })) : []}
  value={form.price}
  onChange={handleInputChange('price')}
/>

        <Dropdown label="Instagram URL" options={dropdownData.instagramUrls} value={form.instagramUrl} onChange={handleInputChange('instagramUrl')} />
        <Dropdown label="Size" options={dropdownData.sizes} value={form.size} onChange={handleInputChange('size')} />
        <Dropdown label="Religion" options={dropdownData.religions} value={form.religions} onChange={handleInputChange('religions')} />
        <Dropdown label="SEO Title" options={dropdownData.seot} value={form.seoTitle} onChange={handleInputChange('seoTitle')} />
        <Dropdown label="SEO Description" options={dropdownData.seod} value={form.seoDescription} onChange={handleInputChange('seoDescription')} />
        <Dropdown label="SEO Keywords" options={dropdownData.seok} value={form.seoKeywords} onChange={handleInputChange('seoKeywords')} />

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
