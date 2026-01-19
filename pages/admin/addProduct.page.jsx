import React, { useState } from "react";
import { db } from "../../firebase/firebase.utils"; // Ensure path is correct
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "electronics", // Default category
    image: "", // We will paste a URL here
    rating: { rate: 0, count: 0 } // Initialize rating
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      // 1. Data Validation (Simple check)
      if (!formData.title || !formData.price || !formData.image) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // 2. Prepare Data (Convert price to number)
      const productPayload = {
        ...formData,
        price: parseFloat(formData.price),
        createdAt: serverTimestamp(),
      };

      // 3. Send to Firebase "products" collection
      await addDoc(collection(db, "products"), productPayload);

      // 4. Success & Reset
      setSuccessMsg("Product added successfully!");
      setFormData({
        title: "",
        price: "",
        description: "",
        category: "electronics",
        image: "",
        rating: { rate: 0, count: 0 }
      });

    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
      
      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 outline-none"
            placeholder="e.g. Sony Headphones"
            required
          />
        </div>

        {/* Price & Category Row */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="0.00"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
            >
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Kitchen</option>
              <option value="books">Books</option>
              <option value="toys">Toys</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 outline-none"
            placeholder="https://example.com/image.jpg"
            required
          />
          {formData.image && (
             <img src={formData.image} alt="Preview" className="w-20 h-20 object-contain mt-2 border rounded" />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 outline-none"
            placeholder="Product details..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-bold text-white rounded transition-colors ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;