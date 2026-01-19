import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase.utils";
import { useAuth } from "./auth.context"; // We need the user ID to fetch THEIR orders

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date()); // Used to trigger re-fetch

  // === 1. The Fetching Logic ===
  const fetchOrders = async () => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const ordersRef = collection(db, "orders");
      
      // Query: Get orders where "userId" matches the logged-in user
      const q = query(
        ordersRef, 
        where("userId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      
      const userOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort in memory (Newest First)
      // Note: Firestore requires an index for server-side sorting with 'where', 
      // so client-side sorting is easier for now.
      userOrders.sort((a, b) => b.createdAt - a.createdAt);

      setOrders(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // === 2. Auto-Fetch on Login or Update ===
  useEffect(() => {
    fetchOrders();
  }, [currentUser, lastUpdated]);

  // === 3. Helper to refresh manually (e.g. after Checkout) ===
  const refreshOrders = () => {
    setLastUpdated(new Date());
  };

  const value = {
    orders,
    loading,
    refreshOrders
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

// Custom Hook
export const useOrders = () => {
  return useContext(OrdersContext);
};