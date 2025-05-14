import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"

export default function AddUser() {
    const navigate = useNavigate();

    const [User_name,setUser_Name]=useState('')
    const [Password,setPassword]=useState('')
    const [Mobile_number,setMobile_Number]=useState('')


    async function submit(e){
        e.preventDefault();
        try{
            await axios.post("http://localhost:5000/api/users/addUser",{
                User_name, Password, Mobile_number
            })
            .then(res=>{
                if(res.data=="exist"){
                    alert("User already exists")
                }
                else if(res.data=="notexist"){
                    alert("User added successfully")
                    navigate("/home")
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })
        }
        catch(e){
            console.log(e);

        }
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6">
           
            <h1 className="text-2xl font-bold mb-6">Add User</h1>

            <form onSubmit={submit} className="bg-white p-4 rounded shadow max-w-md space-y-4">
               
                <input type="Username" autoComplete="off" onChange={(e) => { setUser_Name(e.target.value) }} placeholder="User Name" className="w-full p-2 border rounded" />
               
                <input type="password" autoComplete="off" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" className="w-full p-2 border rounded" />
              
                <input type="mobilenumber" autoComplete="off" onChange={(e) => { setMobile_Number(e.target.value) }} placeholder="Mobile Number" className="w-full p-2 border rounded" />
                          
                
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"> Submit </button>

            </form>
        </div>
    );
}

