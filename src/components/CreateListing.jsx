// Full enhanced version with table showing all fields, edit/delete modal, image preview
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Dropdown from './Dropdown';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

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

  const fileInputRef = useRef(null);

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
      toast.error('Dropdown fetch failed.');
    }
  };

  const fetchListings = async () => {
    try {
      const res = await axios.get('/api/listings');
      setListings(res.data || []);
    } catch (err) {
      toast.error('Listing fetch failed.');
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
    if (filtered.length + images.length > 10) return toast.error("Max 10 images allowed.");

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
      return toast.warn("Fill all required fields and upload images.");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(img => formData.append('images', img));

    try {
      if (isEditing) {
        await axios.put(`/api/listings/${form._id}`, formData);
        toast.success("Listing updated");
      } else {
        await axios.post('/api/listings', formData);
        toast.success("Listing created");
      }
      fetchListings();
      setShowModal(false);
      setIsEditing(false);
      setForm({ title: '', category: '', subcategory: '', price: '', instagramUrl: '', size: '', religions: '', seoTitle: '', seoDescription: '', seoKeywords: '', discount: '', Description: '', MOQ: '', favorite: '', _id: '' });
      setImages([]);
      setPreviewImages([]);
    } catch (err) {
      toast.error('Submission failed.');
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
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredListings = listings.filter(item => item.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Listings</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ New Listing</button>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title..."
        className="w-full p-2 mb-4 border border-gray-300 rounded" />

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Subcategory</th>
              <th className="p-2">Price</th>
              <th className="p-2">Instagram</th>
              <th className="p-2">Size</th>
              <th className="p-2">Religion</th>
              <th className="p-2">SEO Title</th>
              <th className="p-2">Discount</th>
              <th className="p-2">MOQ</th>
              <th className="p-2">Favorite</th>
              <th className="p-2">Images</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.subcategory}</td>
                <td className="p-2">{item.price}</td>
                <td className="p-2">{item.instagramUrl}</td>
                <td className="p-2">{item.size}</td>
                <td className="p-2">{item.religions}</td>
                <td className="p-2">{item.seoTitle}</td>
                <td className="p-2">{item.discount}</td>
                <td className="p-2">{item.MOQ}</td>
                <td className="p-2">{item.favorite}</td>
                <td className="p-2">
                  {(item.images || []).slice(0, 1).map((img, i) => (
                    <img key={i} src={img} alt="img" className="w-12 h-12 object-cover rounded" />
                  ))}
                </td>
                <td className="p-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 overflow-y-auto max-h-screen relative">
            <button onClick={() => { setShowModal(false); setIsEditing(false); }} className="absolute top-3 right-4 text-xl font-bold text-gray-600">&times;</button>
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit' : 'New'} Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={form.title} onChange={handleInputChange('title')} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Category" value={form.category} onChange={handleInputChange('category')} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Subcategory" value={form.subcategory} onChange={handleInputChange('subcategory')} className="w-full p-2 border rounded" />
              <input type="number" placeholder="Price" value={form.price} onChange={handleInputChange('price')} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Instagram URL" value={form.instagramUrl} onChange={handleInputChange('instagramUrl')} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Size" value={form.size} onChange={handleInputChange('size')} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Religions" value={form.religions} onChange={handleInputChange('religions')} className="w-full p-2 border rounded" />
              <input type="text" placeholder="SEO Title" value={form.seoTitle} onChange={handleInputChange('seoTitle')} className="w-full p-2 border rounded" />
              <input type="text" placeholder="SEO Description" value={form.seoDescription} onChange={handleInputChange('seoDescription')} className="w-full p-2 border rounded" />
              <input type="text" placeholder="SEO Keywords" value={form.seoKeywords} onChange={handleInputChange('seoKeywords')} className="w-full p-2 border rounded" />
              <input type="number" placeholder="Discount" value={form.discount} onChange={handleInputChange('discount')} className="w-full p-2 border rounded" />
              <input type="number" placeholder="MOQ" value={form.MOQ} onChange={handleInputChange('MOQ')} className="w-full p-2 border rounded" />
              <textarea placeholder="Description" value={form.Description} onChange={handleInputChange('Description')} className="w-full p-2 border rounded" />
              <input type="number" placeholder="Favorite" value={form.favorite} onChange={handleInputChange('favorite')} className="w-full p-2 border rounded" />
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="w-full" />
              <div className="flex flex-wrap gap-4">
                {previewImages.map((img, idx) => (
                  <img key={idx} src={img.url} alt="preview" className="w-20 h-20 object-cover rounded" />
                ))}
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEditing ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateListing;
