import React, { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  selectProducts, 
  setCart, 
  resetCart 
} from "../../redux/cartSlice";
import { db } from "../../firebase/firebase.utils";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "./auth.context";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectProducts);
  const isInitialLoad = useRef(true);

  // 1. LOAD CART (One time on login)
  useEffect(() => {
    const loadCart = async () => {
        if (!currentUser) return;
        
        // Block upload logic while we are fetching data
        isInitialLoad.current = true; 
        
        try {
            const cartRef = doc(db, "carts", currentUser.uid);
            const docSnap = await getDoc(cartRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const rawItems = data.items || [];

                // === THE FIX: SERIALIZATION ===
                // We map through items and convert any Firestore Timestamps to Strings
                const sanitizedItems = rawItems.map((item) => {
                    const newItem = { ...item };

                    // If 'createdAt' exists and is a Firestore Timestamp (has .toDate method)
                    if (newItem.createdAt && typeof newItem.createdAt.toDate === 'function') {
                        newItem.createdAt = newItem.createdAt.toDate().toISOString();
                    }
                    
                    // Do the same for 'updatedAt' if it exists on the item
                    if (newItem.updatedAt && typeof newItem.updatedAt.toDate === 'function') {
                        newItem.updatedAt = newItem.updatedAt.toDate().toISOString();
                    }

                    return newItem;
                });

                dispatch(setCart(sanitizedItems));
            }
        } catch (error) {
            console.error("Error loading cart from Firebase:", error);
        } finally {
             // Allow uploads again after loading is done
            isInitialLoad.current = false;
        }
    };
    
    loadCart();
  }, [currentUser, dispatch]);


  // 2. SYNC CART (Redux -> Firebase)
  useEffect(() => {
    // Don't sync if not logged in OR if we are currently loading initial data
    if (!currentUser || isInitialLoad.current) return;
  
    // Debounce: Wait 500ms after last change before writing to DB
    const timeoutId = setTimeout(async () => {
        try {
            const cartRef = doc(db, "carts", currentUser.uid);
            
            await setDoc(cartRef, { 
                items: cartItems, // Redux items are already serializable
                userName: currentUser.displayName || currentUser.email,
                updatedAt: new Date() // Top level date (ok for Firestore)
            });
        } catch (error) {
            console.error("Error syncing cart to Firebase:", error);
        }
        
    }, 500); 
  
    return () => clearTimeout(timeoutId);
  }, [cartItems, currentUser]);


  // 3. EXPOSED HELPER (For Checkout)
  const clearCart = async () => {
     // 1. Clear Redux
     dispatch(resetCart()); 
     
     // 2. Clear Firebase (Optional: sync will handle this, but explicit is safer)
     if (currentUser) {
         const cartRef = doc(db, "carts", currentUser.uid);
         await setDoc(cartRef, { items: [], updatedAt: new Date() }, { merge: true });
     }
  };

  return (
    <CartContext.Provider value={{ clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};