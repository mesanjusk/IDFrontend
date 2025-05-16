import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"

export default function AddPrice() {
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [price,setPrice]=useState('')

      useEffect(() => {
          setTimeout(() => {
            const userNameFromState = location.state?.id;
            const user = userNameFromState || localStorage.getItem('User_name');
            setLoggedInUser(user);
            if (user) {
             setLoggedInUser(user)
            } else {
              navigate("/login");
            }
          }, 2000);
          setTimeout(() => setIsLoading(false), 2000);
        }, [location.state, navigate]);

    async function submit(e){
        e.preventDefault();
        try{
            await axios.post("https://idbackend-rf1u.onrender.com/api/prices/add",{
                price
            })
            .then(res=>{
                if(res.data === "exist"){
                    alert("Price already exists")
                }
                else if(res.data === "notexist"){
                    alert("Price added successfully")
                    navigate("/")
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
        navigate("/");
     };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
           
            
            <h1 className="text-2xl font-bold mb-6">Add Price</h1>

            <form  onSubmit={submit} className="bg-white p-4 rounded shadow max-w-md space-y-4">
                
                <input type="price" autoComplete="off" onChange={(e) => { setPrice(e.target.value) }} placeholder="Price" className="w-full p-2 border rounded" />
                         
               
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

