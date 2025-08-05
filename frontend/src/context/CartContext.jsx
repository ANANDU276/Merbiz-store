import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const CartContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const userId = user?.id;

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart updated in localStorage:", cart);
  }, [cart]);

  // Fetch cart when user logs in
  useEffect(() => {
    if (userId) {
      console.log("User ID set in CartContext:", userId);
      fetchCartFromServer(userId);
    }
  }, [userId]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!userId) {
      console.log("User logged out, clearing cart...");
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [userId]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      return existing
        ? prevCart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
    });

    if (userId) {
      axios
        .post(`${API_BASE_URL}`, {
          userId,
          product: {
            productId: product._id,
            quantity: 1,
          },
        })
        .then(() => console.log("Synced addToCart to server"))
        .catch((err) =>
          console.error("addToCart sync failed:", err.response?.data || err.message)
        );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));

    if (userId) {
      axios
        .delete(`${API_BASE_URL}/cart/${userId}/${id}`)
        .then(() => console.log("Synced removeFromCart to server"))
        .catch((err) =>
          console.error("removeFromCart sync failed:", err.response?.data || err.message)
        );
    }
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    if (userId) {
      axios
        .post(`${API_BASE_URL}`, {
          userId,
          product: {
            productId: id,
            quantity: 1,
          },
        })
        .then(() => console.log("Synced increaseQuantity to server"))
        .catch((err) =>
          console.error("increaseQuantity sync failed:", err.response?.data || err.message)
        );
    }
  };

  const decreaseQuantity = (id) => {
    const targetItem = cart.find((item) => item._id === id);
    if (!targetItem) return;

    if (targetItem.quantity === 1) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );

      if (userId) {
        axios
          .post(`${API_BASE_URL}`, {
            userId,
            product: {
              productId: id,
              quantity: -1,
            },
          })
          .then(() => console.log("Synced decreaseQuantity to server"))
          .catch((err) =>
            console.error("decreaseQuantity sync failed:", err.response?.data || err.message)
          );
      }
    }
  };

  const fetchCartFromServer = async (uid) => {
    if (!uid) {
      console.warn("No userId provided to fetchCartFromServer");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/cart/${uid}`);
      const serverCart = res.data?.items || [];

      const formatted = serverCart.map((item) => ({
        ...item.productId,
        quantity: item.quantity,
      }));

      setCart(formatted);
      console.log("Cart fetched and loaded:", formatted);
    } catch (err) {
      console.error("Failed to fetch cart from server:", err.response?.data || err.message);
    }
  };

  const syncWithServer = async (uid = userId) => {
    try {
      const syncRequests = cart.map((item) =>
        axios.post(`${API_BASE_URL}/cart`, {
          userId: uid,
          product: {
            productId: item._id,
            quantity: item.quantity,
          },
        })
      );
      await Promise.all(syncRequests);
      console.log("Cart sync complete");
    } catch (err) {
      console.error("Cart sync failed:", err.response?.data || err.message);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");

    if (userId) {
      axios
        .delete(`${API_BASE_URL}/cart/${userId}/all`)
        .then(() => console.log("Cart cleared on server"))
        .catch((err) =>
          console.error("Failed to clear cart on server:", err.response?.data || err.message)
        );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        fetchCartFromServer,
        syncWithServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
