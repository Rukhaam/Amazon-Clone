import React, { useState, useCallback } from "react";
import { db } from "../../firebase/firebase.utils";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { AdminOrderContext } from "./AdminOrderContext";

export const AdminProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 1. Fetch All Orders
  const fetchAllOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      // Get all orders sorted by newest first
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // 2. Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // A. Update Firebase
      const orderRef = doc(db, "orders", orderId);

      // We update both common field names to be safe
      await updateDoc(orderRef, {
        status: newStatus,
        orderStatus: newStatus,
      });

      // B. Update Local State (Crucial for UI to reflect change)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, orderStatus: newStatus }
            : order,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status in database.");
    }
  };

  return (
    <AdminOrderContext.Provider
      value={{
        orders,
        loadingOrders,
        fetchAllOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </AdminOrderContext.Provider>
  );
};
