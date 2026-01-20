import React from "react";
import { ShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalQty } from "../../redux/cartSlice";

const HeaderCart = () => {
  const totalQty = useSelector(selectTotalQty);

  return (
    <Link to="/cart">
      <div className="flex items-end justify-center headerHover relative border border-transparent hover:border-white rounded-sm p-2 cursor-pointer">
        <ShoppingCart fontSize="large" className="lg:scale-110" />
        <p className="text-xs lg:text-sm text-light font-bold mt-3 hidden md:inline-flex">
          Cart
        </p>
        <span className="absolute -top-2 left-3 lg:left-7 font-bold text-[#f3a847] text-base lg:text-lg">
            {totalQty > 0 ? totalQty : 0}
        </span>
      </div>
    </Link>
  );
};

export default HeaderCart;