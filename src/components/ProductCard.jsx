import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <Link to={`/products/${product._id}`} className="flex-1">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-40 object-cover rounded"
          />
        )}
        <h3 className="mt-2 font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold">₹{product.price}</span>
        <button
          onClick={() => addToCart(product)}
          className="bg-pink-600 text-white px-3 py-1 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
