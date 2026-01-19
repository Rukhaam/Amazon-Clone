import React, { useState, useRef, useEffect } from "react";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import { useAuth } from "../../src/context/auth.context";
import UserDropdown from "./userDropdown.component"; // Ensure this path matches where you put UserDropdown

const HeaderAccount = () => {
  const { currentUser } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

  // Close Dropdown on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={userDropdownRef} className="relative">
      <div
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        className="flex flex-col items-start justify-center headerHover cursor-pointer"
      >
        <p className="text-xs text-light-text font-light">
          Hello, {currentUser ? currentUser.displayName : "Sign in"}
        </p>
        <p className="font-semibold text-sm -mt-1 text-white-text">
          Account & Lists <ArrowDropDownOutlined />
        </p>
      </div>

      {/* Render Dropdown Conditionally */}
      {showUserDropdown && <UserDropdown />}
    </div>
  );
};

export default HeaderAccount;