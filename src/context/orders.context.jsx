import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils";
import { useAuth } from "./useAuth";

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
        orderBy("createdAt", "desc"),
      );

      // 2. Listener: Updates automatically if Admin changes status
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const userOrders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setOrders(userOrders);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        },
      );
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

  const value = { orders, loading };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

export const useOrders = () => {
  return useContext(OrdersContext);
};
