import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectProducts,
  selectTotalPrice,
  selectTotalQty,
  resetCart,
} from "../redux/cartSlice";
import { useCheckout } from "../src/context/checkout.cotext"; // Fixed typo 'cotext' -> 'context'
import { useAddress } from "../src/context/adresses.context"; // <--- 1. Import Address Context
import AddressManager from "../components/addresses/adresses.components"; // <--- 2. Import Manager

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get Context Data
  const { placeOrder, checkoutLoading, checkoutError } = useCheckout();
  const { selectedAddress } = useAddress(); // <--- 3. Get Selected Address

  // Redux Selectors
  const products = useSelector(selectProducts);
  const totalQty = useSelector(selectTotalQty);
  const totalPrice = useSelector(selectTotalPrice);

  const handlePlaceOrder = async () => {
    // 4. Validation: Block if no address selected
    if (!selectedAddress) {
      alert("Please select a delivery address to proceed.");
      return;
    }

    if (products.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // 5. Call Context (Pass selectedAddress instead of local form state)
    const success = await placeOrder(selectedAddress, products, totalPrice);

    if (success) {
      dispatch(resetCart());
      alert("Order Placed Successfully!");
      navigate("/orders");
    }
  };

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8 font-bodyFont min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* === LEFT SIDE === */}
        <div className="flex-1 flex flex-col gap-6">
            
            {/* 1. Address Manager (Replaces old Form) */}
            <AddressManager />

            {/* 2. Review Items (Visual Confirmation) */}
            <div className="bg-white p-6 shadow-md rounded-md border border-gray-200">
                <h3 className="text-xl font-bold mb-4">2. Review Items</h3>
                <div className="flex flex-col gap-4">
                    {products.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.title} className="w-12 h-12 object-contain" />
                                <div>
                                    <p className="font-medium text-sm line-clamp-1 w-32 md:w-64">{item.title}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
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
            <span>Shipping:</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          
          <div className="flex justify-between items-center border-t pt-4 mb-6">
            <span className="text-lg font-bold">Order Total:</span>
            <span className="text-lg font-bold text-red-700">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Context Error Message */}
          {checkoutError && (
             <p className="text-red-600 text-sm font-semibold mb-2 bg-red-50 p-2 rounded">
                {checkoutError}
             </p>
          )}

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={checkoutLoading || products.length === 0}
            className={`w-full py-2 rounded-md font-medium text-black shadow-sm transition-all ${
              checkoutLoading || products.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] active:ring-2 active:ring-yellow-400"
            }`}
          >
            {checkoutLoading ? "Processing..." : "Place Order"}
          </button>

          {/* Helper Text */}
          {!selectedAddress && products.length > 0 && (
              <p className="text-red-500 text-xs mt-2 text-center animate-pulse">
                  Please select a delivery address
              </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;