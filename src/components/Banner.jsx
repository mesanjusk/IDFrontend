import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";


export default function Banner() {
  const [banners, setBanners] = useState([]);
 
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          "https://idbackend-rf1u.onrender.com/api/banners"
        );
        setBanners(response.data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900">
   
      {/* BANNER CAROUSEL */}
      <section className="bg-gray-100 py-4">
        <div className="container mx-auto">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
          >
            {banners.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-40 md:h-64 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={`banner-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      
    </div>
  );
}
