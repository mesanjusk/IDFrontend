import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full max-w-md mx-auto rounded"
        />
      )}
      <h2 className="text-2xl font-semibold mt-4">{product.title}</h2>
      <p className="mt-2 text-gray-700">{product.description}</p>
      <p className="text-xl font-bold mt-2">₹{product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="bg-pink-600 text-white px-4 py-2 rounded mt-4"
      >
        Add to Cart
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          window.location.href
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-4 text-green-600 underline"
      >
        Share on WhatsApp
      </a>
    </div>
  );
};

export default ProductDetail;
