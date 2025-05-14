import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"

export default function AddSEOT() {
    const navigate = useNavigate();

    const [name,setName]=useState('')

    async function submit(e){
        e.preventDefault();
        try{
            await axios.post("https://idbackend-rf1u.onrender.com/api/seots/add",{
                name
            })
            .then(res=>{
                if(res.data === "exist"){
                    alert("SEOT already exists")
                }
                else if(res.data === "notexist"){
                    alert("SEOT added successfully")
                    navigate("/admin")
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
    const closeModal = () => {
        navigate("/admin");
     };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
           
            
            <h1 className="text-2xl font-bold mb-6">Add SEOTitle</h1>

            <form  onSubmit={submit} className="bg-white p-4 rounded shadow max-w-md space-y-4">
                
                <input type="name" autoComplete="off" onChange={(e) => { setName(e.target.value) }} placeholder="Title Name" className="w-full p-2 border rounded" />
                         
               
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"> Submit </button>
                <button 
                        type="button" 
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                        onClick={closeModal}
                    >
                        Close
                    </button>
            </form>
            
        </div>
    );
}

