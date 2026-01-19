import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem,
  resetCart,
  addToCart,    
  decreaseQty,
  selectProducts,
  selectTotalQty,
  selectTotalPrice,
 } from "../redux/cartSlice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import { emptyCart } from "../assets/index"; // Ensure you have this image or remove it
import { motion } from "framer-motion";
import { Link,useNavigate } from "react-router-dom";
import { logo } from "../src/assets";
import { tr } from "framer-motion/client";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const totalQty = useSelector(selectTotalQty);
  const totalPrice = useSelector(selectTotalPrice);
  const [payNow, setPayNow] = useState(false);
 const navigate  = useNavigate()
  // === EMPTY CART STATE ===
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-4 py-20 bg-white"
      >
        <div className="flex flex-col items-center">
            {/* If you don't have this image, just remove the img tag */}
            <img 
                className="w-80 rounded-lg p-4 mx-auto" 
                src={logo}
                alt="emptyCart" 
            />
        </div>
        <div className="w-96 p-4 bg-white flex flex-col items-center rounded-md shadow-lg">
          <h1 className="font-titleFont text-xl font-bold">
            Your Amazon Cart is empty.
          </h1>
          <p className="text-sm text-center mt-2">
            Check your Saved for Later items below or continue shopping.
          </p>
          <Link to="/">
            <button className="w-full mt-6 bg-amazon-yellow rounded-md py-5 px-4 hover:bg-yellow-500 font-semibold text-amazon-blue transition duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // === ACTIVE CART STATE ===
  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* ==================== LEFT SIDE: CART ITEMS ==================== */}
        <div className="w-full h-full bg-white px-4 col-span-4 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b-[1px] border-b-gray-400 py-3">
            <h2 className="text-3xl font-medium">Shopping Cart</h2>
            <h4 className="text-xl font-normal text-gray-600 hidden md:block">Price</h4>
          </div>

          {/* Items List */}
          <div>
            {products.map((item) => (
              <div
                key={item.id}
                className="w-full border-b-[1px] border-b-gray-300 p-4 flex flex-col md:flex-row items-center gap-6"
              >
                {/* 1. Image */}
                <div className="w-full md:w-1/5 flex items-center justify-center">
                  <img
                    className="w-full h-44 object-contain"
                    src={item.image}
                    alt={item.title}
                  />
                </div>

                {/* 2. Details */}
                <div className="w-full md:w-3/5">
                  <h2 className="font-semibold text-lg">{item.title}</h2>
                  <p className="text-sm text-gray-600 capitalize pr-10">
                    {item.description.substring(0, 150)}...
                  </p>
                  <p className="text-sm text-green-600 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircleIcon fontSize="small" /> In Stock
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Eligible for FREE Shipping & <span className="font-bold">Free Returns</span>
                  </p>

                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="bg-[#F0F2F2] flex justify-center items-center gap-2 px-2 py-1 rounded-md shadow-sm border border-gray-300">
                        <span className="text-xs">Qty:</span>
                        
                        {/* Decrease Button */}
                        <p 
                            onClick={() => dispatch(decreaseQty(item))}
                            className="cursor-pointer bg-gray-200 w-6 h-6 flex items-center justify-center rounded-sm hover:bg-gray-300 duration-100 border border-gray-400"
                        >
                            -
                        </p>
                        
                        <p className="font-semibold text-amazon-blue">{item.quantity}</p>
                        
                        {/* Increase Button */}
                        <p 
                            onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                            className="cursor-pointer bg-gray-200 w-6 h-6 flex items-center justify-center rounded-sm hover:bg-gray-300 duration-100 border border-gray-400"
                        >
                            +
                        </p>
                    </div>

                    <div className="w-[1px] h-4 bg-gray-400"></div>

                    <p 
                        onClick={() => dispatch(deleteItem(item.id))}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                        Delete
                    </p>
                    
                    <div className="w-[1px] h-4 bg-gray-400"></div>

                     <p className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                        Save for later
                    </p>
                  </div>
                </div>

                {/* 3. Price (Per Item * Qty) */}
                <div className="w-full md:w-1/5 flex flex-col items-end">
                   <p className="font-bold text-lg">
                     ${(item.price * item.quantity).toFixed(2)}
                   </p>
                </div>
              </div>
            ))}
          </div>
            
          {/* Reset Cart Button */}
          <div className="w-full py-6 flex items-start justify-end">
             <button
                onClick={() => dispatch(resetCart())}
                className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-700 duration-300 shadow-md"
             >
                Clear Cart
             </button>
          </div>
        </div>

        {/* ==================== RIGHT SIDE: SUBTOTAL BOX ==================== */}
        <div className="w-full h-auto col-span-1">
             <div className="bg-white p-6 rounded shadow-sm flex flex-col gap-4 sticky top-24">
                <p className="text-xs text-gray-600">
                    <span className="text-green-600 font-medium">
                        <CheckCircleIcon fontSize="small"/> Your order qualifies for FREE Shipping.
                    </span> 
                    Choose this option at checkout. See details.
                </p>
                
                <div>
                    <p className="font-semibold text-lg">
                        Subtotal ({totalQty} items): <span className="font-bold">${totalPrice.toFixed(2)}</span>
                    </p>
                </div>

              

                <button 
                    onClick={() =>( 
                      navigate("/checkout"),
                      setPayNow(true)
                    )}
                    className="w-full bg-amazon-yellow hover:bg-yellow-500 py-2 rounded-md font-medium text-sm shadow-sm transition-colors border border-yellow-500"
                >
                    Proceed to Checkout
                </button>
                
                {/* Payment Modal/Placeholder */}
                {payNow && (
                    <div className="w-full mt-4 p-2 border border-green-500 text-green-700 text-xs rounded bg-green-50 text-center">
                        Payment gateway connected!
                    </div>
                )}
             </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
