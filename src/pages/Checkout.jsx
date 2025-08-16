import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    address: '',
    contact: '',
    paymentMode: 'COD'
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const order = {
      customer: form,
      products: items.map(i => ({ product: i.product._id, quantity: i.qty })),
      totalAmount: total
    };
    try {
      await api.post('/api/orders', order);
      clearCart();
      alert('Order placed successfully');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Checkout</h2>
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="w-full border p-2"
      />
      <input
        required
        placeholder="Address"
        value={form.address}
        onChange={e => setForm({ ...form, address: e.target.value })}
        className="w-full border p-2"
      />
      <input
        required
        placeholder="Contact Number"
        value={form.contact}
        onChange={e => setForm({ ...form, contact: e.target.value })}
        className="w-full border p-2"
      />
      <select
        value={form.paymentMode}
        onChange={e => setForm({ ...form, paymentMode: e.target.value })}
        className="w-full border p-2"
      >
        <option value="COD">Cash on Delivery</option>
        <option value="online">Online Payment</option>
      </select>
      <button
        type="submit"
        className="w-full bg-pink-600 text-white px-4 py-2 rounded"
      >
        Place Order
      </button>
    </form>
  );
};

export default Checkout;
