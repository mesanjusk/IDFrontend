import React from "react";

const Location = () => {
  return (
    <div className="bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-pink-800">Visit Our Store in Gondia 📍</h2>
        <p className="mt-4 text-lg text-pink-700">
          Come see our premium invitation cards in person at our physical store!
        </p>
      </div>

      {/* Google Map Embed */}
      <div className="mt-10 flex justify-center">
        <iframe
          title="S.K Cards Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.563547120657!2d79.9693!3d21.4692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a2b4d2d28e5915f%3A0xf0077ac5cb42c4c2!2sS.K%20Cards!5e0!3m2!1sen!2sin!4v1683378912345!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow-md w-full max-w-4xl"
        ></iframe>
      </div>

      {/* Local Business Info Section */}
      <div className="max-w-5xl mx-auto mt-12 text-center text-pink-800">
        <h2 className="text-2xl font-bold mb-2">S.K Cards – Your Trusted Invitation Partner 💌</h2>
        <p className="text-lg">
          Address: <strong>Hemat Nagar, Gondia, Maharashtra 441601</strong>
        </p>
        <p className="mt-2">
          <a
            href="https://goo.gl/maps/6zFfDq6VfsyBkqV78"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            📍 Get Directions on Google Maps
          </a>
        </p>
        <p className="mt-1">
          Call us:{" "}
          <a href="tel:+919372333633" className="text-blue-600 underline">
            +91 93723 33633
          </a>
        </p>
        <p className="mt-1">
          Hours: <span className="font-semibold">Mon–Sat: 10:00 AM – 8:00 PM</span>, Sun: Closed
        </p>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-4xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-pink-700 mb-4">🌟 What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-pink-50 p-4 rounded shadow">
            <p className="text-pink-800 italic">
              "Absolutely loved the design and print quality! Our wedding cards were a hit."
            </p>
            <p className="text-right mt-2 font-semibold">– Priya W.</p>
          </div>
          <div className="bg-pink-50 p-4 rounded shadow">
            <p className="text-pink-800 italic">
              "Very professional and timely delivery. Will definitely come back for birthdays too!"
            </p>
            <p className="text-right mt-2 font-semibold">– Rohit K.</p>
          </div>
        </div>
      </div>

      {/* LocalBusiness Schema for SEO */}
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "S.K Cards",
          "image": "https://skcards.vercel.app/logo.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Hemat Nagar",
            "addressLocality": "Gondia",
            "addressRegion": "Maharashtra",
            "postalCode": "441601",
            "addressCountry": "IN"
          },
          "url": "https://skcards.vercel.app",
          "telephone": "+919372333633",
          "openingHours": "Mo-Sa 10:00-20:00",
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 21.4692,
            "longitude": 79.9693
          },
          "sameAs": [
            "https://g.co/kgs/BTLJJqR",
            "https://wa.me/919372333633"
          ]
        }
        `}
      </script>
    </div>
  );
};

export default Location;
