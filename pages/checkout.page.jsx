import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectProducts,
  selectTotalPrice,
  selectTotalQty,
} from "../redux/cartSlice";

// === CONTEXT IMPORTS ===
import { useAddress } from "../src/context/adresses.context"; 
import { useCheckout } from "../src/context/checkout.cotext"; // Keeping if you use it for other logic, otherwise optional now

// === COMPONENT IMPORTS ===
import AddressManager from "../components/addresses/adresses.components"; 
import PaymentBtn from "../components/payments/paymentButton"; // <--- IMPORT YOUR COMPONENT

const Checkout = () => {
  // Redux Data
  const products = useSelector(selectProducts);
  const totalQty = useSelector(selectTotalQty);
  const totalPrice = useSelector(selectTotalPrice);

  // Context Data (for validation UI only)
  const { selectedAddress } = useAddress(); 
  const { checkoutError } = useCheckout(); 

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8 font-bodyFont min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* === LEFT SIDE === */}
        <div className="flex-1 flex flex-col gap-6">
            
            {/* 1. Address Manager */}
            <AddressManager />

            {/* 2. Review Items */}
            <div className="bg-white p-6 shadow-md rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">2. Review Items</h3>
                    <Link to="/cart" className="text-sm text-blue-600 hover:underline">
                        Edit Cart
                    </Link>
                </div>
                
                <div className="flex flex-col gap-4">
                    {products.map((item) => (
                        <div key={item.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                            <div className="flex gap-4">
                                <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                                <div>
                                    <p className="font-medium text-sm line-clamp-2 w-full md:w-80">{item.title}</p>
                                    <p className="text-xs text-green-700 font-semibold mt-1">In Stock</p>
                                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <span className="font-bold text-sm text-right">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* === RIGHT SIDE: Order Summary === */}
        <div className="w-full lg:w-80 bg-white p-6 shadow-md rounded-md h-fit sticky top-24 border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>Items ({totalQty}):</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4 text-sm">
            <span>Shipping & handling:</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          
          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
            <span className="text-lg font-bold">Order Total:</span>
            <span className="text-lg font-bold text-red-700">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Context Error Message (if any) */}
          {checkoutError && (
             <p className="text-red-600 text-sm font-semibold mb-2 bg-red-50 p-2 rounded">
                {checkoutError}
             </p>
          )}

          {/* === INTEGRATED PAYMENT BUTTON === */}
          {/* This component now handles the Razorpay click */}
          <PaymentBtn />

          {/* Helper Text for User Feedback */}
          {!selectedAddress && products.length > 0 && (
              <p className="text-red-500 text-xs mt-3 text-center">
                  * Please select a delivery address to pay
              </p>
          )}

          <div className="text-xs text-gray-500 mt-4 text-center leading-4">
              By placing your order, you agree to Amazon's privacy notice and conditions of use.
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;