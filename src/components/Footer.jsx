import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <ul>
            <li>Phone: +1234567890</li>
            <li>Email: contact@yourwebsite.com</li>
            <li>Address: 123 Your Street, Your City</li>
          </ul>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Our Location</h3>
          <p>Find us on the map below:</p>
          {/* You can embed a Google Map here */}
          <div className="h-48 bg-gray-600 rounded-lg">Google Map Embed</div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">What Our Clients Say</h3>
          <ul>
            <li>"Amazing service! Highly recommend!" - Client 1</li>
            <li>"The best experience we ever had." - Client 2</li>
            <li>"Will definitely use again for our events." - Client 3</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-sm mt-12">
        <p>&copy; {new Date().getFullYear()} Your Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
