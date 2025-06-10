// src/context/CartContext.jsx
import { createContext, useContext } from "react";

const CartContext = createContext({
  addToCart: () => {}, // Placeholder
});

export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  return (
    <CartContext.Provider value={{ addToCart: (item) => console.log("Add to cart:", item) }}>
      {children}
    </CartContext.Provider>
  );
};
