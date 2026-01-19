import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/auth.context"; // Ensure path is correct
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/cartSlice";

const UserDropdown = () => {
  // 1. FIX: Destructure 'handleLogout' instead of 'logout'
  const { currentUser, handleLogout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogoutClick = async () => {
    // 2. Clear Cart Logic
    dispatch(resetCart()); 
    
    // 3. Call the Context Logout
    // Pass 'navigate' so the Context can redirect you to Sign In
    await handleLogout(navigate); 
  };

  return (
    <div className="absolute top-14 right-0 w-[500px] bg-white text-black border border-gray-200 rounded-sm shadow-xl z-50 overflow-hidden cursor-default font-bodyFont">
      
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
      <div className="flex px-6 py-4 gap-4">
        
        {/* LEFT COLUMN: Your Lists */}
        <div className="w-1/2 border-r border-gray-200 pr-4">
          <h3 className="font-bold text-base mb-2 text-black">Your Lists</h3>
          <ul className="flex flex-col gap-1 text-sm text-gray-600">
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Create a Wish List</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Wish from Any Website</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Baby Wishlist</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Discover Your Style</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Explore Showroom</li>
          </ul>
        </div>

        {/* RIGHT COLUMN: Your Account */}
        <div className="w-1/2 pl-4">
          <h3 className="font-bold text-base mb-2 text-black">Your Account</h3>
          <ul className="flex flex-col gap-1 text-sm text-gray-600">
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Your Account</li>
            
            {/* Link this to your new Orders Page */}
            <Link to="/orders">
                <li className="hover:text-orange-600 hover:underline cursor-pointer">Your Orders</li>
            </Link>
            
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Your Wish List</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Keep shopping for</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Your Recommendations</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Your Prime Membership</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Your Prime Video</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Your Subscribe & Save Items</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Memberships & Subscriptions</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Your Seller Account</li>
            <li className="hover:text-orange-600 hover:underline cursor-pointer">Manage Your Content and Devices</li>
            
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