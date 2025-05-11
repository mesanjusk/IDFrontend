import { useState } from 'react';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <div className="relative select-none">
      <img
        src={images[currentIndex]}
        alt=""
        className={`w-full aspect-square object-cover transition-transform duration-300 ${
          isZoomed ? 'scale-125' : ''
        }`}
        onClick={toggleZoom}
      />

      <button
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full"
        onClick={prevImage}
      >
        &#10094;
      </button>
      <button
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full"
        onClick={nextImage}
      >
        &#10095;
      </button>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
