import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = '/api/banners';

const UploadBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [bannerName, setBannerName] = useState('');
  const [bannerImages, setBannerImages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal and pagination
  const [previewImage, setPreviewImage] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, id: null, name: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(API_URL);
      setBanners(res.data.reverse()); // recent first
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 4 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      setError('Some files exceed 4MB and were excluded.');
    }
    setBannerImages(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerName || bannerImages.length === 0) {
      setError('Please provide a name and at least one image.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

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
      setSuccess('Banners uploaded successfully!');
      setBannerName('');
      setBannerImages([]);
      fetchBanners();
    } catch (err) {
      setError('Upload failed.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this banner?');
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBanners();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEditSubmit = async () => {
    if (!editModal.name.trim()) return;
    try {
      await axios.put(`${API_URL}/${editModal.id}`, { name: editModal.name });
      setEditModal({ open: false, id: null, name: '' });
      fetchBanners();
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(banners.length / itemsPerPage);
  const currentData = banners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Upload Banner</h2>

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
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-sm">{success}</p>}

      <h3 className="text-lg font-semibold mb-3">Uploaded Banners</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ban) => (
              <tr key={ban._id} className="text-center">
                <td className="p-2 border">
                  <img
                    src={ban.imageUrl}
                    alt={ban.name}
                    className="h-12 w-auto mx-auto object-contain cursor-pointer"
                    onClick={() => setPreviewImage(ban.imageUrl)}
                  />
                </td>
                <td className="p-2 border">{ban.name}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    onClick={() => setEditModal({ open: true, id: ban._id, name: ban.name })}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(ban._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-gray-500 text-center">
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>
        <span className="px-2 py-1 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

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

      {/* Edit Name Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-md w-full">
            <h2 className="text-lg font-semibold">Edit Banner Name</h2>
            <input
              value={editModal.name}
              onChange={(e) => setEditModal((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal({ open: false, id: null, name: '' })}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBanner;
