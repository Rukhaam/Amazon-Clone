import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectTotalPrice,
  selectProducts,
  resetCart,
} from "../../redux/cartSlice";
import { useAuth } from "../../src/context/useAuth";
import { logo } from "../../src/assets/index";

const PaymentBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const amount = useSelector(selectTotalPrice);
  const products = useSelector(selectProducts);

  const [loading, setLoading] = useState(false);

  // 1. DEFINE BACKEND URL (Use Vercel variable, fallback to localhost for safety)
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  console.log("MY BACKEND URL IS:", import.meta.env.VITE_BACKEND_URL);
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    setLoading(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load.");
        setLoading(false);
        return;
      }

      // 2. USE BACKEND_URL HERE (Fixed)
      const response = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Server error. Could not create order.");
        setLoading(false);
        return;
      }

      // 3. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZOR_PAY_KEY,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Amazon Clone",
        description: "Transaction",
        image: logo,
        order_id: data.order.id,
        handler: async function (response) {

          await verifyAndSavePayment(response);
        },
        prefill: {
          name: currentUser.displayName || "User",
          email: currentUser.email,
          contact: "9999999999",
        },
        theme: { color: "#F3A847" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Verification Logic (Fixed)
 // 5. Verification Logic
 const verifyAndSavePayment = async (paymentResponse) => {
  try {
    const verifyRes = await fetch(`${BACKEND_URL}/api/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        orderData: {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          amount: amount,
          items: products,
        },
      }),
    });

    const verifyData = await verifyRes.json();
    
    // 🚨 ADD THIS: Print the exact response from the server to your browser console
    console.log("BACKEND VERIFICATION RESPONSE:", verifyData);

    if (verifyData.success) {
      dispatch(resetCart());
      navigate("/orders");
    } else {
      // 🚨 FIX THIS: Show the actual server message in the alert
      alert(`Verification Failed! Reason: ${verifyData.message}`);
    }
  } catch (error) {
    console.error(error);
    alert("Verification Server Error");
  }
};

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full py-3 rounded-md font-medium text-sm shadow-sm transition-colors border border-yellow-500 ${
        loading
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-[#FFD814] hover:bg-[#F7CA00]"
      }`}
    >
      {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
    </button>
  );
};

export default PaymentBtn;
