import { FaFacebookMessenger, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { items } = useCart();

  return (
    <div className="flex justify-between items-center p-3 sticky top-0 bg-white z-10">
      <Link to="/" className="text-xl font-bold flex items-center gap-2">
        SK Cards
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-sm text-gray-700 hover:underline">
          Shop
        </Link>
        <Link to="/favorites" className="text-sm text-gray-700 hover:underline">
          Favourites
        </Link>
        <Link to="/cart" className="relative text-2xl text-gray-700">
          <FaShoppingCart />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full text-xs px-1">
              {items.length}
            </span>
          )}
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
