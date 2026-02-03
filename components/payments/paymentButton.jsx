import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectTotalPrice,
  selectProducts,
  resetCart,
} from "../../redux/cartSlice";
import { useAuth } from "../../src/context/auth.context";
import { db } from "../../firebase/firebase.utils";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { logo } from "../../src/assets/index";

const PaymentBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const amount = useSelector(selectTotalPrice);
  const products = useSelector(selectProducts);

  const [loading, setLoading] = useState(false);

  // 1. Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. Handle Payment Initiation
  const handlePayment = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    setLoading(true);

    try {
      // A. Load SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load.");
        setLoading(false);
        return;
      }

      // B. Create Order via BACKEND
      const response = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amount }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        console.error("Server Error:", data);
        alert("Server error. Could not create order.");
        setLoading(false);
        return;
      }

      // C. Open Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZOR_PAY_KEY, // Public Key
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Amazon Clone",
        description: "Transaction",
        image: logo,
        order_id: data.order.id, // Order ID from Backend
        handler: async function (response) {
          // Verify signature on backend before saving
          await verifyPayment(response);
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
      alert("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify Signature
  const verifyPayment = async (paymentResponse) => {
    try {
      const verifyRes = await fetch(
        "http://localhost:5000/api/payment/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          }),
        },
      );

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        // Verification Successful -> Save to Firebase
        await saveOrder(paymentResponse);
      } else {
        alert("Payment Verification Failed! Contact Support.");
      }
    } catch (error) {
      console.error(error);
      alert("Verification Server Error");
    }
  };

  // 4. Save to Firebase (No Email)
  const saveOrder = async (paymentResponse) => {
    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        userEmail: currentUser.email, // Saving email for future admin use
        amount: amount,
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id, // Official Razorpay Order ID
        createdAt: serverTimestamp(),
        status: "Processing",
        items: products,
      });

      dispatch(resetCart());
      navigate("/orders");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Payment succeeded but failed to save order.");
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
