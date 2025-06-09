import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddConfi() {
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [logo, setLogo] = useState(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
     const [fb, setFB] = useState('');
    const [insta, setInsta] = useState('');
    const [twitter, setTwitter] = useState('');
    const [linkedIn, setLinkedIn] = useState('');
    const [config, setConfig] = useState([]);
const [editConfigImage, setEditConfigImage] = useState(null);
const [editPreviewImage, setEditPreviewImage] = useState(null);
const [usedConfigNames, setUsedConfigNames] = useState([]);
     const [isImageModalOpen, setIsImageModalOpen] = useState(false);
      const [modalImageSrc, setModalImageSrc] = useState(null);
    
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [editConfigId, setEditConfigId] = useState(null);
      const [editConfigName, setEditConfigName] = useState('');

    useEffect(() => {
        setTimeout(() => {
            const userNameFromState = location.state?.id;
            const user = userNameFromState || localStorage.getItem('User_name');
            setLoggedInUser(user);
            if (!user) navigate("/login");
        }, 2000);
        setTimeout(() => setIsLoading(false), 2000);
    }, [location?.state, navigate]);

    const fetchConfig = async () => {
  try {
    const response = await axios.get("/api/confi/GetConfiList");
    const configArray = Array.isArray(response.data.result) ? response.data.result : [];
    setConfig(configArray);
    setUsedConfigNames(configArray.map((c) => c.name.toLowerCase()));
  } catch (err) {
    console.error("Error fetching config:", err);
  }
};

useEffect(() => {
  fetchConfig();
}, []);



    async function submit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('logo', logo);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
         formData.append('fb', fb);
        formData.append('insta', insta);
        formData.append('twitter', twitter);
        formData.append('linkedIn', linkedIn);

        try {
            const res = await axios.post("/api/confi/add", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data === "exist") {
                alert("Configuration already exists");
            } else if (res.data === "notexist") {
                alert("Configuration added successfully");
                navigate("/admin");
            }
        } catch (e) {
            alert("Error uploading data");
            console.log(e);
        }
    }

     const openImageModal = (logo) => {
    setModalImageSrc(logo);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageSrc(null);
  };

  const openEditModal = (c) => {
    setEditConfigId(c._id);
    setEditConfigName(c.name);
     setEditConfigImage(null);
  setEditPreviewImage(c.logo);
   setEmail(c.email);
  setPhone(c.phone);
  setAddress(c.address);
  setFB(c.fb);
  setInsta(c.insta);
  setTwitter(c.twitter);
  setLinkedIn(c.linkedIn);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditConfigId(null);
    setEditConfigName('');
      setEditConfigImage(null);
  setEditPreviewImage(null);

  // clear edit fields
  setEmail('');
  setPhone('');
  setAddress('');
  setFB('');
  setInsta('');
  setTwitter('');
  setLinkedIn('');
  };

const handleEditImageChange = (e) => {
  const file = e.target.files[0];
  setEditConfigImage(file);
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => setEditPreviewImage(reader.result);
    reader.readAsDataURL(file);
  }
};

  const submitEdit = async () => {
    const name = editConfigName.trim();

    if (!name) {
      setError('Config name cannot be empty.');
      return;
    }

    if (
      usedConfigNames.includes(name.toLowerCase()) &&
      name.toLowerCase() !==
        config.find((c) => c._id === editConfigId)?.name.toLowerCase()
    ) {
      setError('Another category with this name already exists.');
      return;
    }

      const formData = new FormData();
  formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
         formData.append('fb', fb);
        formData.append('insta', insta);
        formData.append('twitter', twitter);
        formData.append('linkedIn', linkedIn);
  if (editConfigImage) {
    formData.append('image', editConfigImage);
  }
    
    try {
      await axios.put(`/api/confi/${editConfigId}`, formData);
      fetchConfig();
      closeEditModal();
    } catch (err) {
      console.error('Edit error:', err);
    } 
  };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add Configuration</h1>

            <form onSubmit={submit} className="bg-white p-4 rounded shadow max-w-md space-y-4" encType="multipart/form-data">
                <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
                <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="w-full p-2 border rounded" />
                <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
                <input type="text" onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full p-2 border rounded" />
                <input type="text" onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="w-full p-2 border rounded" />
                 <input type="text" onChange={(e) => setFB(e.target.value)} placeholder="FB" className="w-full p-2 border rounded" />
                <input type="text" onChange={(e) => setInsta(e.target.value)} placeholder="Insta" className="w-full p-2 border rounded" />
                <input type="text" onChange={(e) => setTwitter(e.target.value)} placeholder="Twitter" className="w-full p-2 border rounded" />
                <input type="text" onChange={(e) => setLinkedIn(e.target.value)} placeholder="LinkedIn" className="w-full p-2 border rounded" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
            </form>

         

      
        <table className="w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Logo</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">FB</th>
              <th className="p-2 border">Insta</th>
              <th className="p-2 border">Twitter</th>
              <th className="p-2 border">LinkedIn</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {config.map((c) => (
  <tr key={c._id} className="text-center">
    <td className="p-2 border">
      <img
        src={c.logo}
        alt={c.name}
        className="h-12 mx-auto cursor-pointer"
        onClick={() => openImageModal(c.logo)}
      />
    </td>
    <td className="p-2 border">{c.name}</td>
     <td className="p-2 border">{c.email}</td>
      <td className="p-2 border">{c.phone}</td>
       <td className="p-2 border">{c.address}</td>
        <td className="p-2 border">{c.fb}</td>
     <td className="p-2 border">{c.insta}</td>
      <td className="p-2 border">{c.twitter}</td>
       <td className="p-2 border">{c.linkedIn}</td>
    <td className="p-2 border space-x-2">
      <button
        onClick={() => openEditModal(c)}
        className="text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
      >
        Edit
      </button>   
    </td>
  </tr>
))}

          </tbody>
        </table>
      

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={closeImageModal}>
          <img
            src={modalImageSrc}
            alt="Category Full View"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Update Config </h3>
            <input
              type="text"
              value={editConfigName}
              onChange={(e) => setEditConfigName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  className="w-full p-2 border border-gray-300 rounded mb-2"
/>
<input
  type="text"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Phone"
  className="w-full p-2 border border-gray-300 rounded mb-2"
/>
<input
  type="text"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  placeholder="Address"
  className="w-full p-2 border border-gray-300 rounded mb-2"
/>
<input
  type="text"
  value={fb}
  onChange={(e) => setFB(e.target.value)}
  placeholder="Facebook"
  className="w-full p-2 border border-gray-300 rounded mb-2"
/>
<input
  type="text"
  value={insta}
  onChange={(e) => setInsta(e.target.value)}
  placeholder="Instagram"
  className="w-full p-2 border border-gray-300 rounded mb-2"
/>
<input
  type="text"
  value={twitter}
  onChange={(e) => setTwitter(e.target.value)}
  placeholder="Twitter"
  className="w-full p-2 border border-gray-300 rounded mb-2"
/>
<input
  type="text"
  value={linkedIn}
  onChange={(e) => setLinkedIn(e.target.value)}
  placeholder="LinkedIn"
  className="w-full p-2 border border-gray-300 rounded mb-2"
/>
            <input
  type="file"
  accept="image/*"
  onChange={handleEditImageChange}
  className="w-full p-2 border border-gray-300 rounded-md mb-2"
/>
{editPreviewImage && (
  <img
    src={editPreviewImage}
    alt="Edit Preview"
    className="h-24 rounded border mb-2"
  />
)}

          
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
    );
}
