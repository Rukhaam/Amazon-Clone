import React, { useState } from "react";
import { useProducts } from "../../src/context/products.context"; // Get Data
import { useAdmin } from "../../src/context/adminOrder.context";       // Get Actions

const AdminProducts = () => {
  const { products, loading } = useProducts();
  const { deleteProduct } = useAdmin();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingId(id);
      const success = await deleteProduct(id);
      if (success) {
        // Optional: Trigger a refresh if your ProductsContext doesn't auto-sync
        // Since ProductsContext fetches once on mount, you might need to reload 
        // the page to see the item disappear, or we can force a reload:
        window.location.reload(); 
      }
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Products...</div>;

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <span className="text-sm text-gray-500">
            Total Items: {products.length}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-sm uppercase text-gray-600">
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Source</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {products.map((item) => {
               // Determine if it is our custom product (Firebase) or External (API)
               const isCustom = String(item.id).length > 5;

               return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  {/* Image */}
                  <td className="p-4">
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-10 h-10 object-contain"
                    />
                  </td>
                  
                  {/* Title */}
                  <td className="p-4 font-medium max-w-xs truncate" title={item.title}>
                    {item.title}
                  </td>

                  {/* Category */}
                  <td className="p-4 capitalize">
                    {item.category}
                  </td>

                  {/* Price */}
                  <td className="p-4 font-bold text-gray-900">
                    ${item.price}
                  </td>

                  {/* Source Badge */}
                  <td className="p-4">
                    {isCustom ? (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold">
                            Firebase (Yours)
                        </span>
                    ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                            External API
                        </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    {isCustom ? (
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-red-600 hover:text-red-800 font-bold hover:underline text-xs"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                    ) : (
                        <span className="text-gray-400 text-xs italic cursor-not-allowed" title="Read-only from API">
                           Cannot Delete
                        </span>
                    )}
                  </td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;