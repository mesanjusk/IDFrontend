import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = 'https://idbackend-rf1u.onrender.com/api/listings';

const AllListing = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
          setTimeout(() => {
            const userNameFromState = location.state?.id;
            const user = userNameFromState || localStorage.getItem('User_name');
            setLoggedInUser(user);
            if (user) {
             fetchListings(user)
            } else {
              navigate("/login");
            }
          }, 2000);
          setTimeout(() => setLoading(false), 2000);
        }, [location.state, navigate]);

  const fetchListings = async () => {
    try {
      const res = await axios.get(API_URL);
      setListings(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchListings();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleNameEdit = async (id, newTitle) => {
    try {
      await axios.put(`${API_URL}/${id}`, { title: newTitle });
      fetchListings();
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">

      <h3 className="text-xl font-semibold mb-2">All Listing</h3>
      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((list) => (
            <tr key={list._id} className="text-center">
              <td className="p-2 border">
                 {Array.isArray(list.images) && list.images.length > 0 ? (
    <div className="flex gap-2 justify-center">
      {list.images.map((imgUrl, index) => (
        <img
          key={index}
          src={imgUrl}
          alt={`Image ${index + 1}`}
          className="h-12 w-12 object-cover rounded"
        />
      ))}
    </div>
  ) : (
    <span>No image</span>
  )}
              </td>
              <td className="p-2 border">
                <input
                  className="border px-2 py-1 w-full"
                  defaultValue={list.title}
                  onBlur={(e) => handleNameEdit(list._id, e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(list._id)}
                  className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllListing;
