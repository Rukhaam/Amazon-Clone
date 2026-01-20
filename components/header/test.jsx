import React, { useState } from "react";
import LocationOnOutlineIcon from "@mui/icons-material/LocationOnOutlined";
import { logo } from "../../src/assets/index";
import BottomHeader from "./bottomHeader.component";
import { Link } from "react-router-dom";

// Import existing sub-components (Paths untouched)
import HeaderSearch from "./headerSearch.component";
import HeaderAccount from "./headerAccount.component";
import HeaderCart from "./headerCart.component";

// === NEW IMPORTS FOR LOCATION FEATURE ===
import { useAuth } from "../../src/context/auth.context";
import { useAddress } from "../../src/context/adresses.context";
import LocationModal from "../addresses/locationModel.component";

const Header = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { currentUser } = useAuth();
  const { selectedAddress } = useAddress();

  return (
    <div className="w-full bg-amazon-blue sticky top-0 z-50">
      {/* LAYOUT FIX: 
         - Added lg and xl spacing/padding adjustments.
      */}
      <div className="mx-auto text-white px-2 md:px-4 lg:px-6 xl:px-8 py-3 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 lg:gap-6 xl:gap-8 justify-evenly lg:flex-nowrap">
        {/* 1. Logo */}
        <Link to="/">
          <div className="headerHover border border-transparent hover:border-white rounded-sm p-1">
            <img
              src={logo}
              alt="logo"
              className="w-20 md:w-24 lg:w-28 xl:w-32 mt-0 md:mt-2 object-contain"
            />
          </div>
        </Link>

        {/* 2. Deliver To */}
        <div
          onClick={() => setShowLocationModal(true)}
          className="headerHover flex md:inline-flex cursor-pointer border border-transparent hover:border-white rounded-sm p-1 items-center gap-1 order-2 md:order-none"
        >
          <LocationOnOutlineIcon
            className="mb-1 lg:scale-110"
            fontSize="small"
          />
          <p className="text-xs md:text-sm lg:text-base text-light-text font-light flex flex-col leading-tight">
            Deliver to{" "}
            <span className="text-xs md:text-sm lg:text-base font-bold text-white-text truncate max-w-[200px] md:max-w-none">
              {selectedAddress
                ? `${selectedAddress.city} ${selectedAddress.zip}`
                : currentUser
                ? "Select Location"
                : "India"}
            </span>
          </p>
        </div>

        {/* 3. Search Bar */}
        <div className="w-full order-last md:order-none md:flex-1 mt-2 md:mt-0">
          <HeaderSearch />
        </div>

        {/* Right Side Icons Wrapper */}
        <div className="flex items-center gap-1 md:gap-3 lg:gap-5 xl:gap-6 order-2 md:order-none">
          {/* 4. Account */}
          <HeaderAccount />

          {/* 5. Orders */}
          <Link to="/orders">
            <div className="flex flex-col items-start justify-center headerHover border border-transparent hover:border-white rounded-sm p-1">
              <p className="text-[10px] md:text-xs lg:text-sm text-light-text font-light">
                Returns
              </p>
              <p className="font-bold text-xs md:text-sm lg:text-base -mt-1 text-white">
                & Orders
              </p>
            </div>
          </Link>

          {/* 6. Cart */}
          <HeaderCart />
        </div>
      </div>

      <BottomHeader />

      {/* === RENDER MODAL === */}
      {showLocationModal && (
        <LocationModal setShowModal={setShowLocationModal} />
      )}
    </div>
  );
};

export default Header;
