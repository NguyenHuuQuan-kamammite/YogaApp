import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

// Create the cart context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Provider component that wraps the app and makes cart object available to any child component that calls useCart()
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { userId } = useAuth();

  // Load cart from AsyncStorage when component mounts or user changes
  useEffect(() => {
    const loadCart = async () => {
      if (userId) {
        try {
          const savedCart = await AsyncStorage.getItem(`cart_${userId}`);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        } catch (error) {
          console.error('Error loading cart from AsyncStorage:', error);
        }
      } else {
        // Clear cart when user logs out
        setCartItems([]);
      }
    };
    
    loadCart();
  }, [userId]);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (userId) {
        try {
          if (cartItems.length > 0) {
            await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
          } else {
            // If cart is empty, remove the item from storage
            await AsyncStorage.removeItem(`cart_${userId}`);
          }
        } catch (error) {
          console.error('Error saving cart to AsyncStorage:', error);
        }
      }
    };
    
    saveCart();
  }, [cartItems, userId]);

  // Add item to cart
  const addToCart = (course, instance) => {
    // Check if this course instance is already in the cart
    const existingItemIndex = cartItems.findIndex(
      item => item.instance.id === instance.id
    );

    if (existingItemIndex >= 0) {
      // Item already in cart, don't add it again
      return false;
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { course, instance, addedAt: new Date() }]);
      return true;
    }
  };

  // Remove item from cart
  const removeFromCart = (instanceId) => {
    setCartItems(cartItems.filter(item => item.instance.id !== instanceId));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    if (userId) {
      // Use AsyncStorage to remove the cart data
      AsyncStorage.removeItem(`cart_${userId}`)
        .catch(error => console.error('Error clearing cart from AsyncStorage:', error));
    }
  };

  // Calculate total price of items in cart
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.course.price, 0);
  };

  // Value object that will be passed to any consuming components
  const value = {
    cartItems,
    cartCount: cartItems.length,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};