import React, { useState } from "react";
import axios from "axios";
import { db } from "../../firebase/firebase.utils"; // Check path
import { collection, writeBatch, doc } from "firebase/firestore";

const MigrateData = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleMigration = async () => {
    if (!window.confirm("This will copy API products to Firebase. Continue?")) return;
    
    setLoading(true);
    setStatus("Fetching data from API...");

    try {
      // 1. Fetch from FakeStoreAPI
      const { data: products } = await axios.get("https://fakestoreapi.com/products");
      
      setStatus(`Found ${products.length} products. Uploading to Firebase...`);

      // 2. Use a Batch Write (Faster & Safer)
      const batch = writeBatch(db);
      
      products.forEach((product) => {
        // Create a reference with a custom ID (or let Firebase generate one)
        // We'll use the API ID to avoid duplicates if you run this twice
        const docRef = doc(db, "products", `api_${product.id}`);
        
        batch.set(docRef, {
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          rating: product.rating, // { rate: 3.9, count: 120 }
          source: "api_migration", // Tagging it just in case
          createdAt: new Date()
        });
      });

      // 3. Commit the changes
      await batch.commit();
      
      setStatus("Success! All products have been moved to Firebase.");
    } catch (error) {
      console.error("Migration Failed:", error);
      setStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-blue-500 bg-blue-50 rounded-md my-4">
      <h3 className="font-bold text-lg mb-2">Database Migration Tool</h3>
      <p className="text-sm text-gray-600 mb-4">
        Clicking this will fetch all products from FakeStoreAPI and save them permanently into your Firestore "products" collection.
      </p>
      
      <button 
        onClick={handleMigration} 
        disabled={loading}
        className={`px-4 py-2 rounded text-white font-bold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? "Moving Data..." : "Import Products to Firebase"}
      </button>

      {status && <p className="mt-2 font-mono text-sm">{status}</p>}
    </div>
  );
};

export default MigrateData;