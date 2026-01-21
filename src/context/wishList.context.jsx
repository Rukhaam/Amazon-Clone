import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils"; // Check path
import { useAuth } from "./auth.context";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Wishlist on Load
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser) {
        setWishlist([]);
        return;
      }
      
      setLoading(true);
      try {
        const q = query(
          collection(db, "wishlist"), 
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  // 2. Add to Wishlist
  const addToWishlist = async (product) => {
    if (!currentUser) {
      alert("Please sign in to save items to your Wish List.");
      return;
    }


    const alreadyExists = wishlist.find(item => item.productId === product.id);
    if (alreadyExists) {
      alert("This item is already in your Wish List.");
      return;
    }

    try {
      const newItem = {
        userId: currentUser.uid,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        rating: product.rating || {},
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, "wishlist"), newItem);
      
      // Optimistic UI update
      setWishlist((prev) => [...prev, { ...newItem, id: docRef.id }]);
      alert("Added to Wish List!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // 3. Remove from Wishlist
  const removeFromWishlist = async (itemId) => {
    try {
      await deleteDoc(doc(db, "wishlist", itemId));
      setWishlist((prev) => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);