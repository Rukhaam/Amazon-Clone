import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/auth.context"; 
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/cartSlice";

const UserDropdown = () => {
  const { currentUser, handleLogout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogoutClick = async () => {
    dispatch(resetCart());
    await handleLogout(navigate);
  };

  return (

    <div className="absolute top-11 right-[-190px] md:right-0 w-[270px] md:w-[500px] lg:w-[600px] xl:w-[700px] max-w-[95vw] bg-white text-black border border-gray-200 rounded-sm shadow-xl z-50 overflow-hidden cursor-default font-bodyFont">
      

      <div className="absolute -top-2 right-8 md:right-8 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>

      {!currentUser && (
        <div className="flex flex-col items-center justify-center gap-1 py-4 border-b border-gray-200 bg-gray-50">
          <Link to="/signin">
            <button className="w-48 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-md py-1 text-sm font-medium shadow-sm cursor-pointer">
              Sign in
            </button>
          </Link>
          <p className="text-xs text-gray-900 mt-1">
            New customer?{" "}
            <Link to="/registration">
              <span className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
                Start here.
              </span>
            </Link>
          </p>
        </div>
      )}

      {/* MENU COLUMNS */}
      <div className="flex flex-col md:flex-row px-4 md:px-6 lg:px-8 py-4 gap-4 lg:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="w-full md:w-1/2 md:border-r border-gray-200 md:pr-4 lg:pr-8 border-b md:border-b-0 pb-4 md:pb-0">
          <h3 className="font-bold text-base lg:text-lg mb-2 text-black">Your Lists</h3>
          <ul className="flex flex-col gap-1 text-sm lg:text-base text-gray-600">
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Create a Wish List
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Wish from Any Website
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Baby Wishlist
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Discover Your Style
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Explore Showroom
            </li>
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-1/2 md:pl-4 lg:pl-8">
          <h3 className="font-bold text-base lg:text-lg mb-2 text-black">Your Account</h3>
          <ul className="flex flex-col gap-1 text-sm lg:text-base text-gray-600">
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Your Account
            </li>

            <Link to="/orders">
              <li className="hover:text-orange-600 hover:underline cursor-pointer">
                Your Orders
              </li>
            </Link>
            <Link to = '/wishlist'>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Your Wish List
            </li>
            </Link>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Keep shopping for
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Your Recommendations
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Your Prime Membership
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Your Prime Video
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Your Subscribe & Save Items
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Memberships & Subscriptions
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Your Seller Account
            </li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">
              Manage Your Content and Devices
            </li>

            {/* SIGN OUT */}
            {currentUser && (
              <li
                onClick={onLogoutClick}
                className="mt-2 pt-2 border-t border-gray-100 hover:text-orange-600 hover:underline cursor-pointer font-medium"
              >
                Sign Out
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;