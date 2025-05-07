import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState();

  const fetchImages = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/images');
      setImages(res.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title' , title);

    try {
      await axios.post('http://localhost:9000/api/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Uploaded successfully');
      setFile(null);  
      fetchImages();  
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Image Gallery</h1>

      <div className="flex mb-6 justify-center w-full">
        <div className="flex items-center space-x-4">
        <input 
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
            className="px-4 py-2 border rounded-md text-gray-700"
          />
          <button 
            onClick={handleUpload} 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {images.map((img) => (
          <div key={img._id} className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer">
            <img 
              src={img.url} 
              alt="Uploaded" 
              className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200 flex justify-center items-center">
              <p className="text-white text-lg font-semibold">View Image</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
