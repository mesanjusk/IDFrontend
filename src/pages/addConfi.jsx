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

    useEffect(() => {
        setTimeout(() => {
            const userNameFromState = location.state?.id;
            const user = userNameFromState || localStorage.getItem('User_name');
            setLoggedInUser(user);
            if (!user) navigate("/login");
        }, 2000);
        setTimeout(() => setIsLoading(false), 2000);
    }, [location?.state, navigate]);

    async function submit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('logo', logo);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);

        try {
            const res = await axios.post("https://idbackend-rf1u.onrender.com/api/confi/add", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data === "exist") {
                alert("Configuration already exists");
            } else if (res.data === "notexist") {
                alert("Configuration added successfully");
                navigate("/");
            }
        } catch (e) {
            alert("Error uploading data");
            console.log(e);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold mb-6">Add Configuration</h1>

            <form onSubmit={submit} className="bg-white p-4 rounded shadow max-w-md space-y-4" encType="multipart/form-data">
                <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
                <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="w-full p-2 border rounded" />
                <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
                <input type="text" onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full p-2 border rounded" />
                <input type="text" onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="w-full p-2 border rounded" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
            </form>
        </div>
    );
}
