import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc 
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils"; // <--- CHECK THIS PATH matches your project structure

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch ALL Products (Run once on mount)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // A. Fetch from External API (The "Base" Catalog)
        const apiResponse = await axios.get("https://fakestoreapi.com/products");
        const apiProducts = apiResponse.data;

        // B. Fetch from Your Firebase (The "Custom" Products)
        const querySnapshot = await getDocs(collection(db, "products"));
        const firebaseProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Firestore IDs are strings
          ...doc.data(),
        }));

        // C. Merge Them!
        // We put Firebase products FIRST so new items appear at the top
        const combinedProducts = [...firebaseProducts, ...apiProducts];

        setProducts(combinedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // 2. HELPER: Fetch Single Product (Used by ProductDetails page)
  const fetchProductById = async (id) => {
    // A. Cache Check: Do we already have it in the main list?
    // We convert both to String comparisons to be safe
    const found = products.find((item) => String(item.id) === String(id));
    
    if (found) {
        return found; // Return instantly (Fast!)
    }

    // B. Network Fetch: If not found (e.g., user refreshed on details page)
    try {
        // Logic: Firebase IDs are long strings (>5 chars). API IDs are short numbers.
        if (String(id).length > 5) {
            // Fetch from Firebase
            const docRef = doc(db, "products", id);
            const snapshot = await getDoc(docRef);
            
            if (snapshot.exists()) {
                return { id: snapshot.id, ...snapshot.data() };
            }
        } else {
            // Fetch from FakeStoreAPI
            const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
            return res.data;
        }
    } catch (error) {
        console.error("Error fetching single product:", error);
        return null;
    }
    
    return null; // Not found
  };

  const value = {
    products,
    loading,
    error,
    fetchProductById, // <--- Exporting the new helper
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductsContext);
};