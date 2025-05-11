import { FaFacebookMessenger } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-3 border-b shadow-sm sticky top-0 bg-white z-10">
      <h1 className="text-xl font-bold flex items-center gap-2">
        SK Cards
      </h1>
      <a
        href="https://wa.me/919372333633?text=Hi%2C%20I%20would%20like%20to%20make%20an%20enquiry"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl text-green-600"
      >
        <FaFacebookMessenger />
      </a>
    </div>
  );
};

export default Navbar;
