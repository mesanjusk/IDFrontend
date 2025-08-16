import { FaFacebookMessenger } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-3 sticky top-0 bg-white z-10">
      <h1 className="text-xl font-bold flex items-center gap-2">SK Cards</h1>
      <div className="flex items-center gap-4">
        <Link to="/favorites" className="text-sm text-gray-700 hover:underline">
          Favourites
        </Link>
        <a
          href="https://wa.me/919372333633?text=Hi%2C%20I%20would%20like%20to%20make%20an%20enquiry"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-green-600"
        >
          <FaFacebookMessenger />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
