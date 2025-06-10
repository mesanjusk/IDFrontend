// AddReligion with list view, duplicate check, modal form, Tailwind-only UI
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function AddReligion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [religions, setReligions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userNameFromState = location.state?.id;
    const user = userNameFromState || localStorage.getItem('User_name');
    if (user) {
      setLoggedInUser(user);
    } else {
      navigate('/login');
    }
    setTimeout(() => setIsLoading(false), 2000);
    fetchReligions();
  }, []);

  const fetchReligions = async () => {
    try {
      const res = await axios.get('/api/religions/GetReligionList');
      setReligions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch religions:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Religion name required');
    const exists = religions.find(r => r.name.toLowerCase() === name.trim().toLowerCase());
    if (exists && !editId) return alert('Religion already exists');

    try {
      if (editId) {
        await axios.put(`/api/religions/update/${editId}`, { name });
        alert('Religion updated successfully');
      } else {
        await axios.post('/api/religions/add', { name });
        alert('Religion added successfully');
      }
      setName('');
      setEditId(null);
      setShowModal(false);
      fetchReligions();
    } catch (err) {
      alert('Failed to submit');
      console.log(err);
    }
  };

  const handleEdit = (r) => {
    setEditId(r.religion_uuid);
    setName(r.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this religion?')) return;
    try {
      await axios.delete(`/api/religions/delete/${id}`);
      fetchReligions();
      alert('Religion deleted');
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Religions</h1>
        <button
          onClick={() => { setEditId(null); setName(''); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >+ Add Religion</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {religions.map(r => (
              <tr key={r.religion_uuid} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(r.religion_uuid)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >Delete</button>
                </td>
              </tr>
            ))}
            {religions.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">No religions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Religion' : 'Add Religion'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Religion Name"
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setName(''); setEditId(null); }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >Cancel</button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >{editId ? 'Update' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
