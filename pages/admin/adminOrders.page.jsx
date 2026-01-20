import React, { useEffect } from "react";
import { useAdmin } from "../../src/context/adminOrder.context"; 

const AdminOrders = () => {
  // Destructure what we need from the context
  const { 
    orders, 
    loadingOrders, 
    fetchAllOrders, 
    updateOrderStatus 
  } = useAdmin();

  // Load orders when this page mounts
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (loadingOrders) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Orders</h2>
      
      {!orders || orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-sm uppercase text-gray-600">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs text-gray-500">
                    {order.id?.slice(0, 8)}...
                  </td>
                  
                  <td className="p-4">
                    {/* Fallback for email field names */}
                    <div className="font-bold">{order.userEmail || order.email || "Unknown User"}</div>
                    <div className="text-xs text-gray-500">
                      {order.createdAt?.seconds 
                        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                        : "Just now"}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {/* FIX: Added Optional Chaining (?.) to prevent crash if items are missing */}
                      {order.items?.map((item, index) => (
                        <span key={index} className="text-xs text-gray-600">
                           {item.quantity}x {item.title ? item.title.substring(0, 20) : "Item"}...
                        </span>
                      ))}
                      {(!order.items || order.items.length === 0) && (
                          <span className="text-xs text-red-400 italic">No items data</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-bold text-green-600">
                    {/* Ensure amount is a number */}
                    ${Number(order.amount || 0).toFixed(2)}
                  </td>

                  <td className="p-4">
                    {/* Normalize status field name (status vs orderStatus) */}
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      (order.status || order.orderStatus) === 'Delivered' ? 'bg-green-100 text-green-800' :
                      (order.status || order.orderStatus) === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      (order.status || order.orderStatus) === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status || order.orderStatus || "Processing"}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={order.status || order.orderStatus || "Processing"}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border rounded p-1 text-xs cursor-pointer outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;