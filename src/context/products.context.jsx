import React, { createContext, useState, useEffect } from "react";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // 1. New State for Categories
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 2. Fetch both APIs in parallel (More efficient than waiting for one by one)
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("https://fakestoreapi.com/products"),
          fetch("https://fakestoreapi.com/products/categories")
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
console.log(productsData);
console.log(categoriesData);

        setProducts(productsData);
        setCategories(categoriesData); // 3. Set Categories
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    // 4. Expose 'categories' to the rest of the app
    <ProductsContext.Provider value={{ products, categories, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};