import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, // <--- 1. Import deleteDoc
  doc,       // <--- 2. Import doc
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils"; 
import { useAuth } from "../../src/context/auth.context";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Addresses (Run on mount or user change)
  useEffect(() => {
    if (!currentUser) {
        setAddresses([]);
        return;
    }

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "addresses"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAddresses(data);
        
        // Auto-select first one if none selected
        if (data.length > 0 && !selectedAddress) setSelectedAddress(data[0]);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [currentUser]);

  // Save Address
  const saveAddress = async (newAddress) => {
    if (!currentUser) return false;
    try {
      const addressData = {
        ...newAddress,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "addresses"), addressData);
      const savedAddress = { id: docRef.id, ...addressData };
      
      setAddresses(prev => [...prev, savedAddress]);
      setSelectedAddress(savedAddress);
      return true;
    } catch (error) {
      console.error("Error saving address:", error);
      return false;
    }
  };

  // 3. NEW: Delete Address
  const deleteAddress = async (addressId) => {
     try {
        await deleteDoc(doc(db, "addresses", addressId));
        // Update Local State
        const updatedList = addresses.filter(addr => addr.id !== addressId);
        setAddresses(updatedList);
        
        // If we deleted the selected one, select the next available
        if (selectedAddress?.id === addressId) {
            setSelectedAddress(updatedList.length > 0 ? updatedList[0] : null);
        }
     } catch (error) {
         console.error("Error deleting address:", error);
     }
  };

  return (
    <AddressContext.Provider 
      value={{ 
        addresses, 
        selectedAddress, 
        setSelectedAddress, 
        saveAddress, 
        deleteAddress, // Export it
        loading 
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);