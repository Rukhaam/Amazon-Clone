import React from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../src/context/orders.context"; 

const Orders = () => {
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10 font-bodyFont">
      <div className="max-w-screen-xl mx-auto p-4 md:p-8">
        
        {/* === BREADCRUMBS & TITLE === */}
        <div className="mb-6">
           <p className="text-sm text-gray-500 mb-2">
             <Link to="/" className="hover:text-amazon-blue underline decoration-transparent hover:decoration-amazon-blue transition-all">
                Home
             </Link> 
             {" › "} 
             <span className="text-amazon-blue">Your Orders</span>
           </p>
           <h1 className="text-3xl font-light text-gray-800">Your Orders</h1>
        </div>

        {/* === EMPTY STATE === */}
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center border border-gray-200">
            <h2 className="text-xl font-bold mb-2 text-gray-800">No orders yet</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't placed an order yet.</p>
            <Link to="/">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 rounded-md font-medium shadow-sm transition-colors duration-200">
                    Start Shopping
                </button>
            </Link>
          </div>
        ) : (
          
          /* === ORDERS LIST === */
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
               // Status Logic Helpers
               const isCancelled = order.orderStatus === 'Cancelled';
               const isDelivered = order.orderStatus === 'Delivered';
               const isShipped = order.orderStatus === 'Shipped';
               
               // Dynamic Status Color
               let statusColor = "text-yellow-600"; // Default (Processing)
               if (isCancelled) statusColor = "text-red-600";
               if (isDelivered) statusColor = "text-green-700";
               if (isShipped) statusColor = "text-blue-600";

               return (
                <div key={order.id} className="border border-gray-300 rounded-lg bg-white overflow-hidden hover:shadow-md transition-shadow duration-300">
                  
                  {/* --- ORDER HEADER --- */}
                  <div className="bg-gray-100 p-4 flex flex-col md:flex-row justify-between text-sm text-gray-600 gap-4 border-b border-gray-200">
                    <div className="flex flex-wrap gap-8">
                      {/* Date */}
                      <div>
                        <p className="uppercase text-xs font-bold text-gray-500 mb-1">Order Placed</p>
                        <p className="font-medium text-gray-800">
                            {order.createdAt?.seconds 
                                ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) 
                                : "Just now"}
                        </p>
                      </div>
                      
                      {/* Total */}
                      <div>
                        <p className="uppercase text-xs font-bold text-gray-500 mb-1">Total</p>
                        <p className="font-bold text-gray-800">${parseFloat(order.amount).toFixed(2)}</p>
                      </div>
                      
                      {/* Ship To */}
                      <div>
                        <p className="uppercase text-xs font-bold text-gray-500 mb-1">Ship To</p>
                        <p className="text-cyan-700 hover:underline cursor-pointer hover:text-orange-700 transition-colors">
                            {order.shippingAddress?.fullName || order.userEmail || "You"}
                        </p>
                      </div>
                    </div>

                    {/* Order ID */}
                    <div className="flex flex-col items-start md:items-end">
                       <p className="uppercase text-xs font-bold text-gray-500 mb-1">Order # {order.id.slice(0, 10)}</p>
                       <div className="flex gap-4 text-cyan-700 text-sm">
                           <span className="hover:underline cursor-pointer hover:text-orange-700">View Invoice</span>
                       </div>
                    </div>
                  </div>

                  {/* --- ORDER BODY --- */}
                  <div className="p-6">
                    
                    {/* Status Badge */}
                    <div className="mb-6">
                        <h2 className={`text-xl font-bold ${statusColor} flex items-center gap-2`}>
                            {isCancelled && <span>❌</span>}
                            {isDelivered && <span>✅</span>}
                            {order.orderStatus || 'Processing'}
                        </h2>
                        
                        {isCancelled ? (
                            <p className="text-sm text-red-500 mt-1 font-medium">This order was cancelled.</p>
                        ) : isDelivered ? (
                            <p className="text-sm text-gray-500 mt-1">Package was left near the front porch.</p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-1">Your items are being prepared.</p>
                        )}
                    </div>

                    {/* Items List */}
                    <div className="flex flex-col gap-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 md:gap-6 items-start">
                          
                          {/* Item Image */}
                          <div className="w-24 h-24 flex-shrink-0 border border-gray-100 bg-white p-1 rounded-sm">
                             <img 
                                src={item.image} 
                                alt={item.title} 
                                className={`w-full h-full object-contain ${isCancelled ? 'opacity-50 grayscale' : ''}`} 
                             />
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex-1">
                            <Link to={`/product/${item.id}`}>
                                <h3 className={`font-medium text-lg leading-tight mb-1 hover:underline cursor-pointer 
                                    ${isCancelled ? 'text-gray-500 line-through' : 'text-cyan-700 hover:text-orange-700'}`}>
                                    {item.title}
                                </h3>
                            </Link>
                            
                            <p className="text-xs text-gray-500 mb-2">
                                Sold by: Amazon Export Sales LLC
                            </p>

                            <div className="flex items-center gap-4">
                                <span className={`font-bold text-sm ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
                                    ${item.price}
                                </span>
                                <span className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                </span>
                            </div>

                            {/* Buttons per item */}
                            {!isCancelled && (
                                <div className="mt-3">
                                    <button className="bg-yellow-400 hover:bg-yellow-500 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm border border-yellow-500">
                                        Buy it again
                                    </button>
                                </div>
                            )}
                          </div>
                          
                        </div>
                      ))}
                    </div>

                  </div>
                  
                  {/* --- FOOTER (Archive/Issue) --- */}
                  <div className="bg-white border-t p-3">
                     <p className="text-xs text-cyan-700 hover:underline cursor-pointer hover:text-orange-700 ml-2">
                        Archive Order
                     </p>
                  </div>

                </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;