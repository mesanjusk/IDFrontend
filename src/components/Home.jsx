import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const res = await axios.get('https://idbackend-rf1u.onrender.com/api/images');
      setImages(res.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Image Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {images.map((img) => (
          <div key={img._id} className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer">
            <img 
              src={img.url} 
              alt={img.title} 
              className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200 flex justify-center items-center">
              <p className="text-white text-lg font-semibold">{img.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
