import React, { useState, useRef, useEffect } from "react";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import { useAuth } from "../../src/context/auth.context";
import UserDropdown from "./userDropdown.component"; 
// If you implemented the ProfileModal earlier, import it here. 
// Otherwise, this standard version works for the layout fix.

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
        {/* 1. HELLO TEXT: 
            - text-[10px] on mobile
            - max-w-[80px] + truncate to prevent pushing layout
        */}
        <p className="text-[10px] sm:text-xs md:text-sm text-light-text font-light whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] sm:max-w-[150px]">
          Hello, {currentUser ? currentUser.displayName : "Sign in"}
        </p>

        {/* 2. ACCOUNT TEXT: 
            - text-[10px] on mobile
            - Switch text content based on screen size
        */}
        <p className="font-bold text-[10px] sm:text-xs md:text-sm -mt-1 text-white-text flex items-center">
          
          {/* Show 'Account' on tiny screens, 'Account & Lists' on sm+ */}
          <span className="hidden sm:inline">Account & Lists</span>
          <span className="inline sm:hidden">Account</span>
          
          <ArrowDropDownOutlined sx={{ fontSize: { xs: 16, sm: 20 } }} />
        </p>
      </div>

      {showUserDropdown && <UserDropdown />}
    </div>
  );
};

export default HeaderAccount;