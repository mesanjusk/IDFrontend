import React from 'react';
import { FaCamera, FaInstagram, FaMapMarkerAlt, FaPen } from 'react-icons/fa';
import { Helmet } from './common/HelmetShim';
import Footer from './Footer1';

const Profile = () => {
  const userProfile = {
    name: 'Sanju SK Digital',
    bio: 'Photographer | Digital Creator | Graphic Designer in Gondia, India',
    posts: 320,
    followers: 4500,
    following: 180,
    image: 'https://instagram.fnag7-1.fna.fbcdn.net/...jpg', // Use CDN/shorten
    profileUrl: 'https://skcard.vercel.app/profile',
    instagramUrl: 'https://www.instagram.com/sanju.sk.digital/',
    googleBusinessEmbed:
      'https://www.google.com/maps/embed?pb=!1m2!2m1!1ssanju%20sk%20digital%20gondia!3m1!1s0x3bd3c0f2f7e2b3ef:0x0?entry=ttu',
  };

  return (
    <div className="profile-page bg-white flex flex-col min-h-screen">
      <Helmet>
        <title>{userProfile.name} – Photographer, Designer & Digital Printing in Gondia</title>
        <meta
          name="description"
          content="Sanju SK Digital – Professional digital creator, photographer, and custom printing expert in Gondia. Custom ID cards, wedding invites, trophies & more."
        />
        <link rel="canonical" href={userProfile.profileUrl} />
        <meta property="og:title" content={`${userProfile.name} – Gondia Printing & Design`} />
        <meta property="og:description" content={userProfile.bio} />
        <meta property="og:image" content={userProfile.image} />
        <meta property="og:url" content={userProfile.profileUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="en_IN" />
        <meta name="robots" content="index, follow" />

        {/* Optional Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sanju SK Digital – Gondia Printing Services" />
        <meta name="twitter:description" content="Custom cards, trophies, ID cards & more. Visit now." />
        <meta name="twitter:image" content={userProfile.image} />

        {/* Structured Data for LocalBusiness */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: userProfile.name,
            image: userProfile.image,
            url: userProfile.profileUrl,
            sameAs: [userProfile.instagramUrl, 'https://g.co/kgs/bNmV7os'],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Gondia",
              addressRegion: "Maharashtra",
              addressCountry: "IN",
            },
            description: userProfile.bio,
          })}
        </script>
      </Helmet>

      {/* Profile Info */}
      <div className="flex items-center p-5 space-x-5 sm:flex-col md:flex-row">
        <img
          src={userProfile.image}
          alt=""
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 mb-4 md:mb-0"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{userProfile.name}</h1>
          <p className="text-sm text-gray-600">{userProfile.bio}</p>
          
        </div>
      </div>

      {/* Google Map Embed */}
      <div className="location mt-5 px-5">
        <h2 className="text-xl font-semibold flex items-center mb-3">
          <FaMapMarkerAlt className="mr-2" />
          Business Location
        </h2>
        <div className="w-full h-64 rounded-lg overflow-hidden shadow">
          <iframe
            src={userProfile.googleBusinessEmbed}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Sanju SK Digital Location in Gondia"
          ></iframe>
        </div>
      </div>

      <div className="text-center py-3 text-gray-500 text-sm">
        © {new Date().getFullYear()} {userProfile.name}. All rights reserved.
      </div>

      <div className="fixed bottom-0 ">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
