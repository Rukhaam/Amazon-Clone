import React, { createContext, useContext, useState, useCallback } from "react";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc ,
  deleteDoc
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils"; // Check your path

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch All Orders (Memoized so it doesn't loop)
  const fetchAllOrders = useCallback(async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // 2. Update Status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { orderStatus: newStatus });
      
      // Optimistic UI Update (Update local state instantly)
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      return true; // Success
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
      return false;
    }
  };
  const deleteProduct = async (id) => {
    try {
      // Logic check: API IDs are short numbers. We can't delete them.
      if (String(id).length < 5) {
        alert("You cannot delete items from the external API.");
        return false;
      }

      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      return false;
    }
  };

  const value = {
    orders,
    loadingOrders,
    error,
    fetchAllOrders,
    updateOrderStatus,
    deleteProduct
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};