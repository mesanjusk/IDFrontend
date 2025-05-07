import { useEffect, useState } from "react";
import axios from "axios";

export default function StoryGallery() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("https://idbackend-rf1u.onrender.com/api/images");
        setImages(res.data);
      } catch (err) {
        console.error("Error fetching story images:", err);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    let interval;
    if (autoPlay && images.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000); // 3 seconds per story
    }
    return () => clearInterval(interval);
  }, [autoPlay, images]);

  const currentImage = images[currentIndex];

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white overflow-hidden">
      <div className="w-[300px] h-[500px] relative rounded-xl overflow-hidden border-4 border-white">
        {currentImage && (
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-0 left-0 w-full flex gap-1 p-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded bg-white ${
                i <= currentIndex ? "opacity-100" : "opacity-30"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setAutoPlay((prev) => !prev)}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg"
        >
          {autoPlay ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg"
        >
          Prev
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg"
        >
          Next.
        </button>
      </div>
    </div>
  );
}
