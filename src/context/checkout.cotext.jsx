import React, { createContext, useContext, useState } from "react";
import { 
  collection, 
  doc, 
  writeBatch, // <--- 1. Import writeBatch
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils";
import { useAuth } from "./auth.context"; 
import { useOrders } from "./orders.context"; 

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { refreshOrders } = useOrders(); 
  
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

      // === BATCH WRITE START ===
      const batch = writeBatch(db);

      // 1. Prepare Order Reference
      const newOrderRef = doc(collection(db, "orders")); 
      
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

      // 2. Add Order to Batch
      batch.set(newOrderRef, orderData);

      // 3. Delete Cart from Cloud in same Batch
      const cartRef = doc(db, "carts", currentUser.uid);
      batch.delete(cartRef);

      // 4. Commit Both Actions
      await batch.commit();
      // === BATCH WRITE END ===

      // 5. Update Local State
      refreshOrders(); // Update Orders Page list
      
      return true; // Return success

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
    checkoutError
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