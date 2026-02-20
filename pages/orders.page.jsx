import React from "react";
import { useAuth } from "../src/context/useAuth";
import { useOrders } from "../src/context/orders.context";
import moment from "moment";

const Orders = () => {
  const { currentUser } = useAuth();
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8 bg-white min-h-screen">
      <h1 className="text-3xl border-b pb-4 mb-6 font-light">Your Orders</h1>

      {!currentUser ? (
        <div>Please sign in to view your orders.</div>
      ) : orders.length === 0 ? (
        <div>You haven't placed any orders yet.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-300 rounded-md bg-white"
            >
              {/* ORDER HEADER */}
              <div className="bg-gray-100 p-4 flex flex-col md:flex-row justify-between text-sm text-gray-600 rounded-t-md gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="uppercase text-xs font-bold">Order Placed</p>
                    <p>
                      {order.createdAt
                        ? moment(order.createdAt.toDate()).format(
                            "MMMM Do YYYY"
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-xs font-bold">Total</p>
                    <p className="text-red-700 font-bold">₹{order.amount}</p>
                  </div>
                  <div>
                    <p className="uppercase text-xs font-bold">Ship To</p>
                    <p className="text-blue-600">
                      {currentUser.displayName || currentUser.email}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="uppercase text-xs font-bold">
                    Order # {order.paymentId || order.id}
                  </p>
                </div>
              </div>

              {/* ORDER BODY */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Status:{" "}
                  <span
                    className={`
                        ${order.status === "Delivered" ? "text-green-600" : ""}
                        ${order.status === "Cancelled" ? "text-red-600" : ""}
                        ${order.status === "Shipped" ? "text-blue-600" : ""}
                        ${
                          !["Delivered", "Cancelled", "Shipped"].includes(
                            order.status
                          )
                            ? "text-yellow-600"
                            : ""
                        }
                    `}
                  >
                    {order.status || "Processing"}
                  </span>
                </h3>

                <div className="flex flex-col gap-4">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center border-b pb-4 last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-contain"
                      />
                      <div>
                        <p className="font-bold text-blue-600 hover:underline line-clamp-2 cursor-pointer">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-red-700">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <p className="text-gray-400 italic">
                      No item details available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
