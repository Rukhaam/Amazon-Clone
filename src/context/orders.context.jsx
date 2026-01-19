import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot // <--- Key for real-time updates
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils"; // Check your path
import { useAuth } from "./auth.context";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;

    if (currentUser) {
      setLoading(true);
      
      // 1. Query: Get orders for THIS user, sorted by newest
      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      // 2. Listener: Updates automatically if Admin changes status
      unsubscribe = onSnapshot(q, (snapshot) => {
        const userOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setOrders(userOrders);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
    } else {
      // If logged out, clear orders
      setOrders([]);
      setLoading(false);
    }

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Helper to manually refresh if needed (though onSnapshot handles it usually)
  const refreshOrders = () => {
    // Placeholder if you switch back to manual fetching later
    console.log("Orders match database automatically."); 
  };

  const value = { orders, loading, refreshOrders };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  return useContext(OrdersContext);
};