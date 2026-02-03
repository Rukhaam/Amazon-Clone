import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase.utils";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "electronics",
    image: "",
    rating: { rate: 4.5, count: 10 }, // Default fake rating for new products
  });

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

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
    setErrorMsg("");

    try {
      // 1. Validation
      if (!formData.title || !formData.price || !formData.image) {
        setErrorMsg("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      // 2. Prepare Data
      const productPayload = {
        ...formData,
        price: parseFloat(formData.price), // Ensure number
        createdAt: serverTimestamp(),
      };

      // 3. Send to Firestore
      await addDoc(collection(db, "products"), productPayload);

      // 4. Success & Reset
      setSuccessMsg("✅ Product added successfully!");
      setFormData({
        title: "",
        price: "",
        description: "",
        category: "electronics",
        image: "",
        rating: { rate: 0, count: 0 },
      });
    } catch (error) {
      console.error("Error adding product: ", error);
      setErrorMsg("❌ Failed to add product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
          Add New Product
        </h2>

        {/* Messages */}
        {successMsg && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 font-medium rounded animate-fade-in">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium rounded animate-fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Row 1: Title & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                placeholder="e.g. Sony WH-1000XM5 Headphones"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Row 2: Category & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-yellow-400 outline-none cursor-pointer"
              >
                <option value="electronics">Electronics</option>
                <option value="computers">Computers & Accessories</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Kitchen</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="books">Books</option>
                <option value="toys">Toys & Games</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 outline-none transition"
                placeholder="https://..."
                required
              />
            </div>
          </div>

          {/* Image Preview Area */}
          {formData.image && (
            <div className="w-full bg-gray-50 p-4 rounded border border-dashed border-gray-300 flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-2">Image Preview</span>
              <img
                src={formData.image}
                alt="Product Preview"
                className="h-40 object-contain rounded shadow-sm bg-white"
                onError={(e) => {
                  e.target.style.display = "none";
                }} // Hide if broken link
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 outline-none transition resize-y"
              placeholder="Enter detailed product description..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-lg font-bold text-white rounded shadow-md transition-all transform active:scale-95 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-yellow-500"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                Processing...
              </span>
            ) : (
              "Add Product to Inventory"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
