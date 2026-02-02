import React from "react";
import { ShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalQty } from "../../redux/cartSlice";

const HeaderCart = () => {
  const totalQty = useSelector(selectTotalQty);

  return (
    <Link to="/cart">
      <div className="flex items-end justify-center headerHover relative border border-transparent hover:border-white rounded-sm p-1 md:p-2 cursor-pointer">
        <ShoppingCart 
          sx={{ fontSize: { xs: 26, sm: 30, md: 35 } }} 
          className="lg:scale-110" 
        />
        <p className="text-xs lg:text-sm text-light font-bold mt-3 hidden md:inline-flex">
          Cart
        </p>
        <span className="absolute top-0 left-3 sm:left-4 md:top-[-4px] md:left-4 lg:left-7 font-bold text-[#f3a847] text-xs sm:text-sm lg:text-lg">
            {totalQty > 0 ? totalQty : 0}
        </span>
      </div>
    </Link>
  );
};

export default HeaderCart;