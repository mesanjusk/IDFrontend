import { useState, useRef, useEffect } from 'react';
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
    religions: []
  });

  const fileInputRef = useRef(null);

  // Fetch dropdown data from the backend
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await axios.get('https://your-api-endpoint.com/dropdown-data');
        setDropdownData(response.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchDropdownData();
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const filtered = files.filter(file => validTypes.includes(file.type));

    if (filtered.length !== files.length) {
      alert("Some files were skipped. Only JPG, PNG, WEBP allowed.");
    }

    const totalImages = filtered.length + images.length;
    if (totalImages > 10) {
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

        const timestamp = Date.now();
        const compressedFile = new File([compressedBlob], `${timestamp}-${file.name}`, {
          type: compressedBlob.type,
        });

        newImages.push(compressedFile);
      } catch (err) {
        console.error('Compression failed:', err);
      }
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    const newPreviews = updatedImages.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    }));

    setPreviewImages(newPreviews);
    setLoading(false);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previewImages];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setPreviewImages(updatedPreviews);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      alert("Images still processing...");
      return;
    }

    if (!form.title || !form.category || !form.subcategory || !form.price || images.length === 0) {
      alert("Please fill in required fields and upload at least one image.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    images.forEach(img => formData.append('images', img));

    try {
      const res = await axios.post(
        'https://idbackend-rf1u.onrender.com/api/listings',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
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

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Design</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
        {/* Dropdown fields */}
        {[
          { label: 'Title', name: 'title', options: dropdownData.titles },
          { label: 'Category', name: 'category', options: dropdownData.categories },
          { label: 'Subcategory', name: 'subcategory', options: dropdownData.subcategories },
          { label: 'Price', name: 'price', options: dropdownData.prices },
          { label: 'Instagram URL', name: 'instagramUrl', options: dropdownData.instagramUrls },
          { label: 'Size', name: 'size', options: dropdownData.sizes },
          { label: 'Religion', name: 'religions', options: dropdownData.religions }
        ].map(({ label, name, options }) => (
          <select
            key={name}
            className="px-4 py-2 border rounded-md"
            value={form[name]}
            onChange={handleInputChange(name)}
          >
            <option value="">Select {label}</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ))}

        {/* SEO text fields */}
        {['seoTitle', 'seoDescription', 'seoKeywords'].map((field) => (
          <input
            key={field}
            type="text"
            className="px-4 py-2 border rounded-md"
            placeholder={field.replace('seo', 'SEO ')}
            value={form[field]}
            onChange={handleInputChange(field)}
          />
        ))}

        {/* File upload */}
        <input
          className="px-4 py-2 border rounded-md"
          type="file"
          name="images"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        {/* Preview section */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative border rounded p-2 bg-white">
                <img src={img.url} alt={`preview-${idx}`} className="w-full h-32 object-cover rounded" />
                <p className="text-xs mt-1 truncate">{img.name}</p>
                <p className="text-xs text-gray-500">{img.size}</p>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-md overflow-hidden mt-2">
            <div
              className="bg-blue-500 text-white text-xs text-center p-1"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}% 
            </div>
          </div>
        )}

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
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
