// Fixed CreateListing component
// - Modal now works for + New Listing and Edit
// - Delete includes confirmation
// - Table shows proper category/subcategory/religion names

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const CreateListing = () => {
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
  const [listings, setListings] = useState([]);
  const [dropdownData, setDropdownData] = useState({ categories: [], subcategories: [], religions: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDropdowns();
    fetchListings();
  }, []);

  const fetchDropdowns = async () => {
    const [categoryRes, subcategoryRes, religionRes] = await Promise.all([
      axios.get('/api/categories/'),
      axios.get('/api/subcategories'),
      axios.get('/api/religions/GetReligionList'),
    ]);
    setDropdownData({
      categories: categoryRes.data || [],
      subcategories: subcategoryRes.data || [],
      religions: religionRes.data || []
    });
  };

  const fetchListings = async () => {
    const res = await axios.get('/api/listings');
    setListings(res.data || []);
  };

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const filtered = files.filter(file => validTypes.includes(file.type));
    const newImages = [];
    for (const file of filtered) {
      const compressedBlob = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
      newImages.push(new File([compressedBlob], file.name, { type: compressedBlob.type }));
    }
    setImages(newImages);
    setPreviewImages(newImages.map(file => ({ url: URL.createObjectURL(file) })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(img => formData.append('images', img));

    if (editId) {
      await axios.put(`/api/listings/${editId}`, formData);
    } else {
      await axios.post('/api/listings', formData);
    }

    setForm({ title: '', category: '', subcategory: '', religions: '', price: '', MOQ: '' });
    setImages([]);
    setPreviewImages([]);
    setEditId(null);
    setShowModal(false);
    fileInputRef.current.value = '';
    fetchListings();
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      category: item.category_uuid,
      subcategory: item.subcategory_uuid,
      religions: item.religion_uuid,
      price: item.price,
      MOQ: item.MOQ
    });
    setEditId(item._id);
    setImages([]);
    setPreviewImages([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmDelete) return;
    await axios.delete(`/api/listings/${id}`);
    fetchListings();
  };

  const filteredListings = listings.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getName = (uuid, type) => {
    const list = dropdownData[type];
    const found = list.find(item => item[`${type.slice(0, -1)}_uuid`] === uuid);
    return found?.name || '';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded w-1/3"
        />
        <button
          onClick={() => {
            setShowModal(true);
            setForm({ title: '', category: '', subcategory: '', religions: '', price: '', MOQ: '' });
            setEditId(null);
            setImages([]);
            setPreviewImages([]);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Listing
        </button>
      </div>

      <table className="w-full table-auto bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Subcategory</th>
            <th className="px-4 py-2">Religion</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">MOQ</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredListings.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{item.title}</td>
              <td className="px-4 py-2">{getName(item.category_uuid, 'categories')}</td>
              <td className="px-4 py-2">{getName(item.subcategory_uuid, 'subcategories')}</td>
              <td className="px-4 py-2">{getName(item.religion_uuid, 'religions')}</td>
              <td className="px-4 py-2">{item.price}</td>
              <td className="px-4 py-2">{item.MOQ}</td>
              <td className="px-4 py-2 space-x-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Listing' : 'New Listing'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={form.title} onChange={handleInputChange('title')} placeholder="Title" className="w-full p-2 border rounded" required />
              <select value={form.category} onChange={handleInputChange('category')} className="w-full p-2 border rounded" required>
                <option value="">Select Category</option>
                {dropdownData.categories.map(c => <option key={c.category_uuid} value={c.category_uuid}>{c.name}</option>)}
              </select>
              <select value={form.subcategory} onChange={handleInputChange('subcategory')} className="w-full p-2 border rounded" required>
                <option value="">Select Subcategory</option>
                {dropdownData.subcategories.map(s => <option key={s.subcategory_uuid} value={s.subcategory_uuid}>{s.name}</option>)}
              </select>
              <select value={form.religions} onChange={handleInputChange('religions')} className="w-full p-2 border rounded" required>
                <option value="">Select Religion</option>
                {dropdownData.religions.map(r => <option key={r.religion_uuid} value={r.religion_uuid}>{r.name}</option>)}
              </select>
              <input type="text" value={form.price} onChange={handleInputChange('price')} placeholder="Price" className="w-full p-2 border rounded" required />
              <select value={form.MOQ} onChange={handleInputChange('MOQ')} className="w-full p-2 border rounded" required>
                <option value="">Select MOQ</option>
                <option value="1">1</option>
                <option value="0">0</option>
              </select>
              <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="w-full" />
              <div className="flex gap-2 flex-wrap">
                {previewImages.map((img, idx) => <img key={idx} src={img.url} className="w-16 h-16 object-cover rounded" />)}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateListing;
