import React, { createContext, useContext, useState } from "react";
import {
  collection,
  addDoc, // Use addDoc since we aren't doing a batch for the cart anymore
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils"; // Ensure path is correct
import { useAuth } from "./useAuth";
import { useOrders } from "./orders.context";
import { useCart } from "./cart.context"; // <--- Import useCart

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { refreshOrders } = useOrders();
  const { clearCart } = useCart(); // <--- Get the smart clear function

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const placeOrder = async (shippingAddress, products, totalPrice) => {
    if (!currentUser) {
      setCheckoutError("You must be logged in to place an order.");
      return false;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError("");

      // 1. Prepare Order Data
      const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: products,
        amount: totalPrice,
        shippingAddress: shippingAddress,
        paymentStatus: "Pending",
        orderStatus: "Processing",
        createdAt: serverTimestamp(),
      };

      // 2. Write Order to Firestore
      await addDoc(collection(db, "orders"), orderData);

      // 3. Clear Cart (The Smart Way)
      // This calls the function in CartContext, which clears Redux,
      // which triggers the sync Effect to clear Firestore automatically.
      await clearCart();

      // 4. Update Local State
      refreshOrders();

      return true; // Success
    } catch (error) {
      console.error("Checkout Error:", error);
      setCheckoutError("Failed to place order. Please try again.");
      return false;
    } finally {
      setCheckoutLoading(false);
    }
  };

  const value = {
    placeOrder,
    checkoutLoading,
    checkoutError,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  return useContext(CheckoutContext);
};
