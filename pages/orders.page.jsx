import React from "react";
import { useOrders } from "../src/context/orders.context";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  // Get data directly from Context
  const { orders, loading } = useOrders(); 

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen p-6 font-bodyFont">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-light mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-lg">You haven't placed any orders yet.</p>
            <button 
                onClick={() => navigate("/")}
                className="w-fit bg-yellow-400 px-4 py-2 rounded-md font-medium text-sm hover:bg-yellow-500"
            >
                Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-300 rounded-md bg-white"
              >
                {/* ORDER HEADER */}
                <div className="bg-gray-100 p-4 flex flex-col md:flex-row justify-between text-sm text-gray-600 rounded-t-md border-b border-gray-300">
                  <div className="flex gap-8">
                    <div className="flex flex-col">
                      <span className="uppercase text-xs font-bold">Order Placed</span>
                      <span>
                         {order.createdAt?.seconds 
                            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                            : "Just now"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase text-xs font-bold">Total</span>
                      <span>${order.amount}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="uppercase text-xs font-bold">Order ID</span>
                    <span className="text-xs text-gray-500">{order.id}</span>
                  </div>
                </div>

                {/* ORDER BODY (ITEMS) */}
                <div className="p-4 flex flex-col gap-4">
                  {order.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-4 items-center border-b last:border-b-0 pb-4 last:pb-0 border-gray-100">
                      <img
                        className="w-20 h-20 object-contain"
                        src={item.image}
                        alt={item.title}
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-black line-clamp-2 w-full md:w-96 text-sm">
                            {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                        </p>
                        <button 
                           onClick={() => navigate(`/product/${item.id}`)}
                           className="bg-yellow-400 w-fit px-3 py-1 rounded-md text-xs font-medium mt-1 hover:bg-yellow-500 shadow-sm"
                        >
                           Buy it again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;