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
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZOR_PAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "Amazon Clone",
      description: "Test Transaction",
      image: logo,
      handler: async function (response) {
        await saveOrder(response);
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
    setLoading(false);
  };

  const saveOrder = async (paymentResponse) => {
    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        email: currentUser.email,
        amount: amount,
        paymentId: paymentResponse.razorpay_payment_id,
        createdAt: serverTimestamp(),
        status: "Shipping",
        items: products,
      });

      dispatch(resetCart());
      navigate("/orders");
    } catch (error) {
      console.error("Error saving order:", error);
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
