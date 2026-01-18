import { AccountCircle } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useEffect, useRef, useState } from "react";
import SideNavContent from "./sideNavContent";
import { motion } from "framer-motion";
const BottomHeader = () => {
  const [open, IsOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (e.target.contains(ref.current)) {
        IsOpen(false);
        console.log(e.target);
      }
    });
  }, [ref, open]);
  return (
    <div className="w-full px-4 h-9 bg-amazon-light text-white flex items-center">
      
      {/* Trigger Button */}
      <ul className="flex items-center gap-2 text-sm tracking-wide">
        <li className="headerHover" onClick={() => IsOpen(true)}>
          <MenuIcon /> All
        </li>
        <li className="headerHover">Today's Deals</li>
        <li className="headerHover">Customer Service</li>
        <li className="headerHover">Gift Cards</li>
        <li className="headerHover">Registry</li>
        <li className="headerHover">Sell</li>
      </ul>

      {/* Sidebar Overlay */}
      {open && (
        <div className="w-full h-screen text-black fixed top-0 left-0 bg-amazon-blue/50 z-[50]">
          <div className="w-full h-full relative">
            <motion.div
              ref={ref}
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              // FIX 1: Changed 'w-87.5' (invalid) to 'w-[350px]'
              // FIX 2: Added 'overflow-y-scroll' so you can see all menu items
              className="w-[350px] h-full bg-white border border-black overflow-y-scroll"
            >
              <div className="w-full bg-amazon-light text-white py-3 px-5 flex items-center gap-4 text-lg font-semibold sticky top-0 z-50">
                <AccountCircle />
                <h3>Hello, Sign-In</h3>
              </div>
              
              <SideNavContent
                title="Digital Content & Devices"
                one="Amazon Music"
                two="Kindle E-readers & Books"
                three="Amazon Appstore"
              />
              <SideNavContent
                title="Shop By Departments"
                one="Electronics"
                two="Computers"
                three="Smart Home"
              />
              <SideNavContent
                title="Programs and Features"
                one="Gift Cards"
                two="Amazon Live"
                three="International Shopping"
              />
              <SideNavContent
                title="Help and Settings"
                one="Your Account"
                two="Customer Service"
                three="Contact Us"
              />

              {/* Close Button */}
              <span
                onClick={() => IsOpen(false)}
                // FIX 3: Changed 'left-88' (invalid) to 'left-[360px]' to match sidebar width
                className="cursor-pointer absolute top-5 left-[360px] w-10 h-10 text-white flex items-center justify-center border bg-transparent hover:bg-red-500 duration-200"
              >
                <CloseIcon />
              </span>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomHeader;