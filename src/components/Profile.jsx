import React from 'react';
import { FaCamera, FaInstagram, FaMapMarkerAlt, FaPen } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import Footer from './Footer'; // Import your Footer component

const Profile = () => {
  const userProfile = {
    name: 'Sanju SK Digital',
    bio: 'Photographer | Digital Creator | Graphic Designer',
    posts: 320,
    followers: 4500,
    following: 180,
    image: 'https://instagram.fnag7-1.fna.fbcdn.net/v/t51.2885-19/467017567_463186110140764_722149194584631803_n.jpg?...', // Shorten or host externally
    profileUrl: 'https://skcard.vercel.app/profile',
    instagramUrl: 'https://www.instagram.com/sanju.sk.digital/',
    googleBusinessEmbed:
      'https://www.google.com/maps/embed?pb=!1m2!2m1!1ssanju%20sk%20digital%20gondia!3m1!1s0x3bd3c0f2f7e2b3ef:0x0?entry=ttu',
  };

  return (
    <div className="profile-page bg-white flex flex-col min-h-screen">

      <Helmet>
        <title>{userProfile.name} – Digital Creator Portfolio</title>
        <meta
          name="description"
          content={`${userProfile.name}'s digital portfolio showcasing photography, graphic design, and social presence.`}
        />
        <link rel="canonical" href={userProfile.profileUrl} />
        <meta property="og:title" content={userProfile.name} />
        <meta property="og:description" content={userProfile.bio} />
        <meta property="og:image" content={userProfile.image} />
        <meta property="og:url" content={userProfile.profileUrl} />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: userProfile.name,
            url: userProfile.profileUrl,
            image: userProfile.image,
            description: userProfile.bio,
            sameAs: [userProfile.instagramUrl, 'https://g.co/kgs/bNmV7os'],
          })}
        </script>
      </Helmet>

      {/* Profile Info */}
      <div className="flex items-center p-5 space-x-5 sm:flex-col md:flex-row">
        <img
          src={userProfile.image}
          alt={`${userProfile.name} profile`}
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 mb-4 md:mb-0"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{userProfile.name}</h1>
          <p className="text-sm text-gray-600">{userProfile.bio}</p>
          <div className="mt-2 flex space-x-10 text-sm font-medium">
            <span>{userProfile.posts} Posts</span>
            <span>{userProfile.followers} Followers</span>
            <span>{userProfile.following} Following</span>
          </div>
        </div>
        
      </div>

      {/* Google Business Map */}
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
            title="Sanju SK Digital Location"
          ></iframe>
        </div>
      </div>
 <div className="text-center py-3 text-gray-500 text-sm">
    © {new Date().getFullYear()} Sanju SK Digital. All rights reserved.
  </div>
      <div className="fixed bottom-0 w-full bg-white border-t">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
