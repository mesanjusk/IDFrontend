import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = '/api/categories';

const UploadCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [usedCategoryNames, setUsedCategoryNames] = useState([]);
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    const userNameFromState = location.state?.id;
    const user = userNameFromState || localStorage.getItem('User_name');
    if (!user) {
      navigate('/login');
      return;
    }
    setLoggedInUser(user);
    fetchCategories();
  }, [location.state, navigate]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
      setFilteredCategories(res.data);
      setUsedCategoryNames(res.data.map((cat) => cat.name.toLowerCase()));
      setError('');
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = categoryName.trim();
    if (!name || !categoryImage) {
      setError('Please provide both category name and image.');
      return;
    }
    if (usedCategoryNames.includes(name.toLowerCase())) {
      setError('Category name already exists.');
      return;
    }
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', categoryImage);
    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Category uploaded successfully!');
      setCategoryName('');
      setCategoryImage(null);
      setPreviewImage(null);
      fetchCategories();
    } catch (err) {
      setError('Error uploading category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccess('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category. Please try again.');
    }
  };

  const openImageModal = (imageUrl) => {
    setModalImageSrc(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageSrc(null);
  };

  const openEditModal = (cat) => {
    setEditCategoryId(cat._id);
    setEditCategoryName(cat.name);
    setEditCategoryImage(null);
    setEditPreviewImage(cat.imageUrl);
    setIsEditModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditCategoryImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitEdit = async () => {
    const name = editCategoryName.trim();
    if (!name) {
      setError('Category name cannot be empty.');
      return;
    }
    if (
      usedCategoryNames.includes(name.toLowerCase()) &&
      name.toLowerCase() !==
        categories.find((cat) => cat._id === editCategoryId)?.name.toLowerCase()
    ) {
      setError('Another category with this name already exists.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    if (editCategoryImage) {
      formData.append('image', editCategoryImage);
    }
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_URL}/${editCategoryId}`, formData);
      setSuccess('Category name updated!');
      fetchCategories();
      closeEditModal();
    } catch (err) {
      setError('Failed to update category name.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* UI markup remains same as your working version */}
    </div>
  );
};

export default UploadCategory;
