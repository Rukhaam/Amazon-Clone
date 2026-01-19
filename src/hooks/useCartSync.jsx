import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.utils";
import { selectUser } from "../../redux/user/userSlice"; // Actually, use context or selectUser from auth
import { selectProducts, setCart } from "../../redux/cartSlice";
import { useAuth } from "../context/auth.context";

const useCartSync = () => {
  const { currentUser } = useAuth();
  const cartProducts = useSelector(selectProducts);
  const dispatch = useDispatch();

  // 1. LOAD CART: When User Logs In, fetch from Firestore
  useEffect(() => {
    const fetchCart = async () => {
      if (currentUser) {
        const docRef = doc(db, "carts", currentUser.uid); // Collection: "carts", ID: UserID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // If user has a saved cart, load it into Redux
          // Note: In a real app, you might want to MERGE local items here instead of overwriting
          dispatch(setCart(docSnap.data().products));
          console.log("Cart loaded from cloud");
        }
      }
    };
    fetchCart();
  }, [currentUser, dispatch]);

  // 2. SAVE CART: When Redux Cart changes, save to Firestore
  useEffect(() => {
    const saveCart = async () => {
      if (currentUser && cartProducts.length > 0) {
        const docRef = doc(db, "carts", currentUser.uid);
        await setDoc(docRef, { 
            products: cartProducts, 
            lastUpdated: new Date() 
        }, { merge: true });
        console.log("Cart saved to cloud");
      }
    };

    // We use a small timeout (debounce) so we don't write to DB on every single keystroke if typing qty
    const timeoutId = setTimeout(() => {
        saveCart();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cartProducts, currentUser]);
};

export default useCartSync;