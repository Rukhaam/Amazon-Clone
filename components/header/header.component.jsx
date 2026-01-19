import React from "react";
import LocationOnOutlineIcon from "@mui/icons-material/LocationOnOutlined";
import { logo } from "../../src/assets/index";
import BottomHeader from "./bottomHeader.component";
import { Link } from "react-router-dom";

// Import new sub-components
import HeaderSearch from "./headerSearch.component";
import HeaderAccount from "./headerAccount.component";
import HeaderCart from "./headerCart.component";

const Header = () => {
  return (
    <div className="w-full bg-amazon-blue sticky top-0 z-50">
      <div className="mx-auto p-5 text-white px-4 gap-4 flex items-center justify-between">
        
        {/* 1. Logo */}
        <Link to="/">
          <div className="headerHover">
            <img src={logo} alt="logo" className="w-24 mt-2" />
          </div>
        </Link>

        {/* 2. Deliver To */}
        <div className="headerHover hidden md:inline-flex">
          <LocationOnOutlineIcon />
          <p className="text-sm text-light-text font-light flex flex-col">
            Deliver to{" "}
            <span className="text-sm font-semibold text-white-text -mt-1">
              India
            </span>
          </p>
        </div>

        {/* 3. Search Bar Component */}
        <HeaderSearch />

        {/* 4. Account & Lists Component */}
        <HeaderAccount />

        {/* 5. Orders (LINKED TO /orders) */}
        <Link to="/orders">
          <div className="hidden lgl:flex flex-col items-start justify-center headerHover">
            <p className="text-xs text-light-text font-light">Returns</p>
            <p className="font-semibold text-1xl -mt-1 text-white">& Orders</p>
          </div>
        </Link>

        {/* 6. Cart Component */}
        <HeaderCart />

      </div>

      <BottomHeader />
    </div>
  );
};

export default Header;