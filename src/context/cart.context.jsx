import React, { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  selectProducts, 
  setCart, // <--- We will create this
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
        
        isInitialLoad.current = true; // Block upload while loading
        
        const cartRef = doc(db, "carts", currentUser.uid);
        const docSnap = await getDoc(cartRef);
        
        if (docSnap.exists()) {
            dispatch(setCart(docSnap.data().items || []));
        }
        
        isInitialLoad.current = false; // Allow uploads now
    };
    
    loadCart();
  }, [currentUser, dispatch]);


  // 2. SYNC CART (Redux -> Firebase)
  useEffect(() => {
    if (!currentUser || isInitialLoad.current) return;
  
    const timeoutId = setTimeout(async () => {
        const cartRef = doc(db, "carts", currentUser.uid);
        
        await setDoc(cartRef, { 
            items: cartItems,
            userName: currentUser.displayName || currentUser.email,
            updatedAt: new Date() // Optional: Good for debugging
        });
        
    }, 500); 
  
    return () => clearTimeout(timeoutId);
  }, [cartItems, currentUser]);


  // 3. EXPOSED HELPER (For Checkout)
  const clearCart = async () => {
     dispatch(resetCart()); 
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