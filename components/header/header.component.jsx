import React, { useState } from "react";
import LocationOnOutlineIcon from "@mui/icons-material/LocationOnOutlined";
import { logo } from "../../src/assets/index";
import BottomHeader from "./bottomHeader.component";
import { Link } from "react-router-dom";

import HeaderSearch from "./headerSearch.component";
import HeaderAccount from "./headerAccount.component";
import HeaderCart from "./headerCart.component";

import { AuthProvider as useAuth } from "../../src/context/auth.context";
import { useAddress } from "../../src/context/adresses.context";
import LocationModal from "../addresses/locationModel.component";

const Header = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { currentUser } = useAuth();
  const { selectedAddress } = useAddress();

  return (
    <div className="w-full bg-amazon-blue sticky top-0 z-50 font-bodyFont">
      <div className="mx-auto text-white px-1 sm:px-2 md:px-4 py-2 lg:py-3 flex flex-wrap lg:flex-nowrap items-center gap-0 sm:gap-2 md:gap-4 justify-evenly">
        {/* 1. Logo */}
        <Link to="/">
          <div className="headerHover border border-transparent hover:border-white rounded-sm p-1">
            <img
              src={logo}
              alt="logo"
              className="w-11 sm:w-20 lg:w-24 mt-0 lg:mt-2 object-contain"
            />
          </div>
        </Link>

        {/* 2. Deliver To */}
        <div
          onClick={() => setShowLocationModal(true)}
          className="headerHover flex cursor-pointer border border-transparent hover:border-white rounded-sm p-0 sm:p-1 items-center gap-1 order-2 lg:order-none"
        >
          <LocationOnOutlineIcon
            className="mb-1 lg:scale-110"
            sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }}
          />
          <p className="text-[10px] lg:text-sm text-light-text font-light flex flex-col leading-tight">
            <span className="opacity-70 hidden sm:inline">Deliver to</span>
            <span className="text-[10px] lg:text-sm font-bold text-white-text truncate max-w-[70px] sm:max-w-[120px] lg:max-w-none">
              {selectedAddress
                ? `${selectedAddress.city} ${selectedAddress.zip}`
                : currentUser
                ? "Select Location"
                : "India"}
            </span>
          </p>
        </div>

        {/* 3. Search Bar */}
        <div className="w-full order-last lg:order-none lg:flex-1 mt-2 lg:mt-0">
          <HeaderSearch />
        </div>

        {/* Right Side Icons Wrapper */}
        <div className="flex items-center gap-0 sm:gap-1 md:gap-2 lg:gap-4 order-2 lg:order-none">
          <HeaderAccount />
          <Link to="/orders">
            <div className="flex flex-col items-start justify-center headerHover border border-transparent hover:border-white rounded-sm p-0 sm:p-1">
              <p className="text-[9px] sm:text-[10px] lg:text-xs text-light-text font-light">
                Returns
              </p>
              <p className="font-bold text-[9px] sm:text-[10px] md:text-xs lg:text-sm -mt-1 text-white">
                & Orders
              </p>
            </div>
          </Link>

          <HeaderCart />
        </div>
      </div>

      <BottomHeader />

      {showLocationModal && (
        <LocationModal setShowModal={setShowLocationModal} />
      )}
    </div>
  );
};

export default Header;
