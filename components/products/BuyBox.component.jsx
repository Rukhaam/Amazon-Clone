import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/cartSlice";
import LockClosedOutlinedIcon from "@mui/icons-material/LockOutlined";

const BuyBox = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  // === HANDLER: BUY NOW ===
  const handleBuyNow = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: qty,
        description: product.description,
      })
    );
    navigate("/checkout");
  };

  // === HANDLER: ADD TO CART ===
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: qty,
        description: product.description,
      })
    );
  };

  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 flex flex-col gap-3 bg-white">
      {/* Price */}
      <div className="flex items-start gap-1">
        <span className="text-sm pt-1">$</span>
        <span className="text-xl font-medium text-red-700">{product.price}</span>
      </div>

      {/* Delivery Info */}
      <div className="text-sm text-gray-600">
        $15.00 delivery <span className="font-bold text-black">Monday, June 10</span>
      </div>

      <p className="text-lg font-medium text-green-700">In Stock</p>

      {/* Quantity Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Qty:</span>
        <select
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-amazon-yellow cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 10].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-amazon-yellow hover:bg-[#f3a847] py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors border border-yellow-500 cursor-pointer"
      >
        Add to Cart
      </button>

      <button
        onClick={handleBuyNow}
        className="w-full bg-[#fa8900] hover:bg-[#e37b00] py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors border border-orange-600 cursor-pointer"
      >
        Buy Now
      </button>

      {/* Trust Badges */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <LockClosedOutlinedIcon fontSize="small" />
        <span>Secure transaction</span>
      </div>

      <div className="text-xs text-gray-600 mt-2">
        <div className="grid grid-cols-2 gap-x-2">
          <span>Ships from</span> <span className="text-black">Amazon.com</span>
          <span>Sold by</span> <span className="text-black">Amazon.com</span>
        </div>
      </div>
    </div>
  );
};

export default BuyBox;