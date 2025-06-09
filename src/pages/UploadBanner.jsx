// Updated UploadBanner.jsx with required enhancements

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = '/api/banners';

const UploadBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [bannerName, setBannerName] = useState('');
  const [bannerImages, setBannerImages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, id: null, name: '' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const userFromState = location.state?.id;
    const storedUser = userFromState || localStorage.getItem('User_name');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setLoggedInUser(storedUser);
    fetchBanners();
  }, [location.state, navigate]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(API_URL);
      setBanners(res.data.reverse());
    } catch (err) {
      toast.error('Failed to fetch banners');
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 4 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      toast.error('Some files exceed 4MB and were excluded.');
    }
    setBannerImages(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bannerName || bannerImages.length === 0) {
      toast.error('Please provide a name and at least one image.');
      return;
    }
    const uploads = bannerImages.map(async (image) => {
      const formData = new FormData();
      formData.append('name', bannerName);
      formData.append('image', image);
      return axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });
    try {
      await Promise.all(uploads);
      toast.success('Banners uploaded successfully!');
      setBannerName('');
      setBannerImages([]);
      fetchBanners();
    } catch (err) {
      toast.error('Upload failed.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      toast.success('Banner deleted.');
      setDeleteId(null);
      fetchBanners();
    } catch (err) {
      toast.error('Delete failed.');
      console.error(err);
    }
  };

  const handleEditSubmit = async () => {
    if (!editModal.name.trim()) return;
    try {
      await axios.put(`${API_URL}/${editModal.id}`, { name: editModal.name });
      toast.success('Banner updated.');
      setEditModal({ open: false, id: null, name: '' });
      fetchBanners();
    } catch (err) {
      toast.error('Edit failed.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Banner</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          value={bannerName}
          onChange={(e) => setBannerName(e.target.value)}
          placeholder="Banner Name"
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        {bannerImages.length > 0 && (
          <div className="text-sm text-gray-600">
            {bannerImages.map((img, idx) => (
              <div key={idx}>{img.name}</div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Uploaded Banners</h3>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No banners found.
              </td>
            </tr>
          ) : (
            banners.map((ban) => (
              <tr key={ban._id} className="text-center">
                <td className="p-2 border">
                  <img
                    src={ban.imageUrl}
                    alt={ban.name}
                    className="h-12 mx-auto cursor-pointer"
                    onClick={() => setPreviewImage(ban.imageUrl)}
                  />
                </td>
                <td className="p-2 border">{ban.name}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => setEditModal({ open: true, id: ban._id, name: ban.name })}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setDeleteId(ban._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded shadow-lg max-w-lg">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✖
            </button>
            <img src={previewImage} alt="Preview" className="max-h-[75vh] object-contain mx-auto" />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Banner Name</h2>
            <input
              value={editModal.name}
              onChange={(e) => setEditModal((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal({ open: false, id: null, name: '' })}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center space-y-4">
            <p className="text-lg">Are you sure you want to delete this banner?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBanner;
