import React from "react";
import { ShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalQty } from "../../redux/cartSlice";

const HeaderCart = () => {
  const totalQty = useSelector(selectTotalQty);

  return (
    <Link to="/cart">
      <div className="flex flex-col flex-start justify-center headerHover relative">
        <ShoppingCart />
        <p className="text-xs text-light font-light">
          Cart{" "}
          <span className="absolute text-xs -top-2 left-4 font-semibold p-1 h-4 bg-[#f3a847] text-amazon-blue rounded-full flex items-center justify-center">
            {totalQty > 0 ? totalQty : 0}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default HeaderCart;