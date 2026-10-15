import { createContext, useState, useMemo } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders,    setOrders]    = useState([]); // order history

  // Auto-calculated cart count
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Auto-calculated cart total
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // Add to cart
  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Update quantity
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: qty } : item)
    );
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  // Place order — called from Checkout page
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id:          Date.now(),
      items:       [...cartItems],
      total:       cartTotal,
      date:        new Date().toLocaleString("en-IN"),
      status:      "Confirmed",
      paymentMethod: orderDetails.paymentMethod,
      address:     orderDetails.address,
    };
    setOrders(prev => [newOrder, ...prev]); // latest first
    clearCart();
    return newOrder.id;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      orders,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      placeOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
};