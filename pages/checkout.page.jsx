import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  selectProducts, 
  selectTotalPrice, 
  selectTotalQty, 
  resetCart 
} from "../redux/cartSlice";
import { useAuth } from "../src/context/auth.context";
import { useCheckout } from "../src/context/checkout.cotext"; 

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Get logic from Context
  const { placeOrder, checkoutLoading, checkoutError } = useCheckout();

  const products = useSelector(selectProducts);
  const totalQty = useSelector(selectTotalQty);
  const totalPrice = useSelector(selectTotalPrice);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: currentUser?.displayName || "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // 1. Call Context (Handles DB Order + DB Cart Deletion)
    const success = await placeOrder(shippingAddress, products, totalPrice);

    if (success) {
      // 2. Clear Redux Cart (Handles UI + Local Storage)
      dispatch(resetCart()); 

      // 3. Navigate
      alert("Order Placed Successfully!");
      navigate("/orders"); 
    }
  };

  return (
    <div className="w-full bg-gray-100 p-8 font-bodyFont min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: Shipping Form */}
        <div className="flex-1 bg-white p-6 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">Shipping Address</h2>
          
          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
             {/* Inputs same as before... */}
             <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input required name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none focus:border-yellow-500" type="text" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input required name="address" value={shippingAddress.address} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none focus:border-yellow-500" type="text" />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input required name="city" value={shippingAddress.city} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none focus:border-yellow-500" type="text" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input required name="postalCode" value={shippingAddress.postalCode} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none focus:border-yellow-500" type="text" />
                </div>
            </div>

            {/* Error Message from Context */}
            {checkoutError && (
               <p className="text-red-600 text-sm font-semibold">{checkoutError}</p>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
                * This is a demo checkout. No payment is required yet.
            </p>
            
             {/* Hidden submit button to allow "Enter" key submission */}
             <button type="submit" className="hidden" />
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="w-full lg:w-80 bg-white p-6 shadow-md rounded-md h-fit">
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
             <span className="text-lg font-bold text-red-700">${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={checkoutLoading || products.length === 0}
            className={`w-full py-2 rounded-md font-medium text-black shadow-sm ${
                checkoutLoading || products.length === 0 
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] active:ring-2 active:ring-yellow-400"
            }`}
          >
            {checkoutLoading ? "Processing..." : "Place Order"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Checkout;