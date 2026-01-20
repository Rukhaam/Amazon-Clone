import React, { useState, useRef, useEffect } from "react";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import { useAuth } from "../../src/context/auth.context";
import UserDropdown from "./userDropdown.component"; 

const HeaderAccount = () => {
  const { currentUser } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

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
    <div ref={userDropdownRef} className="relative z-50">
      <div
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        className="flex flex-col items-start justify-center headerHover cursor-pointer border border-transparent hover:border-white rounded-sm p-1"
      >
        <p className="text-xs lg:text-sm text-light-text font-light whitespace-nowrap">
          Hello, {currentUser ? currentUser.displayName : "Sign in"}
        </p>
        <p className="font-bold text-sm lg:text-base -mt-1 text-white-text flex items-center">
          Account & Lists <ArrowDropDownOutlined fontSize="small" />
        </p>
      </div>

      {/* Render Dropdown Conditionally */}
      {showUserDropdown && <UserDropdown />}
    </div>
  );
};

export default HeaderAccount;