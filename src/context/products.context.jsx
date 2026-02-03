import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios"; <--- REMOVE THIS
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.utils"; 

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const querySnapshot = await getDocs(collection(db, "products"));
        
        const firebaseProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));

        setProducts(firebaseProducts);

        // Extract Categories
        const uniqueCategories = [...new Set(firebaseProducts.map(item => item.category))];
        setCategories(uniqueCategories);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products from database.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // 2. HELPER: Fetch Single Product
  const fetchProductById = async (id) => {
    // Check memory first
    const found = products.find((item) => String(item.id) === String(id));
    if (found) return found;

    try {
        // Fetch from Firebase directly
        const docRef = doc(db, "products", id);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() };
        }
    } catch (error) {
        console.error("Error fetching single product:", error);
        return null;
    }
    return null; 
  };

  const value = {
    products,
    categories,
    loading,
    error,
    fetchProductById, 
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