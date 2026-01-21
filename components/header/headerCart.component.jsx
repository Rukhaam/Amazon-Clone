import React from "react";
import { ShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalQty } from "../../redux/cartSlice";

const HeaderCart = () => {
  const totalQty = useSelector(selectTotalQty);

  return (
    <Link to="/cart">
      {/* Container: Reduced padding (p-1) for mobile to save space */}
      <div className="flex items-end justify-center headerHover relative border border-transparent hover:border-white rounded-sm p-1 md:p-2 cursor-pointer">
        
        {/* Icon: Responsive Font Size 
            - xs: 26px (Mobile)
            - sm: 30px (Tablet)
            - md: 35px (Desktop)
        */}
        <ShoppingCart 
          sx={{ fontSize: { xs: 26, sm: 30, md: 35 } }} 
          className="lg:scale-110" 
        />
        
        <p className="text-xs lg:text-sm text-light font-bold mt-3 hidden md:inline-flex">
          Cart
        </p>
        
        {/* Count Badge: Adjusted positioning for smaller icons */}
        <span className="absolute top-0 left-3 sm:left-4 md:top-[-4px] md:left-4 lg:left-7 font-bold text-[#f3a847] text-xs sm:text-sm lg:text-lg">
            {totalQty > 0 ? totalQty : 0}
        </span>
      </div>
    </Link>
  );
};

export default HeaderCart;